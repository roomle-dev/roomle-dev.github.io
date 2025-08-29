<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import RoomleEmbeddingApi from "@roomle/embedding-lib";
import apiOptions from './utils/default-api-options';
import {onMounted} from "vue";
import {calculateTotalSum, getQueryParam} from "./utils/helpers";
import {createExtObjId} from "@roomle/web-sdk";

// Data

const FAKE_ROOT_TAG = 'external:root-tag';

// Methods

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
    overrideServerUrl: 'https://roomle.com/t/cp-internal',
    catalogRootTag: createExtObjId(FAKE_ROOT_TAG),
    featureFlags: {
      globalCallbacks: false,
      openCloseAnimation: true,
      slopingRoof: true,
    },
    autoStart: true,
    restrictionLevel: 1,
    deeplink: 'https://roomle-dev.github.io/nobilia-web-sdk-demo?plan_id=#CONFIGURATIONID#  ',
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
