import assert from "node:assert/strict";
import { test } from "node:test";

const { normalizeUserPayload } = await import("./adminUsers.ts");
const { getUserWhereFromSearch } = await import("./adminUsers.ts");

test("normalizes valid user input for creation", () => {
  const result = normalizeUserPayload({
    email: "  Cage_Ben@Sina.com ",
    name: " Ben ",
    password: "535926cb",
    role: "operator",
    status: "active",
    quota: "200",
    usedQuota: "5",
    permissions: ["aigc.image", "content.article"],
    menuAccess: ["studio", "articles"],
  }, { requirePassword: true });

  assert.equal(result.ok, true);
  assert.equal(result.data.email, "cage_ben@sina.com");
  assert.equal(result.data.name, "Ben");
  assert.equal(result.data.password, "535926cb");
  assert.equal(result.data.role, "operator");
  assert.equal(result.data.status, "active");
  assert.equal(result.data.quota, 200);
  assert.equal(result.data.usedQuota, 5);
  assert.deepEqual(result.data.permissions, ["aigc.image", "content.article"]);
  assert.deepEqual(result.data.menuAccess, ["studio", "articles"]);
});

test("rejects invalid email, short password, invalid status, and impossible quota", () => {
  const result = normalizeUserPayload({
    email: "bad",
    password: "123",
    status: "deleted",
    quota: 3,
    usedQuota: 10,
  }, { requirePassword: true });

  assert.equal(result.ok, false);
  assert.deepEqual(result.errors, [
    "请输入有效邮箱",
    "密码至少 6 位",
    "状态不合法",
    "已用额度不能大于总额度",
  ]);
});

test("does not apply role or status filters when query params are empty", () => {
  assert.deepEqual(getUserWhereFromSearch(new URLSearchParams()), {});
  assert.deepEqual(getUserWhereFromSearch(new URLSearchParams("role=operator&status=disabled")), {
    role: "operator",
    status: "disabled",
  });
});
