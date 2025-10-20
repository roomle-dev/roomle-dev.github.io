<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import RoomleEmbeddingApi from "@roomle/embedding-lib";
import apiOptions from './utils/default-api-options';
import {onMounted} from "vue";
import {calculateTotalSum, getQueryParam} from "./utils/helpers";

const EXTERNAL_ID_PREFIX = '__ext__obj__#';

type ExtObjId = `${typeof EXTERNAL_ID_PREFIX}${string}`;

const createExtObjId = (id: string): ExtObjId => `${EXTERNAL_ID_PREFIX}${id}`;

// Data

const FAKE_ROOT_TAG = 'external:root-tag';

// Methods

const HOMAG_INTELLIGENCE_ENDPOINT =
  'https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request?url=';

interface HomagIntelligenceInitData {
  libraryId: string;
  serverOptions?: ApiOptions;
  debugLogging?: boolean;
}

interface OrderManagerOptions {
  key?: string;
  importBaseUrl?: string;
}

interface ApiOptions {
  subscriptionId: string;
  om?: OrderManagerOptions;
  endpointUrl?: string;
  localUrl?: string;
}

const fetchDataWithAuthorization = async (
  url: string,
  type: 'json' | 'text',
  apiOptions: ApiOptions,
  debug: { property: string } = { property: 'default' },
) => {
  const authorizationHeaders = {
    headers: {
      'Content-Type': type === 'json' ? 'application/json' : 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
  };
  try {
    const startTime = performance.now();
    const { subscriptionId, endpointUrl } = apiOptions;
    const key = ''; //om?.key || '';
    const response = await fetch(
      HOMAG_INTELLIGENCE_ENDPOINT +
        encodeURIComponent(url) +
        `&subscriptionId=${encodeURIComponent(subscriptionId)}` +
        (key ? `&apiKey=${encodeURIComponent(key)}` : '') +
        (endpointUrl ? `&baseUrl=${encodeURIComponent(endpointUrl)}` : ''),
      authorizationHeaders,
    );
    const endTime = performance.now();
    const fetchTime = endTime - startTime; // Calculate the fetch time

    if (!response.ok) {
      console.warn(`Failed to fetch data from ${debug.property}`);
      throw new Error(
        `Failed to fetch data from ${url}: ${response.statusText}`,
      );
    }
    console.info(`Success to fetch data from ${debug.property}`);
    console.info(
      `The data for ${debug.property} was fetched in ${fetchTime} milliseconds`,
    );

    return response;
  } catch (error) {
    console.warn(`Failed to fetch data from ${debug.property}`);
    console.error(error);
    throw error;
  }
};

const loadArticleCatalog = async (
  apiOptions: HomagIntelligenceInitData,
) => {
  const { libraryId, serverOptions } = apiOptions;
  // NOBILIA DEMO HACKS
  const endpoint = libraryId.includes('nobilia')
    ? `api/pos/libraries/${libraryId}/articles`
    : `api/pos/articles?libraryId=${libraryId}`;
  const articlesCatalog = await fetchDataWithAuthorization(
    endpoint,
    'json',
    serverOptions as ApiOptions,
    { property: 'articles' },
  );
  return await articlesCatalog.json();
};

const loadMasterData = async (
  apiOptions: HomagIntelligenceInitData,
) => {
  const libraryId = apiOptions.libraryId;
  const serverOptions = apiOptions.serverOptions as ApiOptions;
  // NOBILIA DEMO HACKS
  const endpoint = libraryId.includes('nobilia')
    ? `api/pos/libraries/${libraryId}/masterData`
    : `api/pos/masterData?libraryId=${libraryId}`;
  const masterData = await fetchDataWithAuthorization(
    endpoint,
    'json',
    serverOptions,
    { property: 'masterData' },
  );
  return (await masterData.json()) as any;
};

const loadCalcScript = async (
  apiOptions: HomagIntelligenceInitData,
) => {
  const libraryId = apiOptions.libraryId;
  const serverOptions = apiOptions.serverOptions as ApiOptions;
  // NOBILIA DEMO HACKS
  const url = libraryId.includes('nobilia')
    ? `api/pos/libraries/${libraryId}/calc.js`
    : 'api/pos/calc.js?libraryId=' + encodeURIComponent(libraryId);
  const response = await fetchDataWithAuthorization(url, 'text', serverOptions, {
    property: 'calc.js',
  });
  let jsCode = await response.text();
  if (!jsCode) {
    throw new Error('Script load error');
  }
  return jsCode;
};

const onRequestPlan = (roomDesignerApi: any) => {
  roomDesignerApi.extended.sendToOM(true);
}

const doPriceCalculation = async (roomDesignerApi: any) => {
  const priceData = await roomDesignerApi.extended.fetchPrice();
  const calculatedPrice = calculateTotalSum(priceData.orderData);

  roomDesignerApi.ui.setPrice('€', calculatedPrice);
}

const startRoomlePlanner = async () => {
  const planId =
      getQueryParam('plan_id') ?? 'ps_8jjg0zezlblb48vzn8qas9vwwn7fqbg';
  const debugMode = (getQueryParam('debug') ?? 'false') === 'true';
  const libraryId =
      getQueryParam('library_id') ?? apiOptions.tecConfigInfo.libraryId;
  const userRight = getQueryParam('user_right') ?? null;

  apiOptions.tecConfigInfo.libraryId = libraryId;
  if (
      userRight == 'Simple' ||
      userRight == 'Advanced' ||
      userRight == 'Master'
  ) {
    apiOptions.uiConfiguration.userRight = userRight;
  }

  const options = {
    moc: true,
    saveToIdb: false,
    notifications: {
      'first-person-controls': false,
      'interaction.add-element': false,
      'interaction.confirm-ghosts': false,
      'interaction.parameters-changed': false,
      'interaction.root-element': false,
      'load-idb-config': false,
      'stop-configure-hint': false,
    },
    overrideServerUrl: 'https://www.roomle.com/t/bo-test',
    catalogRootTag: createExtObjId(FAKE_ROOT_TAG),
    featureFlags: {
      globalCallbacks: false,
      openCloseAnimation: true,
      slopingRoof: true,
    },
    buttons: {
      undo: true,
      redo: true,
    },
    autoStart: true,
    hi: {
      libraryId: apiOptions.tecConfigInfo.libraryId,
      serverOptions: {
        subscriptionId: apiOptions.tecConfigInfo.om.subscriptionId,
        om: {
          key: apiOptions.tecConfigInfo.om.key,
          importBaseUrl: apiOptions.tecConfigInfo.om.importBaseUrl,
        },
      },
    },
    externalObjectSettings: apiOptions,
  };

  if (debugMode !== undefined) {
    (options as any).debugGeometry = debugMode;
  }

  RoomleEmbeddingApi.setupHi({
    onLoadJavascript: (_libraryId) => loadCalcScript(options.hi),
    onLoadArticleCatalog: (_libraryId) => loadArticleCatalog(options.hi),
    onLoadMasterData: (_libraryId) => loadMasterData(options.hi),
  });

  const instance = await RoomleEmbeddingApi.createPlanner(
      'homag',
      document.getElementById('container')!,
      options,
  );

  await instance.ui.loadObject(planId);

  instance.extended.callbacks.onCompletelyLoaded = () => {
    doPriceCalculation(instance);
  };
  instance.ui.callbacks.onPlanElementAdded = () => {
    doPriceCalculation(instance);
  };
  instance.ui.callbacks.onPlanElementChanged = () => {
    doPriceCalculation(instance);
  };
  instance.ui.callbacks.onPlanElementRemoved = () => {
    doPriceCalculation(instance);
  };
  instance.ui.callbacks.onRequestPlan = async () => {
    onRequestPlan(instance);
  };

  (window as any).instance = instance;
}

// Hooks

onMounted(() => startRoomlePlanner())
</script>

<style scoped>
#container {
  height: 100vh;
  width: 100vw;
}
</style>
