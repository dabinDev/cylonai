import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const loginSource = await readFile(new URL("../app/login/page.tsx", import.meta.url), "utf8");
const registerSource = await readFile(new URL("../app/register/page.tsx", import.meta.url), "utf8");

test("user login performs a full navigation and can continue to the real creative studio", () => {
  assert.match(loginSource, /window\.location\.assign\(next\)/);
  assert.doesNotMatch(loginSource, /router\.push\(next\)/);
  assert.match(loginSource, /https:\/\/studio\.cylonai\.cn/);
  assert.match(loginSource, /创意工坊/);
  assert.doesNotMatch(loginSource, /登录并进入工作台/);
});

test("user registration performs a full navigation to the real creative studio", () => {
  assert.match(registerSource, /window\.location\.assign\(STUDIO_URL\)/);
  assert.doesNotMatch(registerSource, /router\.push\("\/studio"\)/);
  assert.match(registerSource, /https:\/\/studio\.cylonai\.cn/);
  assert.match(registerSource, /创意工坊/);
  assert.doesNotMatch(registerSource, /注册并进入工作台/);
});
