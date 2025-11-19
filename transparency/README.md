# Roomle Web SDK Transparent Background demo

https://roomle-dev.github.io/transparency/

When setting up your Planner or Configurator, you must set the initData variable `transparentBackground` to `true`

```js
const rubensPlanner = await RoomleSdk.getPlanner({
    moc: true,
    edit: true,
    id: "86qux3bxbgv615qxzby3k2q4a4oni7o",
    transparentBackground: true, // Enables transparency
});
```

Also be mindful to make sure the div containing the Roomle app/canvas is also set to transparent with CSS:

```css
.scene {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: transparent; // <---
}
```

> [!TIP]
> You can use the `mix-blend-mode` css property to achieve front overlay and underlay effects while maintaining legibility like this demo does:
```css
h2 {
    font-weight: 900;
    mix-blend-mode: difference;
}
```

Please see the App.vue file [here](https://github.com/roomle-dev/roomle-dev.github.io/blob/master/transparency/src/App.vue#L217) for more information.
