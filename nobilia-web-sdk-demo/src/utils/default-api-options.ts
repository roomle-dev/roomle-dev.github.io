export default {
  enableArrangementCorrection: true,
  uiConfiguration: {
    userRight: 'Simple',
    materialAttributes: ['.*Color.*'],
    attributesVisibleInPlanner: ['.*Color.*', '.*Design.*', '.*Program.*'],
    attributeGroupsVisibleInPlanner: [],
    showPossibleSubModules: true,
    animatedOpenClose: false,
    showThumbnails: true
  },
  materialConfiguration: {
    defaultMaterial: 'roomle_script_test:gray_transparent',
    replaceUnmappedMaterialsWithDefault: false,
    materialMapping: [
      { materialName: '326', materialId: 'egger:f235_st76' },
      {
        materialName: 'Milchglas',
        materialId: 'cabinetlibrary:frosted_glass'
      },
      { materialName: 'Oven', materialId: 'cabinetlibrary:oven' },
      {
        materialName: 'BrassPlatedAntique',
        materialId: 'egger:f302_st87'
      },
      { materialName: 'NickelPlated', materialId: 'egger:f765_st20' },
      {
        materialName: 'StainlessSteelMattBrushed',
        materialId: 'egger:f765_st20'
      },
      { materialName: 'Grey', materialId: 'egger:u708_st9' },
      { materialName: 'Black', materialId: 'egger:u999_st7' },
      { materialName: 'seidenweiß', materialId: 'egger:w980_st7' },
      { materialName: 'oriongrau', materialId: 'egger:u960_st9' },
      { materialName: 'carbonschwarz', materialId: 'egger:u999_st7' },
      { materialName: 'Edelstahl', materialId: 'egger:f765_st20' },
      { materialName: 'metal', materialId: 'egger:f765_st20' },
      { materialName: '196', materialId: 'egger:u960_st9' },
      { materialName: '178', materialId: 'egger:u708_st9' },
      { materialName: '380', materialId: 'egger:f800_st9' },
      { materialName: '324', materialId: 'egger:f244_st76' },
      { materialName: '316', materialId: 'egger:f186_st9' },
      { materialName: '240', materialId: 'egger:h3190_st19' },
      { materialName: '230', materialId: 'egger:h3860_st9' },
      { materialName: '229', materialId: 'egger:h1199_st12' },
      { materialName: '222', materialId: 'egger:h2033_st10' },
      { materialName: '215', materialId: 'egger:h1715_st12' },
      { materialName: '214', materialId: 'egger:h3734_st9' },
      { materialName: '199', materialId: 'egger:u999_st7' },
      { materialName: '190', materialId: 'egger:w980_st7' },
      { materialName: '165', materialId: 'egger:u645_st9' },
      { materialName: '160', materialId: 'egger:u640_st9' },
      { materialName: '155', materialId: 'egger:u575_st9' },
      { materialName: '152', materialId: 'egger:u502_st9' },
      { materialName: 'Klarglas', materialId: '' },
      { materialName: 'TestHalifax', materialId: 'egger:h1181_st37' }
    ]
  },
  debugConfiguration: {
    createDebugGeometry: false
  },
  tecConfigInfo: {
    baseUrlDebug: 'https://localhost:7125/',

    /**
     * If you do not want to use the proxy provided by Roomle
     * uncomment the next three lines and comment the line
     * which has the Roomle proxy URL in it.
     * BE AWARE: That the example url dfteccdeveu01-app.azurewebsites.net
     * only works if you're requesting from localhost:3100 otherwise you
     * will have CORS issues
     */

    // baseUrl: "https://connect.homag.com/",
    subscriptionId: "a", // <your subscription id here>
    key: "b", // <your tapio key id here>

    /** comment this line if you do not want to use the Roomle proxy  */
    // localUrl: 'https://localhost:7125/',

    baseUrl:
      'https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request?url=',

    // OM means order-manager
    // These are empty because they are inserted by the roomle proxy for this demo.
    om: {
      subscriptionId: '',
      key: '',
      importBaseUrl: 'https://connect.homag.com'
    },

    // Your library ID here
    libraryId: 'nobilia_Minifabrik'
  }
};
