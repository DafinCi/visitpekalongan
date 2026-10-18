import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createPortalIntroController,
  PORTAL_INTRO_TIMELINE,
  type PortalIntroState,
} from "../portal-intro-machine.ts";
import { BRAND_LOGO_GEOMETRY } from "../../../components/brand/logo-geometry.ts";

function createFakeScheduler() {
  let now = 0;
  let nextId = 1;
  const tasks = new Map<number, { runAt: number; callback: () => void }>();

  const setTimer = (callback: () => void, ms: number) => {
    const id = nextId++;
    tasks.set(id, { runAt: now + ms, callback });
    return id as unknown as ReturnType<typeof setTimeout>;
  };

  const clearTimer = (id: ReturnType<typeof setTimeout>) => {
    tasks.delete(id as unknown as number);
  };

  const advanceTo = (targetMs: number) => {
    while (true) {
      let earliestId: number | null = null;
      let earliestTask: { runAt: number; callback: () => void } | null = null;

      for (const [id, task] of tasks.entries()) {
        if (task.runAt <= targetMs) {
          if (!earliestTask || task.runAt < earliestTask.runAt) {
            earliestId = id;
            earliestTask = task;
          }
        }
      }

      if (!earliestTask || earliestId === null) break;

      tasks.delete(earliestId);
      now = earliestTask.runAt;
      earliestTask.callback();
    }
    now = targetMs;
  };

  return {
    setTimer,
    clearTimer,
    advanceTo,
    getPendingCount: () => tasks.size,
  };
}

describe("PortalIntroOverlay lifecycle", () => {
  it("1. plays on a new document load and completes on the visual timeline", () => {
    const scheduler = createFakeScheduler();
    const transitions: PortalIntroState[] = [];

    const controller = createPortalIntroController({
      setTimer: scheduler.setTimer,
      clearTimer: scheduler.clearTimer,
      onStateChange: (state) => transitions.push(state),
    });

    assert.equal(controller.getState(), "PLAYING");
    assert.equal(controller.start(), "PLAYING");
    assert.deepEqual(transitions, ["PLAYING"]);

    scheduler.advanceTo(PORTAL_INTRO_TIMELINE.COMPLETE_AT_MS);

    assert.equal(controller.getState(), "COMPLETE");
    assert.deepEqual(transitions, ["PLAYING", "COMPLETE"]);
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("2. plays again on every new mount, matching a full page refresh", () => {
    const firstTransitions: PortalIntroState[] = [];
    const secondTransitions: PortalIntroState[] = [];

    const first = createPortalIntroController({
      onStateChange: (state) => firstTransitions.push(state),
    });
    first.start();
    first.complete();
    first.dispose();

    const second = createPortalIntroController({
      onStateChange: (state) => secondTransitions.push(state),
    });

    assert.equal(second.start(), "PLAYING");
    assert.deepEqual(secondTransitions, ["PLAYING"]);

    second.dispose();
  });

  it("3. shows a static intro when reduced motion is enabled", () => {
    const scheduler = createFakeScheduler();
    const transitions: PortalIntroState[] = [];

    const controller = createPortalIntroController({
      prefersReducedMotion: true,
      setTimer: scheduler.setTimer,
      clearTimer: scheduler.clearTimer,
      onStateChange: (state) => transitions.push(state),
    });

    assert.equal(controller.start(), "PLAYING");
    assert.deepEqual(transitions, ["PLAYING"]);
    assert.equal(scheduler.getPendingCount(), 2);

    scheduler.advanceTo(PORTAL_INTRO_TIMELINE.REDUCED_MOTION_COMPLETE_AT_MS);

    assert.equal(controller.getState(), "COMPLETE");
    assert.deepEqual(transitions, ["PLAYING", "COMPLETE"]);
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("4. releases the overlay even if the normal timer never fires", () => {
    const scheduler = createFakeScheduler();
    let scheduled = 0;
    const transitions: PortalIntroState[] = [];

    const controller = createPortalIntroController({
      setTimer: (callback, ms) => {
        scheduled += 1;
        if (scheduled === 1) {
          return 999 as unknown as ReturnType<typeof setTimeout>;
        }
        return scheduler.setTimer(callback, ms);
      },
      clearTimer: scheduler.clearTimer,
      onStateChange: (state) => transitions.push(state),
    });

    controller.start();
    scheduler.advanceTo(PORTAL_INTRO_TIMELINE.WATCHDOG_TIMEOUT_MS);

    assert.equal(controller.getState(), "COMPLETE");
    assert.equal(transitions[transitions.length - 1], "COMPLETE");
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("5. makes completion idempotent and clears remaining timers", () => {
    const scheduler = createFakeScheduler();
    const transitions: PortalIntroState[] = [];

    const controller = createPortalIntroController({
      setTimer: scheduler.setTimer,
      clearTimer: scheduler.clearTimer,
      onStateChange: (state) => transitions.push(state),
    });

    controller.start();
    controller.complete();
    controller.complete();
    controller.complete();
    scheduler.advanceTo(PORTAL_INTRO_TIMELINE.WATCHDOG_TIMEOUT_MS + 100);

    assert.equal(
      transitions.filter((state) => state === "COMPLETE").length,
      1
    );
    assert.equal(controller.getState(), "COMPLETE");
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("6. does not schedule duplicate timers when start is called twice", () => {
    const scheduler = createFakeScheduler();

    const controller = createPortalIntroController({
      setTimer: scheduler.setTimer,
      clearTimer: scheduler.clearTimer,
      onStateChange: () => {},
    });

    controller.start();
    controller.start();

    assert.equal(scheduler.getPendingCount(), 2);
    controller.dispose();
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("7. clears timers on dispose", () => {
    const scheduler = createFakeScheduler();
    const transitions: PortalIntroState[] = [];

    const controller = createPortalIntroController({
      setTimer: scheduler.setTimer,
      clearTimer: scheduler.clearTimer,
      onStateChange: (state) => transitions.push(state),
    });

    controller.start();
    controller.dispose();
    scheduler.advanceTo(PORTAL_INTRO_TIMELINE.WATCHDOG_TIMEOUT_MS + 100);

    assert.equal(controller.getState(), "PLAYING");
    assert.deepEqual(transitions, ["PLAYING"]);
    assert.equal(scheduler.getPendingCount(), 0);
  });

  it("8. preserves the canonical logo geometry and separate portal cutout", () => {
    assert.equal(BRAND_LOGO_GEOMETRY.viewBox, "0 0 48 48");
    assert.equal(
      BRAND_LOGO_GEOMETRY.diamond.points,
      "24,20.5 28,25 24,29.5 20,25"
    );
    assert.equal(BRAND_LOGO_GEOMETRY.outerArch.strokeWidth, 2.3);
    assert.equal(BRAND_LOGO_GEOMETRY.middleArch.strokeWidth, 2.2);
    assert.equal(BRAND_LOGO_GEOMETRY.innerArch.strokeWidth, 2.2);
    assert.notEqual(
      BRAND_LOGO_GEOMETRY.portalCutoutPath,
      BRAND_LOGO_GEOMETRY.innerArch.d
    );
  });
});
