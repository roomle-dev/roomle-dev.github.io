let register = function (type) {
  document.querySelectorAll('.load' + type).forEach((elem) =>
    elem.addEventListener('click', (event) => {
      const method = 'load' + type + 'ById';
      changeButtonDisabled(true);
      RoomleConfigurator[method](event.target.dataset.rmlId).then(() =>
        changeButtonDisabled(false)
      );
    })
  );
};

let changeButtonDisabled = function (isDisabled) {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = isDisabled;
  });
};

let loadConfiguration = function (configString, options) {
  changeButtonDisabled(true);
  RoomleConfigurator.loadConfiguration(configString, options).then(() =>
    changeButtonDisabled(false)
  );
};

register('Configuration');
register('ConfigurableItem');

const formiaId =
  'koinor:FORMIA_LeftGroup:79FBF0D6C79A2598B5FF943111EA29DC0C6884AA97F4383582B47F69C14DDB2C';
const biohortId =
  'biohort:Highline_Master:E4A40F90869CFB913BF9BC68A4CE6407C2602FEC1C386F1CAECA2A142766F871';
const eartham = '{"componentId":"revised:Eartham"}';
const externalMeshDemoComponent =
  '{"componentId":"demoCatalogId:externalMeshes"}';
// const externalMeshDemoComponent = '{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"children":[\n' +
//     '{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"dockParent":"[{100,0,0}]",\n' +
//     '"dockChild":"{0,0,0}","dockPosition":"{100,0,0}",\n' +
//     '"children":[{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"dockParent":"[{100+20,0,0}]",\n' +
//     '"dockChild":"{0,0,0}","dockPosition":"{100,0,0}",\n' +
//     '"children":[{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"dockParent":"[{100+40,0,0}]",\n' +
//     '"dockChild":"{0,0,0}","dockPosition":"{100,0,0}",\n' +
//     '"children":[{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"dockParent":"[{100+60,0,0}]",\n' +
//     '"dockChild":"{0,0,0}","dockPosition":"{100,0,0}",\n' +
//     '"children":[\n' +
//     '{ "componentId":"demoCatalogId:externalMeshes",\n' +
//     '"dockParent":"[{100+80,0,0}]",\n' +
//     '"dockChild":"{0,0,0}","dockPosition":"{100,0,0}",\n' +
//     '"children":[]}\n' +
//     ']}]}]}]}\n' +
//     ']}';
const chair =
  '{"children":[],"componentId":"brands_3:DSW_Chair","dockChild":"","dockParent":"","dockPosition":"","parameters":{"legs":"brands_3:02_golden_maple","piping":"brands_3:01_basic_dark","seating_shell":"brands_3:04_white","stoppers":"brands_3:01_basic_dark"}}';
const sofa =
  '{"children":[{"children":[],"componentId":"KIKA:Avignon1073","dockChild":"{((-(Width)/2.00)+12.00),(-(Depth)/2.00),0.00}","dockParent":"[{(Width/2.00),(Depth/2.00),0.00}]","dockPosition":"{480.00,480.00,0.00}","parameters":{"Armteil":"Ohne","Basic":"Basic","Bettfunktion":"Ohne","Depth":"960.00","Legs":"Chrom","Material":"KIKA:Toroanthrazit95","Stauraum":"Ohne","Width":"1300.00","allowLeftDocking":"0.00","allowRightDocking":"1.00"}},{"children":[],"componentId":"KIKA:Avignon3100","dockChild":"{(Width/2.00),(-(Depth)/2.00),0.00}","dockParent":"[{(-(Width)/2.00),(-(Depth)/2.00),0.00}]","dockPosition":"{-480.00,-480.00,0.00}","parameters":{"Armteil":"Ohne","Basic":"Basic","Bettfunktion":"Ohne","Depth":"960.00","Legs":"Chrom","Material":"KIKA:Toroanthrazit95","Stauraum":"Ohne","Width":"1740.00","allowLeftDocking":"1.00","allowRightDocking":"0.00"}}],"componentId":"KIKA:Avignon5010","dockChild":"","dockParent":"","dockPosition":"","parameters":{"Armteil":"Ohne","Basic":"Basic","Bettfunktion":"Ohne","Depth":"960.00","Legs":"Chrom","Material":"KIKA:Toroanthrazit95","Stauraum":"Ohne","Width":"960.00","allowLeftDocking":"1.00","allowRightDocking":"1.00"}}';
const usmBig =
  '{"children":[{"children":[],"componentId":"usm:frame","dockChild":"{width,0.00,0.00}","dockParent":"[{0.00,0.00,0.00}]","dockPosition":"{0.00,0.00,0.00}","parameters":{"addOnsInside":"0.00","allowLeftNeighbor":"0.00","allowRightNeighbor":"1.00","backplaneType":"Ohne","bottomNeighborDoor":"none","colorMaterial":"usm:green","depth":"350.00","door":"onlyTop","hasBottom":"1.00","hasLeftNeighbor":"0.00","hasLeftSide":"0.00","hasRightNeighbor":"1.00","hasRightSide":"1.00","hasTopNeighbor":"0.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"none","level":"0.00","pulloutInside":"none","tablarBufferBottom":"50.00","tablarBufferTop":"50.00","width":"500.00"}},{"children":[{"children":[],"componentId":"usm:frame","dockChild":"{(width/2.00),0.00,0.00}","dockParent":"[{(width/2.00),0.00,height}]","dockPosition":"{375.00,0.00,350.00}","parameters":{"addOnsInside":"0.00","allowLeftNeighbor":"1.00","allowRightNeighbor":"1.00","backplaneType":"Ohne","bottomNeighborDoor":"Folding door","colorMaterial":"usm:green","depth":"350.00","door":"onlyTop","hasBottom":"1.00","hasLeftNeighbor":"0.00","hasLeftSide":"0.00","hasRightNeighbor":"0.00","hasRightSide":"0.00","hasTopNeighbor":"0.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"none","level":"2.00","pulloutInside":"none","tablarBufferBottom":"50.00","tablarBufferTop":"50.00","width":"750.00"}}],"componentId":"usm:frame","dockChild":"{(width/2.00),0.00,0.00}","dockParent":"[{(width/2.00),0.00,height}]","dockPosition":"{375.00,-0.00,350.00}","parameters":{"addOnsInside":"0.00","allowLeftNeighbor":"1.00","allowRightNeighbor":"1.00","backplaneType":"Voll","bottomNeighborDoor":"None","colorMaterial":"usm:green","depth":"350.00","door":"Folding door","hasBottom":"1.00","hasLeftNeighbor":"0.00","hasLeftSide":"1.00","hasRightNeighbor":"0.00","hasRightSide":"0.00","hasTopNeighbor":"1.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"none","level":"1.00","pulloutInside":"none","tablarBufferBottom":"130.00","tablarBufferTop":"50.00","width":"750.00"}},{"children":[{"children":[{"children":[],"componentId":"usm:inosboxopen","dockChild":"{120.00,0.00,0.00}","dockParent":"[{132.00,15.00,15.00}]","dockPosition":"{132.00,15.00,15.00}","parameters":{"variant":"klein"}}],"componentId":"usm:frame","dockChild":"{0.00,0.00,0.00}","dockParent":"[{width,0.00,0.00}]","dockPosition":"{500.00,0.00,0.00}","parameters":{"addOnsInside":"1.00","allowLeftNeighbor":"1.00","allowRightNeighbor":"0.00","backplaneType":"Ohne","bottomNeighborDoor":"none","colorMaterial":"usm:green","depth":"350.00","door":"onlyTop","hasBottom":"1.00","hasLeftNeighbor":"1.00","hasLeftSide":"0.00","hasRightNeighbor":"0.00","hasRightSide":"0.00","hasTopNeighbor":"0.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"onlyTop","level":"0.00","pulloutInside":"none","tablarBufferBottom":"50.00","tablarBufferTop":"50.00","width":"500.00"}}],"componentId":"usm:frame","dockChild":"{0.00,0.00,0.00}","dockParent":"[{width,0.00,0.00}]","dockPosition":"{750.00,0.00,0.00}","parameters":{"addOnsInside":"0.00","allowLeftNeighbor":"1.00","allowRightNeighbor":"0.00","backplaneType":"Ohne","bottomNeighborDoor":"none","colorMaterial":"usm:green","depth":"350.00","door":"onlyTop","hasBottom":"1.00","hasLeftNeighbor":"1.00","hasLeftSide":"1.00","hasRightNeighbor":"1.00","hasRightSide":"0.00","hasTopNeighbor":"0.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"None","level":"0.00","pulloutInside":"none","tablarBufferBottom":"50.00","tablarBufferTop":"50.00","width":"500.00"}}],"componentId":"usm:frame","dockChild":"","dockParent":"","dockPosition":"","parameters":{"addOnsInside":"0.00","allowLeftNeighbor":"1.00","allowRightNeighbor":"1.00","backplaneType":"Voll","bottomNeighborDoor":"none","colorMaterial":"usm:green","depth":"350.00","door":"None","hasBottom":"1.00","hasLeftNeighbor":"1.00","hasLeftSide":"1.00","hasRightNeighbor":"1.00","hasRightSide":"1.00","hasTopNeighbor":"1.00","height":"350.00","isLastFrame":"0.00","leftNeighborDoor":"onlyTop","level":"0.00","pulloutInside":"none","tablarBufferBottom":"50.00","tablarBufferTop":"50.00","width":"750.00"}}';
const usmSmall =
  '{"componentId": "usm:frame", "parameters":{"width":"350.00"}}';
const fantoni = '{"componentId":"fantoni_1:ME_60_Curved_Table"}';
const muuto = '{"componentId":"muuto:Muuto-Stacked"}';
const umdasch =
  '{"children":[{"children":[{"children":[{"children":[],"componentId":"umdasch:5015400","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{((Achse/2.00)-0.00),(-20.00-0.00),(Hoehe-65.00)}]","dockPosition":"{500.00,-20.00,1295.00}","parameters":{"Achse":"1000.00","Oberflaeche":"umdasch:C06","Tiefe":"400.00"}},{"children":[{"children":[],"componentId":"umdasch:DamenBlazer03h","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{-(((Achse-10.00)/2.00)),-(-((Tiefe-8.00))),3.00},{((Achse-10.00)/2.00),-(-((Tiefe-8.00))),3.00}]","dockPosition":"{223.31,392.00,3.00}","parameters":{"AnzahlMalPreis":"1","BreiteBuegel":"0","BreiteWare":"0","BuegelJaNein":"Ja","DickeWare":"40","FarbeBuegel":"umdasch:X65","HaengeAbstand":"20","HoeheWare":"0"}}],"componentId":"umdasch:5040100","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{((Achse/2.00)-0.00),(20.00-0.00),(Hoehe-365.00)}]","dockPosition":"{500.00,20.00,995.00}","parameters":{"Achse":"1000.00","Konfektionsstange":"umdasch:C06","Konsolen":"umdasch:BS862","Tiefe":"400.00"}}],"componentId":"umdasch:269047","dockChild":"{0.00,-0.00,1000.00}","dockParent":"[{Achse,-0.00,1000.00}]","dockPosition":"{625.00,-0.00,1000.00}","parameters":{"Achse":"1000.00","Einhaengeraster":"300.00","Hoehe":"1360.00","Rueckwand":"umdasch:B51","Steherfarbe":"umdasch:B51","Tiefe":"400.00"}}],"componentId":"umdasch:269047","dockChild":"{0.00,-0.00,1000.00}","dockParent":"[{Achse,-0.00,1000.00}]","dockPosition":"{625.00,-0.00,1000.00}","parameters":{"Achse":"625.00","Einhaengeraster":"300.00","Hoehe":"1360.00","Rueckwand":"umdasch:B51","Steherfarbe":"umdasch:B51","Tiefe":"400.00"}},{"children":[],"componentId":"umdasch:5002500","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{((Achse/2.00)-0.00),(-20.00-0.00),(Hoehe-65.00)}]","dockPosition":"{312.50,-20.00,1295.00}","parameters":{"Achse":"625.00","Tragestange":"umdasch:C06"}},{"children":[{"children":[{"children":[],"componentId":"umdasch:DamenMantel01h","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{0.00,88.00,-25.00},{0.00,300.00,-183.00}]","dockPosition":"{0.00,130.01,-56.31}","parameters":{"AnzahlMalPreis":"1","BreiteBuegel":"0","BreiteWare":"0","BuegelJaNein":"Ja","DickeWare":"40","FarbeBuegel":"umdasch:X65","HaengeAbstand":"20","HoeheWare":"0"}}],"componentId":"umdasch:480206","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{-(((Achse-10.00)/2.00)),55.10,-0.50},{((Achse-10.00)/2.00),55.10,-0.50}]","dockPosition":"{-138.18,55.10,-0.50}","parameters":{"Oberflaeche":"umdasch:C06"}},{"children":[{"children":[],"componentId":"umdasch:DamenMantel01h","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{0.00,88.00,-25.00},{0.00,300.00,-183.00}]","dockPosition":"{0.00,188.05,-99.57}","parameters":{"AnzahlMalPreis":"1","BreiteBuegel":"0","BreiteWare":"0","BuegelJaNein":"Ja","DickeWare":"40","FarbeBuegel":"umdasch:X65","HaengeAbstand":"20","HoeheWare":"0"}}],"componentId":"umdasch:480206","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{-(((Achse-10.00)/2.00)),55.10,-0.50},{((Achse-10.00)/2.00),55.10,-0.50}]","dockPosition":"{203.45,55.10,-0.50}","parameters":{"Oberflaeche":"umdasch:C06"}}],"componentId":"umdasch:5002500","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{((Achse/2.00)-0.00),(20.00-0.00),(Hoehe-65.00)}]","dockPosition":"{312.50,20.00,1295.00}","parameters":{"Achse":"625.00","Tragestange":"umdasch:C06"}}],"componentId":"umdasch:269046","dockChild":"","dockParent":"","dockPosition":"","parameters":{"Achse":"625.00","Einhaengeraster":"300.00","Hoehe":"1360.00","Rueckwand":"umdasch:B51","Steherfarbe":"umdasch:B51","Tiefe":"400.00"}}';

const possibleChild = {
  isItem: false,
  isComponent: true,
  configuration: '{"componentId":"usm:frame"}',
  id: 'usm:frame',
};

const possibleChildInos = JSON.parse(
  `{"externalIdentifier":"inosboxclosed","catalog":"usm","id":"usm:inosboxclosed","type":"other","detailType":"other","configuration":"{\\"childDockings\\":{\\"points\\":[{\\"position\\":\\"{120, 0, 0}\\",\\"mask\\":\\"usm:FrameInos\\",\\"rotation\\":\\"{0, 0, 0}\\"}]},\\"geometry\\":\\"\\\\n        BeginObjGroup(group_container);\\\\n            if (variant == gross) {\\\\n                boxHeight = 57;\\\\n                boxOffset = 57 + 3;\\\\n                BeginObjGroup(group_box);\\\\n                    Cube(Vector3f{230, 320, 1});\\\\n                    Cube(Vector3f{230, 1, boxHeight});\\\\n                    Cube(Vector3f{230, 1, boxHeight});\\\\n                     MoveMatrixBy(Vector3f{0, 320, 0});\\\\n                    Cube(Vector3f{1, 320, boxHeight});\\\\n                    Cube(Vector3f{1, 320, boxHeight});\\\\n                     MoveMatrixBy(Vector3f{230, 0, 0});\\\\n                EndObjGroup();\\\\n                 SetObjSurface(usm:black);\\\\n                for (i = 0; i < 4; i = i + 1) {\\\\n                    Copy();\\\\n                     MoveMatrixBy(Vector3f{0, 0, boxOffset});\\\\n                }\\\\n            }\\\\n            if (variant == klein) {\\\\n                boxHeight = 27;\\\\n                boxOffset = 27 + 3;\\\\n                BeginObjGroup(group_box);\\\\n                    Cube(Vector3f{230, 320, 1});\\\\n                    Cube(Vector3f{230, 1, boxHeight});\\\\n                    Cube(Vector3f{230, 1, boxHeight});\\\\n                     MoveMatrixBy(Vector3f{0, 320, 0});\\\\n                    Cube(Vector3f{1, 320, boxHeight});\\\\n                    Cube(Vector3f{1, 320, boxHeight});\\\\n                     MoveMatrixBy(Vector3f{230, 0, 0});\\\\n                EndObjGroup();\\\\n                 SetObjSurface(usm:black);\\\\n                for (i = 0; i < 9; i = i + 1) {\\\\n                    Copy();\\\\n                     MoveMatrixBy(Vector3f{0, 0, boxOffset});\\\\n                }\\\\n            }\\\\n        EndObjGroup();\\\\n         MoveMatrixBy(Vector3f{0, -333, 0});\\\\n    \\",\\"id\\":\\"usm:inosboxclosed\\",\\"labels\\":{\\"de\\":\\"USM Inos Kasten-Set C4 geschlossen\\",\\"en\\":\\"Inos box closed\\"},\\"parameters\\":[{\\"defaultValue\\":\\"klein\\",\\"enabled\\":\\"true\\",\\"key\\":\\"variant\\",\\"labels\\":{\\"de\\":\\"Variante\\",\\"en\\":\\"Variant\\"},\\"type\\":\\"String\\",\\"validValues\\":[\\"klein\\",\\"gross\\"],\\"visible\\":\\"true\\"}],\\"parentDockings\\":{\\"lineRanges\\":[],\\"lines\\":[],\\"points\\":[],\\"ranges\\":[]},\\"articleNr\\":\\"\\\\n        if (variant == klein) { articleNr = '14352.30'; }\\\\n        if (variant == gross) { articleNr = '14177.30'; }\\\\n    \\",\\"type\\":\\"MainObj\\",\\"validChildren\\":[],\\"pricing\\":[{\\"region\\":\\"RML_DEFAULT\\",\\"currency\\":\\"EUR\\",\\"price\\":\\"\\\\n                if (variant == klein) { price = 108.63; }\\\\n                if (variant == gross) { price = 153.34; }\\\\n            \\"},{\\"region\\":\\"RML_DEFAULT\\",\\"currency\\":\\"EUR\\",\\"price\\":\\"    \\\\n                if (variant == klein) { price = 108.63;}\\\\n                if (variant == gross) { price = 153.34;}\\\\n            \\"}]}","active":false,"updated":"2020-10-13T16:19:19.000Z","created":"2015-08-12T11:04:27.000Z","perspectiveImage":"https://catalog.roomle.com/1e9dbe16-bb11-446a-a28d-1cc42a3c16e4/components/inosboxclosed/perspectiveImage.png?marker=1602605959","labels":[],"tags":["addons"],"orderable":true,"label":"Inos box closed","language":"en","translations":[{"id":"e3c756cd-3446-4a9c-b8b4-c424a1fcbf71","language":"de","label":"Inos Kastenset geschlossen","created":"2015-10-13T13:04:44.000Z","updated":"2020-10-13T14:17:43.000Z"},{"id":"4c2ae95a-8467-4041-92cc-1f714d8d07f0","language":"en","label":"Inos box closed","created":"2015-08-12T11:04:27.000Z","updated":"2020-10-13T14:17:43.000Z"},{"id":"51b53a0e-8982-4609-9e61-1df6da2ee64b","language":"fr","label":"Inos box fermé","created":"2018-05-07T09:32:50.000Z","updated":"2018-05-07T12:29:37.000Z"},{"id":"8850","language":"nl","label":"Inos box gesloten","created":"2018-05-07T11:54:15.000Z","updated":"2018-05-07T11:55:47.000Z"}],"links":{"tags":"/components/usm:inosboxclosed/tags"},"version":5,"__rapi_path__":"components","isItem":false,"isComponent":true,"group":null,"possible":true}`
);

const possibleChildFantoni = {
  isItem: false,
  isComponent: true,
  configuration: '{"componentId":"fantoni_1:ME_60_Curved_Table"}',
  id: 'fantoni_1:ME_60_Curved_Table',
};

const possibleChildMuuto = {
  isItem: true,
  isComponent: false,
  configuration:
    '{"children":[],"componentId":"muuto:Muuto-Stacked","dockChild":"","dockParent":"","dockPosition":"","parameters":{"ColourElements":"muuto:Esche","Colourbackboard":"muuto:Esche","Elements":"Boxsmallwithbackboard","Height":"436.00","Width":"218.00"}}',
  id: 'muuto:Muuto-StackedBoxsmallwithbackboard',
};

const possbileChildUmdasch = {
  isItem: false,
  isComponent: true,
  configuration:
    '{"children":[],"componentId":"umdasch:DamenBlazer03h","dockChild":"{0.00,-0.00,0.00}","dockParent":"[{-(((Achse-10.00)/2.00)),-(-((Tiefe-8.00))),3.00},{((Achse-10.00)/2.00),-(-((Tiefe-8.00))),3.00}]","dockPosition":"{223.31,392.00,3.00}","parameters":{"AnzahlMalPreis":"1","BreiteBuegel":"0","BreiteWare":"0","BuegelJaNein":"Ja","DickeWare":"40","FarbeBuegel":"umdasch:X65","HaengeAbstand":"20","HoeheWare":"0"}}',
  id: 'umdasch:DamenBlazer03h',
};

const getPreloadHint = function (definition) {
  return JSON.parse(definition).componentId;
};

document
  .getElementById('load-configuration-sofa')
  .addEventListener('click', () =>
    loadConfiguration(sofa, getPreloadHint(sofa))
  );
document
  .getElementById('load-configuration-string-big')
  .addEventListener('click', () =>
    loadConfiguration(usmBig, getPreloadHint(usmBig))
  );
document
  .getElementById('load-configuration-string-small')
  .addEventListener('click', () =>
    loadConfiguration(usmSmall, getPreloadHint(usmSmall))
  );
document
  .getElementById('load-configuration-fantoni')
  .addEventListener('click', () =>
    loadConfiguration(fantoni, getPreloadHint(fantoni))
  );
document
  .getElementById('load-configuration-muuto')
  .addEventListener(
    'click',
    () => loadConfiguration(muuto),
    getPreloadHint(fantoni)
  );
document
  .getElementById('debug-scene-graph')
  .addEventListener('click', () => RoomleConfigurator.debugSceneGraph());
document
  .getElementById('component-change-width')
  .addEventListener('click', () =>
    RoomleConfigurator.setParameter('width', '350.00')
  );
document
  .getElementById('preview-dockings')
  .addEventListener('click', () =>
    RoomleConfigurator.previewDockings(possibleChild)
  );
document
  .getElementById('preview-dockings-inos')
  .addEventListener('click', () =>
    RoomleConfigurator.previewDockings(possibleChildInos)
  );
document
  .getElementById('preview-dockings-fantoni')
  .addEventListener('click', () =>
    RoomleConfigurator.previewDockings(possibleChildFantoni)
  );
document
  .getElementById('preview-dockings-muuto')
  .addEventListener('click', () =>
    RoomleConfigurator.previewDockings(possibleChildMuuto)
  );
document
  .getElementById('preview-dockings-umdasch')
  .addEventListener('click', () =>
    RoomleConfigurator.previewDockings(possbileChildUmdasch)
  );
document.getElementById('image').addEventListener('click', () => {
  RoomleConfigurator.preparePerspectiveImage({ showDimensions: false }).then(
    (base64Image) => {
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
        '; position: fixed; top: 0; right: 0; border: solid 1px black; z-index: 999';
      document.body.appendChild(img);
      img.addEventListener('click', () => {
        document.body.removeChild(document.getElementById(imgId));
      });
    }
  );
});

document.getElementById('top-image').addEventListener('click', () => {
  RoomleConfigurator.prepareTopImage({ showDimensions: true }).then(
    (base64Image) => {
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
        '; position: fixed; top: 0; right: 0; border: solid 1px black; z-index: 999';
      document.body.appendChild(img);
      img.addEventListener('click', () => {
        document.body.removeChild(document.getElementById(imgId));
      });
    }
  );
});

document.getElementById('render-image').addEventListener('click', () => {
  let useCurrentPerspective =
    document.getElementById('input-configuration').value == 'true';
  RoomleConfigurator.renderImage({ useCurrentPerspective }).then(
    (base64Image) => {
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
        '; position: fixed; top: 0; right: 0; border: solid 1px black; z-index: 999';
      document.body.appendChild(img);
      img.addEventListener('click', () => {
        document.body.removeChild(document.getElementById(imgId));
      });
    }
  );
});

document.getElementById('part-image').addEventListener('click', () => {
  let partId = document.getElementById('input-configuration').value;
  if (!partId) {
    partId = 17;
  } else {
    partId = parseInt(partId);
  }
  RoomleConfigurator.preparePartImage(partId).then((base64Image) => {
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
      '; position: fixed; top: 0; right: 0; border: solid 1px black; z-index: 999';
    document.body.appendChild(img);
    img.addEventListener('click', () => {
      document.body.removeChild(document.getElementById(imgId));
    });
  });
});

document
  .getElementById('component-delete')
  .addEventListener('click', () => RoomleConfigurator.requestDeleteComponent());
document
  .getElementById('camera-reset')
  .addEventListener('click', () => RoomleConfigurator.resetCameraPosition());

const freeText = function (type) {
  return function () {
    const configuration = document.getElementById('input-configuration').value;
    if (!configuration || configuration === '') {
      return;
    }
    const method = 'load' + type;
    changeButtonDisabled(true);
    RoomleConfigurator[method](configuration).then(() =>
      changeButtonDisabled(false)
    );
  };
};

const removeComponentActions = function () {
  const canvas = document.getElementById('roomle-configurator');
  canvas.querySelectorAll('.uiComponent').forEach((e) => e.remove());
};

const addComponentActions = function (uiComponentInfo) {
  const canvas = document.getElementById('roomle-configurator');
  canvas.querySelectorAll('.uiComponent').forEach((e) => e.remove());
  uiComponentInfo.forEach((componentInfo) => {
    const span = document.createElement('span');
    span.innerHTML = '+';
    span.classList.add('uiComponent');
    span.style =
      'position: fixed; top: ' +
      componentInfo.position.y +
      'px; left: ' +
      componentInfo.position.x +
      'px; border: solid 1px black';
    canvas.appendChild(span);
  });
};

document
  .getElementById('load-configuration')
  .addEventListener('click', freeText('Configuration'));
document
  .getElementById('load-rapi-configuration')
  .addEventListener('click', freeText('ConfigurationById'));
document
  .getElementById('load-item')
  .addEventListener('click', freeText('ConfigurableItemById'));
document.getElementById('pause').addEventListener('click', () => {
  var configuratorElement = document.getElementById('roomle-configurator');
  while (configuratorElement.firstChild) {
    configuratorElement.removeChild(configuratorElement.firstChild);
  }
  RoomleConfigurator.pauseTest();
});
document
  .getElementById('resume')
  .addEventListener('click', () =>
    RoomleConfigurator.resumeTest(
      document.getElementById('roomle-configurator')
    )
  );
document.getElementById('component-info').addEventListener('click', () => {
  RoomleConfigurator.callbacks.componentPositionsUpdated = (uiComponentInfos) =>
    addComponentActions(uiComponentInfos);
  RoomleConfigurator.callbacks.cameraPositionChanges = () =>
    removeComponentActions();
});
document.getElementById('show-gui').addEventListener('click', () => {
  RoomleConfigurator._sceneManager.showGUI();
});

window.RoomleConfigurator.callbacks.onUpdateComponentParameters = function (
  componentParameters
) {
  componentParameters.forEach((parameter) => {
    console.log('parameter: ' + parameter.key + ' = ' + parameter.value);
    parameter.validValues.forEach((validValue) => {
      console.log('    validValue: ' + validValue.value);
    });
  });
};
window.performance.mark('load_overall_start');
const initialPreloadHint = getPreloadHint(usmBig);
window.RoomleConfigurator.init(document.getElementById('roomle-configurator'), {
  //overrideTenant: 48
  featureFlags: {
    pulsePreview: true,
    reDock: true,
  },
})
  .then(
    (success) => {
      changeButtonDisabled(false);
    },
    (error) => {
      console.log(error);
    }
  )
  .then(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      return RoomleConfigurator.loadConfigurationById(id);
    } else {
      return RoomleConfigurator.loadConfiguration(usmBig);
    }
  })
  .then(() => {
    console.log('Finished');
    window.performance.mark('load_overall_end');
    window.performance.measure(
      'load_overall',
      'load_overall_start',
      'load_overall_end'
    );
  });

console.log('dummy-app js loaded');
