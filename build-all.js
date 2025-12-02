const fs = require('fs').promises;
const path = require('path');
const {execSync} = require('child_process');

const wait = async (delay) =>
    new Promise((resolve) => setTimeout(resolve, delay));

async function buildProjects() {
    try {
        // Read package.json to get workspaces
        const rootPackageJsonPath = path.join('.', 'package.json');
        const rootPackageJson = JSON.parse(await fs.readFile(rootPackageJsonPath, 'utf-8'));

        // Get workspace directories
        const dirs = rootPackageJson.workspaces || [];

        if (dirs.length === 0) {
            console.log('No workspaces found in package.json');
            return;
        }

        console.log(`Found ${dirs.length} workspace(s): ${dirs.join(', ')}`);

        // Delete the 'out' directory if it exists
        try {
            await fs.rm('out', {recursive: true, force: true});
            console.log('Cleaned up existing out folder');
        } catch (err) {
            // Ignore if doesn't exist
        }

        // Create the 'out' directory
        await fs.mkdir('out', {recursive: true});

        // Collect features for docs
        const features = [];

        for (const dir of dirs) {
            const projectPath = path.join('.', dir);
            const packageJsonPath = path.join(projectPath, 'package.json');

            try {
                // Check if package.json exists
                await fs.access(packageJsonPath);

                // Read and parse package.json
                const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

                // Collect name and description for docs
                if (packageJson.name && packageJson.description) {
                    features.push({
                        title: packageJson.name,
                        details: packageJson.description,
                        link: `https://github.com/roomle-dev/roomle-dev.github.io/tree/master/${dir}`,
                        target: '_blank'
                    });
                }

                // Check if the 'build' script exists
                if (packageJson.scripts && packageJson.scripts.build) {
                    console.log(`Building ${dir}...`);

                    // Run the build script
                    execSync('npm run build', {cwd: projectPath, stdio: 'inherit'});

                    await wait(1000);

                    // Check if 'dist' folder exists after build
                    const distPath = path.join(projectPath, 'dist');
                    try {
                        await fs.access(distPath);

                        // Create project-specific folder in 'out'
                        const outProjectPath = path.join('out', dir);
                        await fs.mkdir(outProjectPath, {recursive: true});

                        // Move contents of 'dist' to 'out/project-name'
                        const distContents = await fs.readdir(distPath);
                        for (const item of distContents) {
                            const srcPath = path.join(distPath, item);
                            const destPath = path.join(outProjectPath, item);
                            await fs.rename(srcPath, destPath);
                        }

                        console.log(`${dir} built and moved to out/${dir}`);
                    } catch (error) {
                        console.error(`No 'dist' folder found for ${dir} after build`);
                    }
                } else {
                    console.log(`No 'build' script found for ${dir}, skipping...`);
                }
            } catch (error) {
                console.error(`Error processing ${dir}:`, error.message);
            }
        }

        console.log('All projects processed');

        // Update docs/index.md with features
        if (features.length > 0) {
            console.log('Updating docs/index.md with project features...');
            const docsIndexPath = path.join('docs', 'index.md');
            const docsContent = await fs.readFile(docsIndexPath, 'utf-8');

            // Build features section
            const featuresYaml = features.map(f =>
                `  - title: ${f.title}\n    details: ${f.details}\n    link: ${f.link}\n    target: '${f.target}'`
            ).join('\n');

            // Replace features section in frontmatter
            const updatedContent = docsContent.replace(
                /features:[\s\S]*?---/,
                `features:\n${featuresYaml}\n---`
            );

            await fs.writeFile(docsIndexPath, updatedContent, 'utf-8');
            console.log('docs/index.md updated with features');
        }

        // Build docs
        console.log('Building documentation...');
        execSync('npm run docs:build', {stdio: 'inherit'});

        // Move .vitepress/dist contents to out
        console.log('Moving documentation to out folder...');
        const distPath = path.join('.vitepress', 'dist');
        try {
            await fs.access(distPath);
            const distContents = await fs.readdir(distPath);

            for (const item of distContents) {
                const srcPath = path.join(distPath, item);
                const destPath = path.join('out', item);

                // Remove destination if it exists
                try {
                    await fs.rm(destPath, {recursive: true, force: true});
                } catch (err) {
                    // Ignore if doesn't exist
                }

                // Move the item
                await fs.rename(srcPath, destPath);
            }

            console.log('Documentation moved to out folder');
        } catch (error) {
            console.error('Error moving documentation:', error.message);
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

buildProjects();
