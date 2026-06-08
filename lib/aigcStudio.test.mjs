import assert from "node:assert/strict";
import { test } from "node:test";

const { AIGC_STUDIO_SECTIONS, canCreateWithSession, getStudioSection } = await import("./aigcStudio.ts");

test("defines the three visible AIGC creation sections with readable Chinese labels", () => {
  assert.deepEqual(AIGC_STUDIO_SECTIONS.map((section) => section.key), ["image", "video", "copy"]);
  assert.deepEqual(AIGC_STUDIO_SECTIONS.map((section) => section.title), ["视觉工坊", "影像实验室", "文案策划台"]);
  assert.equal(getStudioSection("video").endpoint, "/api/aigc/video");
  assert.equal(getStudioSection("image").previewImage, "/brand/generated/studio-visual-workshop.png");
  assert.equal(getStudioSection("copy").scenes[0], "官网介绍");
});

test("allows browsing without login but blocks creation", () => {
  assert.equal(canCreateWithSession(null), false);
  assert.equal(canCreateWithSession({ id: "user-1" }), true);
});

test("falls back to visual workshop for unknown section keys", () => {
  assert.equal(getStudioSection("unknown").key, "image");
});
