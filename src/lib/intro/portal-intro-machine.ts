export type PortalIntroState = "PLAYING" | "COMPLETE";

export const PORTAL_INTRO_TIMELINE = {
  COMPLETE_AT_MS: 1800,
  REDUCED_MOTION_COMPLETE_AT_MS: 1200,
  WATCHDOG_TIMEOUT_MS: 2400,
} as const;

export interface PortalIntroControllerOptions {
  prefersReducedMotion?: boolean;
  onStateChange: (state: PortalIntroState) => void;
  setTimer?: (callback: () => void, ms: number) => ReturnType<typeof setTimeout>;
  clearTimer?: (id: ReturnType<typeof setTimeout>) => void;
}

export interface PortalIntroController {
  getState: () => PortalIntroState;
  start: () => PortalIntroState;
  complete: () => void;
  dispose: () => void;
}

/**
 * Keeps the visual overlay bounded without depending on storage. A full page
 * load creates a new controller, while the root layout preserves it across
 * client-side navigation.
 */
export function createPortalIntroController(
  options: PortalIntroControllerOptions
): PortalIntroController {
  const schedule = options.setTimer ?? ((cb, ms) => setTimeout(cb, ms));
  const cancel = options.clearTimer ?? ((id) => clearTimeout(id));

  let currentState: PortalIntroState = "PLAYING";
  let isFinished = false;
  let hasStarted = false;
  const timerIds: Array<ReturnType<typeof setTimeout>> = [];

  const clearAllTimers = () => {
    while (timerIds.length > 0) {
      const id = timerIds.pop();
      if (id !== undefined) cancel(id);
    }
  };

  const transitionTo = (nextState: PortalIntroState) => {
    if (isFinished) return;
    currentState = nextState;
    if (nextState === "COMPLETE") {
      isFinished = true;
      clearAllTimers();
    }
    options.onStateChange(nextState);
  };

  const complete = () => {
    if (isFinished) return;
    transitionTo("COMPLETE");
  };

  const start = (): PortalIntroState => {
    if (isFinished || hasStarted) return currentState;
    hasStarted = true;

    if (options.prefersReducedMotion) {
      options.onStateChange("PLAYING");
      timerIds.push(
        schedule(() => {
          complete();
        }, PORTAL_INTRO_TIMELINE.REDUCED_MOTION_COMPLETE_AT_MS)
      );
      timerIds.push(
        schedule(() => {
          complete();
        }, PORTAL_INTRO_TIMELINE.WATCHDOG_TIMEOUT_MS)
      );
      return currentState;
    }

    options.onStateChange("PLAYING");
    timerIds.push(
      schedule(() => {
        complete();
      }, PORTAL_INTRO_TIMELINE.COMPLETE_AT_MS)
    );
    timerIds.push(
      schedule(() => {
        complete();
      }, PORTAL_INTRO_TIMELINE.WATCHDOG_TIMEOUT_MS)
    );

    return currentState;
  };

  const dispose = () => {
    clearAllTimers();
  };

  return {
    getState: () => currentState,
    start,
    complete,
    dispose,
  };
}
