let changeButtonDisabled = function (isDisabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = isDisabled;
  });
  const drag = document.querySelector('#drag');
  drag.addEventListener('dragstart', (dragEvent) => {
    window.RoomlePlanner.dragInObject('usm:frame', dragEvent);
  });
  const drag2 = document.querySelector('#drag2');
  drag2.addEventListener('dragstart', (dragEvent) => {
    window.RoomlePlanner.dragInObject(
      'roomle_cubes_ios:garden_hedge',
      dragEvent
    );
  });
};

const getPreloadHint = function (definition) {
  return JSON.parse(definition).componentId;
};

const loadPlan = function (isXML) {
  const input = document.getElementById('input-xml').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  if (isXML) {
    window.RoomlePlanner.loadPlanXml(input).then(() =>
      changeButtonDisabled(false)
    );
  } else {
    window.RoomlePlanner.loadPlan(input).then(() =>
      changeButtonDisabled(false)
    );
  }
};

const showImage = function (base64Image) {
  const imgId = 'debug-image';
  const old = document.getElementById(imgId);
  if (old) {
    document.body.removeChild(old);
  }
  const img = document.createElement('img');
  img.src = base64Image.image;
  img.id = imgId;
  img.style =
    'width: ' +
    base64Image.width +
    '; height: ' +
    base64Image.height +
    '; position: fixed; top: 0; right: 0; border: solid 1px black; z-index: 999; max-height: 100vh;';
  document.body.appendChild(img);
  img.addEventListener('click', () => {
    document.body.removeChild(document.getElementById(imgId));
  });
};

document
  .getElementById('back')
  .addEventListener('click', () => RoomlePlanner.back());
document.getElementById('switch2D').addEventListener('click', () => {
  window.RoomlePlanner.switch2D();
});
document.getElementById('drawWallsManually').addEventListener('click', () => {
  window.RoomlePlanner.switch2D();
  window.RoomlePlanner.enableWallDrawing();
});
document.getElementById('addMeasurementLine').addEventListener('click', () => {
  window.RoomlePlanner.switch2D();
  window.RoomlePlanner.enableMeasurementLineDrawing();
});

document
  .getElementById('switch3D')
  .addEventListener('click', () => window.RoomlePlanner.switch3D());
document
  .getElementById('switchFirstPerson')
  .addEventListener('click', () => window.RoomlePlanner.switchToFirstPerson());
document
  .getElementById('load-plan-xml')
  .addEventListener('click', () => loadPlan(true));
document
  .getElementById('load-plan-id')
  .addEventListener('click', () => loadPlan(false));
document
  .getElementById('resume')
  .addEventListener('click', () =>
    window.RoomlePlanner.resumeTest(document.getElementById('roomle-planner'))
  );
document
  .getElementById('pause')
  .addEventListener('click', () => window.RoomlePlanner.pauseTest());
document
  .getElementById('start-configuring')
  .addEventListener('click', () => window.RoomlePlanner.startConfiguring());
document
  .getElementById('start-viewing')
  .addEventListener('click', () => window.RoomlePlanner.startViewing());
document
  .getElementById('back-to-planner')
  .addEventListener('click', () => window.RoomlePlanner.backToPlanner());
document
  .getElementById('show-gui')
  .addEventListener('click', () => window.RoomlePlanner.showGUI());

document.getElementById('render-top-image').addEventListener('click', () => {
  RoomlePlanner.prepareTopImage().then((base64Image) => {
    showImage(base64Image);
  });
});

document
  .getElementById('render-perspective-image')
  .addEventListener('click', () => {
    RoomlePlanner.preparePerspectiveImage().then((base64Image) => {
      showImage(base64Image);
    });
  });

document
  .getElementById('render-perspective-image-of')
  .addEventListener('click', () => {
    const input = parseInt(document.getElementById('input-xml').value) || 30;
    RoomlePlanner.preparePerspectiveImageOf(input, {}).then((base64Image) => {
      showImage(base64Image);
    });
  });

window.RoomlePlanner.init(
  document.getElementById('roomle-planner'),
  'fsruv6ocqyittbl1q19qccu4vidoqe2',
  { overrideTenant: 74, moc: true }
).then(
  (success) => {
    changeButtonDisabled(false);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || '51gkxcxp2t9cm2gtifmjchjhadrlt9v';
    window.RoomlePlanner.loadPlan(id);
    window.RoomlePlanner.setSceneEvents({ construction: true, objects: true });
  },
  (error) => {
    //empty
  }
);
// .then(() => {
//     return RoomleConfigurator.loadConfiguration(usmSmall, initialPreloadHint);
// }).then(() => {
//     console.log('Finished');
//     window.performance.mark('load_overall_end');
//     window.performance.measure('load_overall', 'load_overall_start', 'load_overall_end');
// });

console.log('dummy-app js loaded');
