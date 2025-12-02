<template>
  <GitHubLink :link="'https://github.com/roomle-dev/roomle-dev.github.io/tree/master/glb-viewer-example'" />
  <div class="container">
    <div ref="scene" class="scene"></div>
    <div class="controls">
      <button @click="loadObject('roomle_content_demo:machine008')">
        Load a lawnmower
      </button>
      <button @click="loadObject('roomle_content_demo:electronics001')">
        Load a speaker
      </button>
      <button @click="loadObject('samsung:DV80F5E5HGW')">
        Load a washing machine
      </button>
      <button v-if="isMobile && arUrl">
        <a class="ar-button" :href="arUrl" rel="ar">
          <!-- img tag prevents some errors in iOS -->
          <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
          />
          OPEN IN AR
        </a>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import GitHubLink from '../../shared/components/GitHubLink.vue'
import RoomleSdk from "@roomle/web-sdk";
import type RapiAccess from "@roomle/web-sdk/lib/definitions/common-core/src/rapi-access";

interface Props {
  objectId?: string;
}

const props = defineProps<Props>();

const scene = ref<HTMLDivElement | null>(null);
const arUrl = ref<string>("");
const isMobile = ref(isAndroid() || isIOs());

let glbViewerApi: any = null;
let rapiAccess: RapiAccess | null = null;
let glbViewer: any = null;

function isAndroid(): boolean {
  return /(android)/i.test(navigator.userAgent);
}

function isIOs(): boolean {
  return (
      (/iPad|iPhone|iPod/i.test(navigator.platform) ||
          (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
      !(window as any).MSStream
  );
}

function createAndroidARUrl(glbUrl: string, fallbackUrl: string = ""): string {
  return (
      "intent://arvr.google.com/scene-viewer/1.0?file=" +
      glbUrl +
      "&mode=ar_only" +
      "&resizable=false" +
      "#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=" +
      fallbackUrl +
      ";end;"
  );
}

async function setArUrl(rapiAccessInstance: RapiAccess | null, id: string): Promise<void> {
  if (rapiAccessInstance) {
    const { assets } = await rapiAccessInstance.getItem(id);
    arUrl.value = isIOs()
        ? assets.usdz.url
        : createAndroidARUrl(assets.glb.url);
  }
}

async function loadObject(id: string): Promise<void> {
  arUrl.value = "";
  await Promise.all([
    glbViewerApi.loadStaticItem(id),
    setArUrl(rapiAccess, id),
  ]);
}

onMounted(async () => {
  RoomleSdk.setGlobalInitData({
    configuratorId: "demoConfigurator",
    customApiUrl: "https://api.roomle.com/v2",
  });

  [rapiAccess, glbViewer] = await Promise.all([
    isMobile.value ? RoomleSdk.getRapiAccess() : Promise.resolve(null),
    RoomleSdk.getGlbViewer(),
  ]);

  glbViewer.boot();
  glbViewerApi = await glbViewer.getApi();
  await glbViewerApi.init(scene.value);

  const initialId = props.objectId || "roomle_content_demo:kitchenware003";
  await glbViewerApi.loadStaticItem(initialId);
  setArUrl(rapiAccess, initialId);
});
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
.scene {
  width: 100%;
  height: 70vh;
}
.controls {
  height: 10%;
  background-color: lightgray;
  display: flex;
  padding: 0.5rem;
  box-sizing: border-box;
}
button {
  cursor: pointer;
  margin-right: 0.5rem;
}
</style>
