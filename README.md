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

This does the following.
- Initializes a new vite project with `npx create vite@latest`.
- Adds the project to the root package.json `workspaces`.
- Will attempt to add `base: "/folder-name-here/"` to the vite config.

### Building

As long as your project has a `build` command in its `package.json` the `build-all.js` script will build projects in the folders immediately adjacent to the root `package.json` (one level deep).

After the build for each project is done it will copy the `dist` folder from that project into `out/<project-name>`. So it will be accessible via that URL.

Your project's `dist` folder must have an `index.html` in it, otherwise GitHub pages will not be able to find the projects URL.

The `npm run new` script should do this for you, but It's mandatory to set the `base` option in the vite config, so vite will know to generate relative paths for the final build, for example:

```js
export default defineConfig({
    plugins: [vue()],
    base: "/transparency/", // Will build the project so https://roomle-dev.github.io/transparency is accessible properly
});
```

### Deploying

```bash
npm run deploy
```

This deploys all the projects in the workspace to Github Pages.

It does the following:

1. Builds all projects in folders that are present in the `workspaces` part of the root `package.json`.
2. Creates a entries in `docs/index.md` for each project to a list visible on https://roomle-dev.github.io/.
   1. The title and description are derived from each project's `package.json`.
   2. If there is no description it will not be included in the list of projects.
3. Builds the Vitepress main page.
4. Collects all project's `dist` folders and puts them into `./out`.
5. Deploys `./out` to GitHub Pages.

