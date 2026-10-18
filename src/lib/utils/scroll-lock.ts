export interface ScrollLockDocument {
  documentElement: {
    style: {
      overflow: string;
    };
  };
  body: {
    style: {
      overflow: string;
    };
  };
}

export interface ScrollLockManager {
  acquire: () => () => void;
}

export function createScrollLockManager(
  doc: ScrollLockDocument
): ScrollLockManager {
  let lockCount = 0;
  let previousHtmlOverflow = "";
  let previousBodyOverflow = "";

  const acquire = () => {
    if (lockCount === 0) {
      previousHtmlOverflow = doc.documentElement.style.overflow;
      previousBodyOverflow = doc.body.style.overflow;
      doc.documentElement.style.overflow = "hidden";
      doc.body.style.overflow = "hidden";
      if (
        "classList" in doc.documentElement &&
        typeof (doc.documentElement as unknown as HTMLElement).classList?.add === "function"
      ) {
        (doc.documentElement as unknown as HTMLElement).classList.add("scroll-locked");
      }
    }

    lockCount += 1;
    let isReleased = false;

    return () => {
      if (isReleased) return;
      isReleased = true;
      lockCount = Math.max(0, lockCount - 1);

      if (lockCount === 0) {
        doc.documentElement.style.overflow = previousHtmlOverflow;
        doc.body.style.overflow = previousBodyOverflow;
        if (
          "classList" in doc.documentElement &&
          typeof (doc.documentElement as unknown as HTMLElement).classList?.remove === "function"
        ) {
          (doc.documentElement as unknown as HTMLElement).classList.remove("scroll-locked");
        }
      }
    };
  };

  return { acquire };
}

let manager: ScrollLockManager | null = null;

function getManager(): ScrollLockManager | null {
  if (typeof document === "undefined") return null;
  if (!manager) {
    manager = createScrollLockManager(document);
  }
  return manager;
}

export function acquireScrollLock(): () => void {
  return getManager()?.acquire() ?? (() => {});
}
