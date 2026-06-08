import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const componentSource = await readFile(new URL("../components/aigc/AigcStudioClient.tsx", import.meta.url), "utf8");

test("studio promo badge and floating entry use the same user state as the page", () => {
  assert.match(componentSource, /user \? "官网可浏览，创意工坊权限已确认" : "官网可浏览，创意工坊需登录"/);
  assert.match(componentSource, /<FloatingServicePanel user=\{user\}/);
  assert.match(componentSource, /function FloatingServicePanel\(\{ user \}: \{ user: User \}\)/);
});
