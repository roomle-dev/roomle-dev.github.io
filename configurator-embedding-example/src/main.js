import RoomleConfiguratorApi from "@roomle/embedding-lib";

(async () => {
    const configuratorId = "demoConfigurator";
    const domElement = document.getElementById("app");
    const configurator = await RoomleConfiguratorApi.createConfigurator(
        configuratorId,
        domElement,
        {},
        []
    );
    // load an item
    await configurator.ui.loadObject("usm:frame");
})();
