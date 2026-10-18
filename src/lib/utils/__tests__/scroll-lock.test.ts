import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createScrollLockManager,
  type ScrollLockDocument,
} from "../scroll-lock.ts";

function createDocument(
  htmlOverflow = "",
  bodyOverflow = ""
): ScrollLockDocument {
  return {
    documentElement: { style: { overflow: htmlOverflow } },
    body: { style: { overflow: bodyOverflow } },
  };
}

describe("createScrollLockManager", () => {
  it("locks the document and restores the original overflow values", () => {
    const doc = createDocument("auto", "scroll");
    const manager = createScrollLockManager(doc);

    const release = manager.acquire();
    assert.equal(doc.documentElement.style.overflow, "hidden");
    assert.equal(doc.body.style.overflow, "hidden");

    release();
    assert.equal(doc.documentElement.style.overflow, "auto");
    assert.equal(doc.body.style.overflow, "scroll");
  });

  it("keeps the page locked until every nested lock is released", () => {
    const doc = createDocument();
    const manager = createScrollLockManager(doc);

    const releaseIntro = manager.acquire();
    const releaseDrawer = manager.acquire();

    releaseIntro();
    assert.equal(doc.documentElement.style.overflow, "hidden");
    assert.equal(doc.body.style.overflow, "hidden");

    releaseDrawer();
    assert.equal(doc.documentElement.style.overflow, "");
    assert.equal(doc.body.style.overflow, "");
  });

  it("does not decrement the lock twice when a release is repeated", () => {
    const doc = createDocument("clip", "visible");
    const manager = createScrollLockManager(doc);

    const releaseIntro = manager.acquire();
    const releaseDrawer = manager.acquire();

    releaseIntro();
    releaseIntro();
    assert.equal(doc.documentElement.style.overflow, "hidden");

    releaseDrawer();
    assert.equal(doc.documentElement.style.overflow, "clip");
    assert.equal(doc.body.style.overflow, "visible");
  });

  it("captures the current values again for a later lock", () => {
    const doc = createDocument();
    const manager = createScrollLockManager(doc);

    manager.acquire()();
    doc.documentElement.style.overflow = "auto";
    doc.body.style.overflow = "scroll";

    const release = manager.acquire();
    assert.equal(doc.documentElement.style.overflow, "hidden");
    assert.equal(doc.body.style.overflow, "hidden");

    release();
    assert.equal(doc.documentElement.style.overflow, "auto");
    assert.equal(doc.body.style.overflow, "scroll");
  });

});
