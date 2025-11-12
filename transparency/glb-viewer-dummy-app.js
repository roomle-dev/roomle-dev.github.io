let changeButtonDisabled = function (isDisabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = isDisabled;
  });
};

const getPreloadHint = function (definition) {
  return JSON.parse(definition).componentId;
};

const loadGLB = function () {
  const input = document.getElementById('input-url').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  window.RoomleGLBViewer.loadGLB(input).then(() => changeButtonDisabled(false));
};

const loadStaticItem = function (id) {
  const input = id ?? document.getElementById('input-url').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  window.RoomleGLBViewer.loadStaticItem(input).then(() =>
    changeButtonDisabled(false)
  );
};

const generateImage = function () {
  window.RoomleGLBViewer.preparePerspectiveImage().then((base64Image) => {
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
      '; position: fixed; top: 0; right: 0; border: solid 1px black';
    document.body.appendChild(img);
    img.addEventListener('click', () => {
      document.body.removeChild(document.getElementById(imgId));
    });
  });
};

const processRenderList = function () {
  const input = document.getElementById('input-url').value;
  if (!input || input === '') {
    return;
  }
  window.RoomleGLBViewer.processRenderList(input);
};

document
  .getElementById('load-glb-url')
  .addEventListener('click', () => loadGLB());
document
  .getElementById('load-static-item')
  .addEventListener('click', () => loadStaticItem());
document
  .getElementById('generate-image')
  .addEventListener('click', () => generateImage());
document
  .getElementById('process-json')
  .addEventListener('click', () => processRenderList());

document.getElementById('pause').addEventListener('click', () => {
  var glbViewerElement = document.getElementById('roomle-glb-viewer');
  while (glbViewerElement.firstChild) {
    glbViewerElement.removeChild(glbViewerElement.firstChild);
  }
  RoomleGLBViewer.pauseTest();
});
document
  .getElementById('resume')
  .addEventListener('click', () =>
    RoomleGLBViewer.resumeTest(document.getElementById('roomle-glb-viewer'))
  );

window.RoomleGLBViewer.init(document.getElementById('roomle-glb-viewer')).then(
  (success) => {
    changeButtonDisabled(false);
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      loadStaticItem(id);
    }
  }
);

console.log('dummy-app js loaded');
