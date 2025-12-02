<template>
  <GitHubLink :position="'top right'" :link="'https://github.com/roomle-dev/roomle-dev.github.io/tree/master/transparency'" />
  <div class="top"></div>


  <div
      ref="scene"
      class="scene"
  >
    <img class="loader" :src="Loading"/>

  </div>

  <header aria-label="Masthead">
    <h1 style="mix-blend-mode: unset">
      <span>Roomle's<br/>Room Planner</span>
    </h1>
  </header>
  <main>
    <article>
      <h2>There's a Sofa in the room</h2>
      <p>
        Believe it or not, you can put sofas, chairs, tables, and even a TV in
        <a href="https://roomle.com/">Roomle's</a>. Room designer if you
        really wanted to.
        <a
            href="https://www.roomle.com/t/cp/index.html?moc=true&edit=true&id=86qux3bxbgv615qxzby3k2q4a4oni7o"
        >Give it a try</a
        >
        Nobody is going to stop you.
      </p>
      <p>Look, the floor is textured too, amazing.</p>
      <h2>This is a cool use of transparency</h2>
      <p>
        Don't you agree? Something something something something something I
        think it's cool. Just hitting tab on copilot prompts over and over
        again. To be honest, I'm not sure what to write here. It's just a
        bunch of text to fill up the space.
      </p>
      <p>
        Look how the text is still readable even though the background is
        transparent.
      </p>
      <figure>
        <p class="pt-double-canon">Transparent</p>
        <p class="pt-canon">Transparent</p>
        <p class="pt-double-great-primer">Transparent</p>
        <p class="pt-double-english">Transparent</p>
        <p class="pt-double-pica">Double Pica</p>
        <p class="pt-paragon">Transparent</p>
        <p class="pt-english">Transparent</p>
        <p class="pt-pica">Transparent</p>
        <p class="pt-small-pica">Transparent</p>
        <p class="pt-bourgeois">Transparent</p>
      </figure>
      <table>
        <caption>
          OMG A TABLE
        </caption>
        <thead>
        <tr>
          <th>Text Style</th>
          <th>Point Size</th>
          <th>Rem Size</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Display</td>
          <td>Transparent</td>
          <td>4.666</td>
        </tr>
        <tr>
          <td>Heading 1</td>
          <td>Transparent</td>
          <td>3.999</td>
        </tr>
        <tr>
          <td>Heading 2</td>
          <td>Transparent</td>
          <td>2.999</td>
        </tr>
        <tr>
          <td>Heading 3</td>
          <td>Transparent</td>
          <td>2.333</td>
        </tr>
        <tr>
          <td>Heading 4</td>
          <td>Transparent</td>
          <td>2.000</td>
        </tr>
        <tr>
          <td>Heading 5</td>
          <td>Transparent</td>
          <td>1.666</td>
        </tr>
        <tr>
          <td>Heading 6</td>
          <td>Transparent</td>
          <td>1.166</td>
        </tr>
        <tr>
          <td>Body</td>
          <td>Transparent</td>
          <td>1.000</td>
        </tr>
        <tr>
          <td>Fine Print 1</td>
          <td>Transparent</td>
          <td>0.916</td>
        </tr>
        <tr>
          <td>Fine Print 2</td>
          <td>Transparent</td>
          <td>0.750</td>
        </tr>
        </tbody>
      </table>
      <h2>I don't know how to read this.</h2>
      <p>
        Chinese, Japanese, Korean are very aesthetically pleasing even if I
        don't know what they mean. They look cool no matter where you put
        them.
      </p>
      <figure>
        <div lang="zh-Hans">
          <p class="pt-chu">初号</p>
          <p class="pt-xiaochu">小初号</p>
          <p class="pt-yi">一号</p>
          <p class="pt-er">二号</p>
          <p class="pt-xiaoer">小二号</p>
          <p class="pt-san">三号</p>
          <p class="pt-si">四号</p>
          <p class="pt-xiaosi">小四号</p>
          <p class="pt-wu">五号</p>
          <p class="pt-xiaowu">小五号</p>
        </div>
      </figure>
      <table>
        <caption>
          OMG ANOTHER TABLE
        </caption>
        <thead>
        <tr>
          <th>Text Style</th>
          <th>Point Size</th>
          <th>Rem Size</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Display</td>
          <td lang="zh-Hans">初号</td>
          <td>3.499</td>
        </tr>
        <tr>
          <td>Heading 1</td>
          <td lang="zh-Hans">小初号</td>
          <td>2.999</td>
        </tr>
        <tr>
          <td>Heading 2</td>
          <td lang="zh-Hans">一号</td>
          <td>2.166</td>
        </tr>
        <tr>
          <td>Heading 3</td>
          <td lang="zh-Hans">二号</td>
          <td>1.833</td>
        </tr>
        <tr>
          <td>Heading 4</td>
          <td lang="zh-Hans">小二号</td>
          <td>1.500</td>
        </tr>
        <tr>
          <td>Heading 5</td>
          <td lang="zh-Hans">三号</td>
          <td>1.333</td>
        </tr>
        <tr>
          <td>Heading 6</td>
          <td lang="zh-Hans">四号</td>
          <td>1.166</td>
        </tr>
        <tr>
          <td>Body</td>
          <td lang="zh-Hans">小四号</td>
          <td>1.000</td>
        </tr>
        <tr>
          <td>Fine Print 1</td>
          <td lang="zh-Hans">五号</td>
          <td>0.875</td>
        </tr>
        <tr>
          <td>Fine Print 2</td>
          <td lang="zh-Hans">小五号</td>
          <td>0.750</td>
        </tr>
        </tbody>
      </table>
      <h2>Thanks for checking out the transparency demo</h2>
      <p>
        I hope you enjoyed it. I know I did. I'm not sure what else to write
        here. I'm just trying to fill up the space. Are you still reading
        this?
      </p>
      <br>
      <br>
      <br>
      <br>
    </article>
  </main>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import RoomleSdk from "@roomle/web-sdk";
import {startScrolling} from "./utils/scroller.ts";
import Loading from './loading.svg?url'
import GitHubLink from "../../shared/components/GitHubLink.vue";

const scene = ref();

onMounted(async () => {
  await RoomleSdk.setGlobalInitData({
    configuratorId: "demoConfigurator",
    customApiUrl: "https://api.roomle.com/v2",
  });

  const rubensPlanner = await RoomleSdk.getPlanner({
    moc: true,
    edit: true,
    id: "86qux3bxbgv615qxzby3k2q4a4oni7o",
    transparentBackground: true,
  });
  await rubensPlanner.boot();
  const rubensPlannerApi = rubensPlanner.getApi();
  await rubensPlannerApi.init(scene.value!);

  await rubensPlannerApi.loadPlan('86qux3bxbgv615qxzby3k2q4a4oni7o')

  startScrolling()
});
</script>

<style>
.scene {
  margin-top: -1rem;
  position: fixed;
  width: 100vw;
  height: 100vh;
  right: 0;
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
}

*,
*::before,
*::after {
  font-feature-settings: 'kern';
  -webkit-font-kerning: normal;
  font-kerning: normal;
  -moz-osx-font-smoothing: grayscale !important;
  -webkit-font-smoothing: antialiased !important;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

body {
  display: grid;
  gap: var(--section-spacing);
  padding-inline: var(--page-padding-inline);
  overflow-x: hidden;
}

main,
main > * {
  pointer-events: none;
}

header {
  display: grid;
  align-content: end;
  min-block-size: 100vh;
  min-block-size: 100dvb;
  padding-block: var(--section-spacing);
}

footer {
  margin-block: var(--section-spacing);
  -webkit-padding-start: var(--gutter);
  padding-inline-start: var(--gutter);
  -webkit-border-start: 6px double;
  border-inline-start: 6px double;
}

a {
  font-weight: 600;
  color: currentcolor;
  text-underline-offset: 0.2ex;
}

em {
  font-family: 'Georgia', serif;
}

h1,
h2 {
  font-weight: 900;
  mix-blend-mode: difference;
}

h1 {
  display: grid;
  gap: 0.2ex;
  align-content: center;
  font-size: clamp(
      var(--pt-paragon),
      var(--pt-pica) + 4.125vw,
      var(--pt-double-canon)
  );
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

h1 small {
  font-size: var(--pt-bourgeois);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-indent: 0.1ch;
}

h1 span {
  text-indent: -0.225ch;
}

article {
  counter-reset: section;
}

h2 {
  display: grid;
  gap: 0.25ex;
  position: relative;
  max-inline-size: 25ch;
  -webkit-margin-before: var(--section-spacing);
  margin-block-start: var(--section-spacing);
  font-size: clamp(
      var(--pt-great-primer),
      var(--pt-small-pica) + 4.125vw,
      var(--pt-double-great-primer)
  );
  line-height: 1.2;
}

h2::before,
h2::after {
  font-size: var(--pt-long-primer);
  line-height: 1;
}

h2::before {
  content: '№' counter(section);
  counter-increment: section;
  justify-self: start;
  padding: 0.5ex;
  font-weight: 600;
  border: 6px double;
  border-radius: 1px;
}

h2::after {
  content: '';
  position: absolute;
  transform: translate3d(-100%, calc(3px + 0.5ex + 0.5em), 0);
  inline-size: var(--page-padding-inline);
  -webkit-border-after: 2px solid;
  border-block-end: 2px solid;
}

h2 q {
  position: relative;
}

h2 q::before {
  position: absolute;
  transform: translatex(-100%);
}

h2 + p {
  -webkit-margin-before: calc(var(--stack) * 0.5);
  margin-block-start: calc(var(--stack) * 0.5);
}

p,
ul {
  max-inline-size: var(--line-length);
  -webkit-margin-before: var(--stack);
  margin-block-start: var(--stack);
}

p:first-child {
  -webkit-margin-before: 0;
  margin-block-start: 0;
}

figure,
table {
  -webkit-margin-before: calc(var(--section-spacing) * 0.5);
  margin-block-start: calc(var(--section-spacing) * 0.5);
}

figure {
  position: relative;
  inset-inline-start: 50%;
  inset-inline-end: 50%;
  inline-size: 100%;
  inline-size: 100vw;
  -webkit-margin-start: -50vw;
  margin-inline-start: -50vw;
  -webkit-margin-end: -50vw;
  margin-inline-end: -50vw;
  padding-inline: var(--page-padding-inline);
  -webkit-padding-after: 1ex;
  padding-block-end: 1ex;
  overflow: auto;
  scrollbar-gutter: stable;
}

table {
  inline-size: 100%;
  max-inline-size: var(--line-length);
}

table,
th,
td {
  border: 1px solid;
}

th,
td {
  padding: 0.5ex;
  text-align: start;
}

th {
  padding-block: 1ex;
  font-weight: 600;
  font-size: var(--pt-bourgeois);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

caption {
  -webkit-margin-after: calc(var(--stack) * 0.5);
  margin-block-end: calc(var(--stack) * 0.5);
  font-size: var(--pt-english);
  font-weight: 900;
  text-align: start;
}

[class^='pt-'] {
  display: flex;
  gap: 1rem;
  align-items: center;
  block-size: 1.5em;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

[class^='pt-']::before {
  display: grid;
  place-items: center;
  min-block-size: 50%;
  -webkit-padding-end: 0.5rem;
  padding-inline-end: 0.5rem;
  font-size: var(--pt-bourgeois);
  font-weight: 600;
  letter-spacing: 0;
  text-align: center;
  text-transform: uppercase;
  word-break: break-all;
  -webkit-border-end: 6px double;
  border-inline-end: 6px double;
}

[class^='pt-'] + [class^='pt-'] {
  -webkit-margin-before: 2vmax;
  margin-block-start: 2vmax;
}

.pt-double-canon {
  font-size: var(--pt-double-canon);
}

.pt-double-canon::before {
  content: '56';
}

.pt-canon {
  font-size: var(--pt-canon);
}

.pt-canon::before {
  content: '48';
}

.pt-double-great-primer {
  font-size: var(--pt-double-great-primer);
}

.pt-double-great-primer::before {
  content: '36';
}

.pt-double-english {
  font-size: var(--pt-double-english);
}

.pt-double-english::before {
  content: '28';
}

.pt-double-pica {
  font-size: var(--pt-double-pica);
}

.pt-double-pica::before {
  content: '24';
}

.pt-paragon {
  font-size: var(--pt-paragon);
}

.pt-paragon::before {
  content: '20';
}

.pt-great-primer {
  font-size: var(--pt-great-primer);
}

.pt-great-primer::before {
  content: '18';
}

.pt-english {
  font-size: var(--pt-english);
}

.pt-english::before {
  content: '14';
}

.pt-pica {
  font-size: var(--pt-pica);
}

.pt-pica::before {
  content: '12';
}

.pt-small-pica {
  font-size: var(--pt-small-pica);
}

.pt-small-pica::before {
  content: '11';
}

.pt-long-primer {
  font-size: var(--pt-long-primer);
}

.pt-long-primer::before {
  content: '10';
}

.pt-bourgeois {
  font-size: var(--pt-bourgeois);
}

.pt-bourgeois::before {
  content: '09';
}

.pt-chu {
  font-size: var(--pt-chu);
}

.pt-chu::before {
  content: '42';
}

.pt-xiaochu {
  font-size: var(--pt-xiaochu);
}

.pt-xiaochu::before {
  content: '36';
}

.pt-yi {
  font-size: var(--pt-yi);
}

.pt-yi::before {
  content: '26';
}

.pt-xiaoyi {
  font-size: var(--pt-xiaoyi);
}

.pt-xiaoyi::before {
  content: '24';
}

.pt-er {
  font-size: var(--pt-er);
}

.pt-er::before {
  content: '22';
}

.pt-xiaoer {
  font-size: var(--pt-xiaoer);
}

.pt-xiaoer::before {
  content: '18';
}

.pt-san {
  font-size: var(--pt-san);
}

.pt-san::before {
  content: '16';
}

.pt-xiaosan {
  font-size: var(--pt-xiaosan);
}

.pt-xiaosan::before {
  content: '15';
}

.pt-si {
  font-size: var(--pt-si);
}

.pt-si::before {
  content: '14';
}

.pt-xiaosi {
  font-size: var(--pt-xiaosi);
}

.pt-xiaosi::before {
  content: '12';
}

.pt-wu {
  font-size: var(--pt-wu);
}

.pt-wu::before {
  content: '10.5';
}

.pt-xiaowu {
  font-size: var(--pt-xiaowu);
}

.pt-xiaowu::before {
  content: '9';
}

[lang='zh-Hans'] {
  font-family: system-ui, sans-serif;
}

table [lang='zh-Hans'] {
  font-weight: 600;
}

figure div[lang='zh-Hans'] {
  -ms-writing-mode: tb-lr;
  writing-mode: vertical-lr;
}

figure div[lang='zh-Hans'] [class^='pt-'] {
  font-weight: 900;
  letter-spacing: 0.25em;
}

figure div[lang='zh-Hans'] [class^='pt-']::before {
  min-block-size: 100%;
  font-size: var(--pt-xiaowu);
}

</style>
