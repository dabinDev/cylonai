import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const headerSource = await readFile(new URL("../components/Header.tsx", import.meta.url), "utf8");
const studioSource = await readFile(new URL("../components/aigc/AigcStudioClient.tsx", import.meta.url), "utf8");
const studioPageSource = await readFile(new URL("../app/studio/page.tsx", import.meta.url), "utf8");

test("public header accepts shared user state and exposes the workbench entry when logged in", () => {
  assert.match(headerSource, /user\?:\s*HeaderUser/);
  assert.match(headerSource, /\/studio/);
  assert.match(headerSource, /user\.name \|\| user\.email/);
  assert.match(headerSource, /api\/user\/auth\/logout/);
});

test("studio uses the same public header instead of a separate three-link header", () => {
  assert.match(studioPageSource, /<Header user=\{user\}/);
  assert.doesNotMatch(studioSource, /const serviceEntrances/);
  assert.doesNotMatch(studioSource, /<header className=/);
});
