<template>
  <GitHubLink :position="'top right'" :link="'https://github.com/roomle-dev/roomle-dev.github.io/tree/master/nobilia-web-sdk-demo'" />
  <div id="settings-bar">
    <label for="locale-input">Locale:</label>
    <input type="text" id="locale-input" v-model="settings.locale" placeholder="e.g. en, de" />
    <label for="subscription-id-input">Subscription ID:</label>
    <input type="text" id="subscription-id-input" v-model="settings.subscriptionId" placeholder="Subscription ID" />
    <label for="user-right-select">Parameter Level:</label>
    <select id="user-right-select" v-model="settings.userRight">
      <option value="Simple">Simple</option>
      <option value="Advanced">Advanced</option>
      <option value="Master">Master</option>
    </select>
    <button id="reload-settings" @click="reloadWithSettings">Reload</button>
  </div>
  <div id="container"></div>
</template>

<script setup lang="ts">
import RoomleEmbeddingApi from "@roomle/embedding-lib";
import apiOptions from './utils/default-api-options';
import {onMounted, reactive} from "vue";
import {calculateTotalSum, getQueryParam} from "./utils/helpers";
import GitHubLink from "../../shared/components/GitHubLink.vue";
import { omPostRequest } from "./utils/loader";
import {setupHi} from "@roomle/embedding-lib/hi";

const LS_KEY = 'nobilia-demo-settings';

interface DemoSettings {
  locale: string;
  subscriptionId: string;
  userRight: 'Simple' | 'Advanced' | 'Master';
}

const loadSettings = (): DemoSettings => {
  const defaults: DemoSettings = {
    locale: 'en',
    subscriptionId: '',
    userRight: 'Simple',
  };
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaults, ...parsed };
    }
  } catch {
    // ignore parse errors
  }
  return defaults;
};

const saveSettings = (s: DemoSettings) => {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
};

const settings = reactive<DemoSettings>(loadSettings());

// Query params override localStorage values
const qpLocale = getQueryParam('locale');
if (qpLocale) settings.locale = qpLocale;
const qpSubscriptionId = getQueryParam('subscriptionId');
if (qpSubscriptionId) settings.subscriptionId = qpSubscriptionId;
const qpUserRight = getQueryParam('user_right');
if (qpUserRight === 'Simple' || qpUserRight === 'Advanced' || qpUserRight === 'Master') {
  settings.userRight = qpUserRight;
}

const reloadWithSettings = () => {
  saveSettings(settings);
  window.location.reload();
};

const EXTERNAL_ID_PREFIX = '__ext__obj__#';

type ExtObjId = `${typeof EXTERNAL_ID_PREFIX}${string}`;

const createExtObjId = (id: string): ExtObjId => `${EXTERNAL_ID_PREFIX}${id}`;

// Data

const FAKE_ROOT_TAG = 'external:root-tag';

// Methods

const HOMAG_INTELLIGENCE_ENDPOINT =
  'https://europe-west3-rml-showcases.cloudfunctions.net/proxy_request?url=';
  // 'http://localhost:8080/proxy_request?url=';

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
  key: string;
  om?: OrderManagerOptions;
  endpointUrl?: string;
  localUrl?: string;
  language?: string;
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
  if (apiOptions.language) {
    (authorizationHeaders.headers as any)['accept-language'] =
      apiOptions.language;
  }
  try {
    const startTime = performance.now();
    const { subscriptionId, endpointUrl, key } = apiOptions;
    // const key = ''; //_key;
    const response = await fetch(
      HOMAG_INTELLIGENCE_ENDPOINT +
        encodeURIComponent(url) +
        `&subscriptionId=${encodeURIComponent(subscriptionId)}` +
        (key ? `&apiKey=${encodeURIComponent(key)}` : '') +
        (endpointUrl ? `&baseUrl=${encodeURIComponent(endpointUrl)}` : '') /*+ '&nobiliaHack=true'*/,
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
  // Persist current settings to localStorage on start
  saveSettings(settings);

  const planId =
      getQueryParam('plan_id') ?? 'ps_8jjg0zezlblb48vzn8qas9vwwn7fqbg';
  const debugMode = (getQueryParam('debug') ?? 'false') === 'true';
  const libraryId =
      getQueryParam('library_id') ?? apiOptions.tecConfigInfo.libraryId;

  apiOptions.tecConfigInfo.libraryId = libraryId;
  apiOptions.uiConfiguration.userRight = settings.userRight;

  const options = {
    moc: true,
    saveToIdb: false,
    locale: settings.locale,
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
      enableTwoLevelCatalog: true,
    },
    buttons: {
      undo: true,
      redo: true,
    },
    autoStart: true,
    hi: {
      libraryId: apiOptions.tecConfigInfo.libraryId,
      serverOptions: {
        language: settings.locale,
        key: apiOptions.tecConfigInfo.libraryId,
        subscriptionId: settings.subscriptionId || apiOptions.tecConfigInfo.om.subscriptionId,
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

  await setupHi(options.hi, {
    onLoadJavascript: (_libraryId: string) => loadCalcScript(options.hi),
    onLoadArticleCatalog: (_libraryId: string) => loadArticleCatalog(options.hi),
    onLoadMasterData: (_libraryId: string) => loadMasterData(options.hi),
    onPlaceOrder: async (orderData: any) => {
      const dataStr = JSON.stringify(orderData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'orderData.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    onFetchPrice: async (orderData: any) => {
      const useNobiliaHack = libraryId.includes('nobilia');
      const requestHeader = {
        'x-aux-header': useNobiliaHack ? 'nobilia' : 'none',
      };
      const body = {
        orderData,
      };
      const url = '/api/price/calculate';
      const json = await omPostRequest(options.hi, body, url, requestHeader);
      return json;
    },
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
#settings-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-bottom: 1px solid #ccc;
  font-family: sans-serif;
  font-size: 13px;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#settings-bar label {
  font-weight: 600;
}

#settings-bar input,
#settings-bar select {
  padding: 0.25rem 0.4rem;
}

#settings-bar button {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
}

#container {
  height: calc(100vh - 42px);
  width: 100vw;
}
</style>
