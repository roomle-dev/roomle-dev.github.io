let changeButtonDisabled = function (isDisabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = isDisabled;
  });
};

const loadMaterialShading = function () {
  const input = document.getElementById('input-xml').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  window.RoomleMaterialViewer.loadMaterialShading(JSON.parse(input)).then(() =>
    changeButtonDisabled(false)
  );
};

const loadMaterial = function () {
  const input = document.getElementById('input-xml').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  window.RoomleMaterialViewer.loadMaterial(JSON.parse(input)).then(() =>
    changeButtonDisabled(false)
  );
};

const loadMaterialId = function () {
  const input = document.getElementById('input-xml').value;
  if (!input || input === '') {
    return;
  }
  changeButtonDisabled(true);
  window.RoomleMaterialViewer.loadMaterialId(input.trim()).then(() =>
    changeButtonDisabled(false)
  );
};

document
  .getElementById('load-material-shading')
  .addEventListener('click', () => loadMaterialShading());
document
  .getElementById('load-material')
  .addEventListener('click', () => loadMaterial());
document
  .getElementById('load-material-id')
  .addEventListener('click', () => loadMaterialId());

window.RoomleMaterialViewer.init(
  document.getElementById('roomle-material-viewer')
).then(
  (success) => {
    changeButtonDisabled(false);
  },
  (error) => {
    //empty
  }
);

console.log('dummy-app js loaded');
