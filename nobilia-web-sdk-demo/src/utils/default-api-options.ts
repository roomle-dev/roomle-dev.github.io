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
