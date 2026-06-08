import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const componentSource = await readFile(new URL("../components/aigc/AigcStudioClient.tsx", import.meta.url), "utf8");
const pageSource = await readFile(new URL("../app/studio/page.tsx", import.meta.url), "utf8");
const aigcPageSource = await readFile(new URL("../app/aigc/page.tsx", import.meta.url), "utf8");
const productsPageSource = await readFile(new URL("../app/products/page.tsx", import.meta.url), "utf8");
const brandHeroSource = await readFile(new URL("../components/brand/BrandHero.tsx", import.meta.url), "utf8");
const adminAigcPageSource = await readFile(new URL("../app/admin/(dashboard)/aigc/page.tsx", import.meta.url), "utf8");

test("studio page is a promotional page with a login-gated workbench entry", () => {
  assert.match(componentSource, /创意工坊/);
  assert.match(componentSource, /login\?next=https%3A%2F%2Fstudio\.cylonai\.cn/);
  assert.match(componentSource, /https:\/\/studio\.cylonai\.cn/);
  assert.match(componentSource, /target="_blank"/);
  assert.doesNotMatch(componentSource, /创意工作台/);
  assert.doesNotMatch(componentSource, /AIGC 工作台/);
  assert.doesNotMatch(componentSource, /创作工作台/);
  assert.doesNotMatch(componentSource, /服务即将接入/);
  assert.doesNotMatch(componentSource, /准备好后/);
  assert.doesNotMatch(componentSource, /后续工作台权限判断/);
  assert.doesNotMatch(componentSource, /fetch\(activeSection\.endpoint/);
  assert.doesNotMatch(componentSource, /HistoryPanel/);
  assert.doesNotMatch(pageSource, /aiGenerationTask/);
  assert.doesNotMatch(pageSource, /initialTasks/);
});

test("public workbench CTAs point to the live creative workbench service", () => {
  for (const source of [aigcPageSource, productsPageSource, brandHeroSource]) {
    assert.match(source, /https:\/\/studio\.cylonai\.cn/);
    assert.match(source, /创意工坊/);
  }
});

test("admin AIGC copy no longer describes the workbench as not yet connected", () => {
  assert.doesNotMatch(adminAigcPageSource, /创意工作台接入后/);
  assert.doesNotMatch(adminAigcPageSource, /创意工作台/);
  assert.match(adminAigcPageSource, /创意工坊/);
});
