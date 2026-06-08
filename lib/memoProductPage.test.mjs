import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const pageSource = await readFile(new URL("../app/products/memo/page.tsx", import.meta.url), "utf8");

test("memo product page uses enterprise product visuals instead of cropped mobile screenshots", () => {
  assert.match(pageSource, /memo-workbench-hero-v2\.png/);
  assert.match(pageSource, /memo-workflow-board-v2\.png/);
  assert.match(pageSource, /赛隆视创/);
  assert.match(pageSource, /内容生产/);
  assert.doesNotMatch(pageSource, /screenshot-create\.png/);
  assert.doesNotMatch(pageSource, /screenshot-history\.png/);
});
