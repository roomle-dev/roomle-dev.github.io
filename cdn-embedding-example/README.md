# https://roomle-dev.github.io/cdn-embedding-example/

Examples of loading the @roomle/embedding-lib through a CDN. [Full example](https://github.com/roomle-dev/roomle-dev.github.io/blob/master/cdn-embedding-example/index.html#L53). 

### JSDelivr

```html
<script type="module">
    import RoomleConfiguratorApi from "https://cdn.jsdelivr.net/npm/@roomle/embedding-lib@6.3.0/roomle-embedding-lib.js";
    
    (async function () {
        console.log("Starting Roomle");
        
        const instance = await RoomleConfiguratorApi.createConfigurator(
            "demoConfigurator",
            document.getElementById("configurator-container"),
            {}
        );
        
        instance.ui.loadObject("usm:frame");
    })();
</script>
```

### unpkg.com

```html
<script crossorigin="anonymous" type="module">
    import RoomleConfiguratorApi from "https://unpkg.com/@roomle/embedding-lib@6.3.0/roomle-embedding-lib.js";
    ...
</script>
```
