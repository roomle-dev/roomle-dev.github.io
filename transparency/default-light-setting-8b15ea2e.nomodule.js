System.register(['./scene-manager-c874a010.nomodule.js', './roomle-dependency-injection-6b8e8576.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js'], (function (exports) {
  'use strict';
  var LightSetting, getGUI, DirectionalLight, Color, Vector2, Vector3, AmbientLight;
  return {
    setters: [function (module) {
      LightSetting = module.L;
    }, function (module) {
      getGUI = module.Q;
    }, function (module) {
      DirectionalLight = module.D;
      Color = module.C;
      Vector2 = module.V;
      Vector3 = module.a;
      AmbientLight = module.A;
    }],
    execute: (function () {

      class DefaultLightSetting extends LightSetting {
          constructor(scene, oldLightSetting) {
              super(scene, oldLightSetting);
              this._params = {
                  ambientLight: {
                      color: '#ffffff',
                  },
                  mainDirLight: {
                      position: {
                          x: -3,
                          y: 4,
                          z: 4,
                      },
                      color: '#ffffff',
                  },
                  secondDirLight: {
                      position: {
                          x: 3,
                          y: 4,
                          z: 3,
                      },
                      color: '#ffffff',
                  },
              };
              this._mainDirectionalLight = new DirectionalLight(new Color(this._params.mainDirLight.color), 0.8);
              this._mainDirectionalLight.position.set(this._params.mainDirLight.position.x, this._params.mainDirLight.position.y, this._params.mainDirLight.position.z);
              this._mainDirectionalLight.layers.set(1 /* LAYER.LIGHTING */);
              this._mainDirectionalLight.castShadow = true;
              this._mainDirectionalLight.shadow.camera.near = 0.1;
              this._mainDirectionalLight.shadow.camera.far = 100;
              this._mainDirectionalLight.shadow.mapSize = new Vector2(1024, 1024);
              this._mainDirectionalLight.visible = true;
              this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0));
              this._secondDirectionalLight = new DirectionalLight(new Color(this._params.secondDirLight.color), 0.2);
              this._secondDirectionalLight.position.set(this._params.secondDirLight.position.x, this._params.secondDirLight.position.y, this._params.secondDirLight.position.z);
              this._secondDirectionalLight.layers.set(1 /* LAYER.LIGHTING */);
              this._secondDirectionalLight.castShadow = false;
              this._secondDirectionalLight.shadow.camera.near = 0.1;
              this._secondDirectionalLight.shadow.camera.far = 100;
              this._secondDirectionalLight.shadow.mapSize = new Vector2(1024, 1024);
              this._secondDirectionalLight.visible = true;
              this._secondDirectionalLight.lookAt(new Vector3(0, 0, 0));
              this._ambientLight = new AmbientLight(new Color(this._params.ambientLight.color), 0.5);
              this._ambientLight.layers.set(1 /* LAYER.LIGHTING */);
              this.addToScene();
          }
          needsBounds() {
              return true;
          }
          updateBounds(bounds) {
              const size = bounds.getSize(new Vector3());
              const maxSize = Math.max(Math.max(size.x, size.y), size.z) + 1;
              const halfSize = maxSize / 2;
              this._mainDirectionalLight.shadow.camera.top = halfSize;
              this._mainDirectionalLight.shadow.camera.bottom = -halfSize;
              this._mainDirectionalLight.shadow.camera.left = -halfSize;
              this._mainDirectionalLight.shadow.camera.right = halfSize;
              this._mainDirectionalLight.shadow.camera.near = 0.01;
              this._mainDirectionalLight.shadow.camera.far = 4 * maxSize;
              this._mainDirectionalLight.shadow.camera.updateProjectionMatrix();
              this._secondDirectionalLight.shadow.camera.top = halfSize;
              this._secondDirectionalLight.shadow.camera.bottom = -halfSize;
              this._secondDirectionalLight.shadow.camera.left = -halfSize;
              this._secondDirectionalLight.shadow.camera.right = halfSize;
              this._secondDirectionalLight.shadow.camera.near = 0.01;
              this._secondDirectionalLight.shadow.camera.far = 4 * maxSize;
              this._secondDirectionalLight.shadow.camera.updateProjectionMatrix();
          }
          addToScene() {
              this._scene.add(this._mainDirectionalLight);
              this._scene.add(this._secondDirectionalLight);
              this._scene.add(this._ambientLight);
          }
          removeFromScene() {
              this._scene.remove(this._mainDirectionalLight);
              this._scene.remove(this._secondDirectionalLight);
              this._scene.remove(this._ambientLight);
          }
          reload() {
              this.removeFromScene();
              this.addToScene();
          }
          showGUI() {
              let gui = getGUI();
              if (!gui) {
                  return;
              }
              if (this._ambientLight) {
                  let ambiLight = gui.addFolder('Ambient Light');
                  ambiLight.add(this._ambientLight, 'visible');
                  ambiLight
                      .add(this._ambientLight, 'intensity')
                      .min(0)
                      .max(5)
                      .step(0.1);
                  ambiLight
                      .addColor(this._params.ambientLight, 'color')
                      .onChange((color) => (this._ambientLight.color = new Color(color)));
              }
              if (this._mainDirectionalLight) {
                  let mainDirectionalLight = gui.addFolder('Main Directional Light');
                  mainDirectionalLight.add(this._mainDirectionalLight, 'visible');
                  mainDirectionalLight
                      .add(this._mainDirectionalLight, 'intensity')
                      .min(0)
                      .max(10)
                      .step(0.1);
                  mainDirectionalLight.add(this._mainDirectionalLight, 'castShadow');
                  mainDirectionalLight
                      .addColor(this._params.mainDirLight, 'color')
                      .onChange((color) => (this._mainDirectionalLight.color = new Color(color)));
                  mainDirectionalLight
                      .add(this._mainDirectionalLight.position, 'x')
                      .min(-10)
                      .max(10)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
                  mainDirectionalLight
                      .add(this._mainDirectionalLight.position, 'y')
                      .min(-10)
                      .max(50)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
                  mainDirectionalLight
                      .add(this._mainDirectionalLight.position, 'z')
                      .min(-10)
                      .max(10)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
              }
              if (this._secondDirectionalLight) {
                  let secondDirectionalLight = gui.addFolder('Second Directional Light');
                  secondDirectionalLight.add(this._secondDirectionalLight, 'visible');
                  secondDirectionalLight
                      .add(this._secondDirectionalLight, 'intensity')
                      .min(0)
                      .max(10)
                      .step(0.1);
                  secondDirectionalLight.add(this._secondDirectionalLight, 'castShadow');
                  secondDirectionalLight
                      .addColor(this._params.mainDirLight, 'color')
                      .onChange((color) => (this._mainDirectionalLight.color = new Color(color)));
                  secondDirectionalLight
                      .add(this._secondDirectionalLight.position, 'x')
                      .min(-10)
                      .max(10)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
                  secondDirectionalLight
                      .add(this._secondDirectionalLight.position, 'y')
                      .min(-10)
                      .max(50)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
                  secondDirectionalLight
                      .add(this._secondDirectionalLight.position, 'z')
                      .min(-10)
                      .max(10)
                      .step(0.1)
                      .onChange(() => this._mainDirectionalLight.lookAt(new Vector3(0, 0, 0)));
              }
          }
      } exports('D', DefaultLightSetting);

    })
  };
}));
//# sourceMappingURL=default-light-setting-8b15ea2e.nomodule.js.map
