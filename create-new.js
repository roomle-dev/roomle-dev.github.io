const fs = require('fs').promises;
const path = require('path');
const {spawn} = require('child_process');
const readline = require('readline');

const ignoreFolders = ['node_modules', '.git', 'out', '.vscode', '.idea', 'docs', '.vitepress'];

function promptProjectName() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Project name: ', (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function waitForFile(filePath, timeout = 30000, interval = 500) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        try {
            await fs.access(filePath);
            return true;
        } catch (err) {
            // File doesn't exist yet, wait and try again
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }

    return false;
}

async function addBaseToViteConfig(projectName) {
    const configPaths = [
        path.join(projectName, 'vite.config.ts'),
        path.join(projectName, 'vite.config.js'),
        path.join(projectName, 'vite.config.mts'),
        path.join(projectName, 'vite.config.mjs')
    ];

    let configPath = null;
    for (const p of configPaths) {
        try {
            await fs.access(p);
            configPath = p;
            break;
        } catch (err) {
            // Try next path
        }
    }

    if (!configPath) {
        console.warn('Warning: Could not find vite config file');
        return false;
    }

    console.log(`\nUpdating ${path.basename(configPath)} with base path...`);

    let content = await fs.readFile(configPath, 'utf-8');

    // Check if base is already defined
    if (content.includes('base:')) {
        console.log('Base property already exists in config');
        return true;
    }

    // Add base property to the config
    // Look for the defineConfig call and add base property
    const baseProperty = `base: '/${projectName}/',`;

    if (content.includes('export default defineConfig({')) {
        // Add after the opening brace
        content = content.replace(
            /export default defineConfig\(\{/,
            `export default defineConfig({\n  ${baseProperty}`
        );
    } else if (content.includes('defineConfig({')) {
        // Handle case where it's not exported inline
        content = content.replace(
            /defineConfig\(\{/,
            `defineConfig({\n  ${baseProperty}`
        );
    } else {
        console.warn('Warning: Could not find defineConfig in vite config');
        return false;
    }

    await fs.writeFile(configPath, content, 'utf-8');
    console.log(`✓ Added base: '/${projectName}/' to vite config`);
    return true;
}

async function createNew() {
    try {
        // Prompt for project name
        const projectName = await promptProjectName();

        if (!projectName) {
            console.error('Error: Project name is required');
            process.exit(1);
        }

        console.log(`\nCreating project: ${projectName}`);

        // Read package.json
        const packageJsonPath = path.join('.', 'package.json');
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

        // Ensure workspaces array exists
        if (!packageJson.workspaces) {
            packageJson.workspaces = [];
        }

        // Add project to workspaces if not already present
        if (!packageJson.workspaces.includes(projectName)) {
            packageJson.workspaces.push(projectName);
            console.log(`Added "${projectName}" to workspaces`);
        } else {
            console.log(`"${projectName}" already in workspaces`);
        }

        // Write back to package.json with proper formatting
        await fs.writeFile(
            packageJsonPath,
            JSON.stringify(packageJson, null, 2) + '\n',
            'utf-8'
        );

        console.log('package.json updated\n');

        // Run the vite creation command with the project name
        console.log('Running npm create vite@latest...');

        const child = spawn('npm', ['create', 'vite@latest', projectName], {
            stdio: 'inherit',
            shell: true
        });

        // Start watching for vite config file in the background
        const configWatcher = (async () => {
            // Wait a bit for the project folder to be created
            const projectPath = path.join('.', projectName);
            const folderExists = await waitForFile(projectPath, 30000);

            if (!folderExists) {
                console.warn('\nWarning: Project folder not created within timeout');
                return;
            }

            // Now wait for any vite config file
            const configPaths = [
                path.join(projectName, 'vite.config.ts'),
                path.join(projectName, 'vite.config.js'),
                path.join(projectName, 'vite.config.mts'),
                path.join(projectName, 'vite.config.mjs')
            ];

            let foundConfig = false;
            for (const configPath of configPaths) {
                if (await waitForFile(configPath, 30000)) {
                    foundConfig = true;
                    // Wait a tiny bit to ensure file is fully written
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await addBaseToViteConfig(projectName);
                    break;
                }
            }

            if (!foundConfig) {
                console.warn('\nWarning: Vite config file not found within timeout');
                console.log('Creating vite.config.js with base configuration...');

                const configPath = path.join(projectName, 'vite.config.js');
                const configContent = `import { defineConfig } from 'vite'

export default defineConfig({
  base: '/${projectName}/'
})
`;

                try {
                    await fs.writeFile(configPath, configContent, 'utf-8');
                    console.log(`✓ Created vite.config.js with base: '/${projectName}/'`);
                } catch (err) {
                    console.error('Error creating vite.config.js:', err.message);
                }
            }
        })();

        // Wait for the child process to complete or handle it running indefinitely
        await new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code !== 0 && code !== null) {
                    reject(new Error(`Process exited with code ${code}`));
                } else {
                    resolve();
                }
            });

            child.on('error', (err) => {
                reject(err);
            });

            // If process runs for more than 5 seconds, assume dev server started
            const timeout = setTimeout(() => {
                console.log('\n✓ Project created and dev server may be running');
                console.log('Press Ctrl+C to stop the dev server if it\'s running');
            }, 5000);

            child.on('close', () => {
                clearTimeout(timeout);
            });
        }).catch(err => {
            // Process might still be running (dev server case)
            // This is okay, we just continue
        });

        // Make sure config watcher completes
        await configWatcher;

        console.log(`\n✓ Project "${projectName}" setup complete!`);
        console.log(`\nNext steps:\n  cd ${projectName}\n  npm install\n  npm run dev`);

    } catch (error) {
        console.error('An error occurred:', error.message);
        process.exit(1);
    }
}

createNew();
