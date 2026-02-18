import { type HiApiOptions } from '@roomle/web-sdk';

export interface TcOptions extends HiApiOptions {
  libraryId: string;
}

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
    /**
     * If you do not want to use the proxy provided by Roomle
     * uncomment the next three lines and comment the line
     * which has the Roomle proxy URL in it.
     * BE AWARE: That the example url dfteccdeveu01-app.azurewebsites.net
     * only works if you're requesting from localhost:3100 otherwise you
     * will have CORS issues
     */

    baseUrl:
      'https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request?url=',
    // baseUrl: 'http://localhost:8080/proxy_request?url=',
    endpointUrl: 'https://connect.homag.com/',

    /**
     *  ALERT!
     *  These subscriptionIds and keys should never be stored in your frontend code, they should be stored somewhere secure,
     *  For example, in a backend server or in a proxy that forwards your requests to HOMAG Cloud.
     *  Our demo proxy provides the ability to override these credentials for testing, but please keep these unset for production!
     */

    /*
    * PROXY!
    * See an example of a proxy here https://github.com/roomle-dev/roomle-dev.github.io/blob/master/nobilia-web-sdk-demo/proxy/index.js#L13
    * If you set `subscriptionId` and `key` in this config file, it will override the credentials the example proxy uses.
    * This credential overriding should only be used in testing and not on production, see above.
    */

    language: 'en-US,en', // en-US,en  de-DE,de

    subscriptionId: '', // <your subscription id here> // NEVER PUT THESE IN FRONTEND PRODUCTION CODE
    libraryId: 'nobilia_Minifabrik',
    key: '',

    // OM means order-manager
    om: {
      subscriptionId: '', // <your subscription id here> // NEVER PUT THESE IN FRONTEND PRODUCTION CODE
      key: '', // <your tapio key id here> // NEVER PUT THESE IN FRONTEND PRODUCTION CODE
      importBaseUrl: 'https://connect.homag.com'
    },
  } as TcOptions,
};





