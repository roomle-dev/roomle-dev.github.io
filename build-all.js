const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const ignoreFolders = ['node_modules', '.git', 'out', '.vscode', '.idea'];

async function buildProjects() {
    try {
        // Get all directories in the current folder
        const entries = await fs.readdir('.', { withFileTypes: true });
        const dirs = entries.filter(entry => entry.isDirectory() && !ignoreFolders.includes(entry.name));

        // Create the 'out' directory if it doesn't exist
        await fs.mkdir('out', { recursive: true });

        for (const dir of dirs) {
            const projectPath = path.join('.', dir.name);
            const packageJsonPath = path.join(projectPath, 'package.json');

            try {
                // Check if package.json exists
                await fs.access(packageJsonPath);

                // Read and parse package.json
                const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

                // Check if the 'build' script exists
                if (packageJson.scripts && packageJson.scripts.build) {
                    console.log(`Building ${dir.name}...`);

                    // Run the build script
                    execSync('npm run build', { cwd: projectPath, stdio: 'inherit' });

                    // Check if 'dist' folder exists after build
                    const distPath = path.join(projectPath, 'dist');
                    try {
                        await fs.access(distPath);

                        // Create project-specific folder in 'out'
                        const outProjectPath = path.join('out', dir.name);
                        await fs.mkdir(outProjectPath, { recursive: true });

                        // Move contents of 'dist' to 'out/project-name'
                        const distContents = await fs.readdir(distPath);
                        for (const item of distContents) {
                            const srcPath = path.join(distPath, item);
                            const destPath = path.join(outProjectPath, item);
                            await fs.rename(srcPath, destPath);
                        }

                        console.log(`${dir.name} built and moved to out/${dir.name}`);
                    } catch (error) {
                        console.error(`No 'dist' folder found for ${dir.name} after build`);
                    }
                } else {
                    console.log(`No 'build' script found for ${dir.name}, skipping...`);
                }
            } catch (error) {
                console.error(`Error processing ${dir.name}:`, error.message);
            }
        }

        console.log('All projects processed');
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

buildProjects();
