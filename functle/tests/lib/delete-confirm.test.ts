import { isDeleteConfirmed } from "@/lib/delete-confirm";

describe("isDeleteConfirmed", () => {
  test("accepts the exact username", () => {
    expect(isDeleteConfirmed("test_user1", "test_user1")).toBe(true);
  });

  test("ignores spaces around it", () => {
    expect(isDeleteConfirmed("  test_user1 ", "test_user1")).toBe(true);
  });

  test.each(["", "test_user", "TEST_USER1", "test_user12", "delete"])(
    "rejects %p for test_user1",
    (typed) => {
      expect(isDeleteConfirmed(typed, "test_user1")).toBe(false);
    },
  );

  test("falls back to the word delete when there's no username", () => {
    expect(isDeleteConfirmed("delete", null)).toBe(true);
    expect(isDeleteConfirmed("DELETE", null)).toBe(true);
    expect(isDeleteConfirmed("nope", null)).toBe(false);
  });
});
