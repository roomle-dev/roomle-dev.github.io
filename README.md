## roomle-dev.github.io

General purpose repo for hosting development related pages/demos.

Each subfolder in this directory acts as a page, for example the `transparency` folder will be accessible via https://roomle-dev.github.io/transparency/, nested pages currently don't work.

### Developing

#### Dependencies

> [!IMPORTANT]
> Installing dependencies via `npm install` will install dependencies for all subprojects because this repo is treated as a monorepo with `workspaces` in package.json.

### Creating a new project
```bash
npm run new
```

This will run the vite setup, so you can quickly scaffold a new project to add to this GitHub pages page.

### Building

As long as your project has a `build` command in its `package.json` the `build-all.js` script will build projects in the folders immediately adjacent to the root `package.json` (one level deep).

After the build for each project is done it will copy the `dist` folder from that project into `out/<project-name>`. So it will be accessible via that URL.

Your project's `dist` folder must have an `index.html` in it, otherwise GitHub pages will not be able to find the projects URL.

It's mandatory to set the `base` option in the vite config, so vite will know to generate relative paths for the final build, for example:

```js
export default defineConfig({
    plugins: [vue()],
    base: "/transparency/", // Will build the project so https://roomle-dev.github.io/transparency is accessible properly
});
```

### Deploying

The `deploy` script will build all projects, then upload all the files in the `out` folder generated after building to GitHub pages, it may take a minute or two for the changes to go live.

Builds all projects and deploys it.

```bash
npm run deploy
```
