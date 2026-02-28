/**
 * Tiktik - Animations Module
 * GSAP-powered animations with CSS fallback.
 */

/** Reference to GSAP, if available */
let gsapLib: any = null;

/**
 * Try to detect and cache GSAP from the global scope or module import.
 */
function detectGSAP(): any {
  if (gsapLib) return gsapLib;
  if (typeof window !== 'undefined' && (window as any).gsap) {
    gsapLib = (window as any).gsap;
    return gsapLib;
  }
  try {
    // Dynamic require for Node/bundler environments
    gsapLib = require('gsap');
    return gsapLib;
  } catch {
    return null;
  }
}

/**
 * Check if GSAP is available.
 */
export function hasGSAP(): boolean {
  return !!detectGSAP();
}

/**
 * Animate a toast entering the screen.
 * GSAP: elastic scale + fade + dynamic width morph.
 * CSS fallback: applies animation class.
 */
export function animateIn(el: HTMLElement, speed: number = 1): Promise<void> {
  const gsap = detectGSAP();

  if (gsap) {
    return new Promise((resolve) => {
      // Start from pill-collapsed state (scale only — no width animation to avoid text reflow)
      gsap.set(el, {
        opacity: 0,
        scale: 0.3,
        y: -20,
      });

      gsap.to(el, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6 / speed,
        ease: 'elastic.out(1, 0.5)',
        onComplete: resolve,
      });
    });
  }

  // CSS fallback
  return new Promise((resolve) => {
    el.classList.add('tiktik-animate-in');
    const handleEnd = () => {
      el.removeEventListener('animationend', handleEnd);
      resolve();
    };
    el.addEventListener('animationend', handleEnd);
    // Safety timeout
    setTimeout(resolve, 600 / speed);
  });
}

/**
 * Animate a toast leaving the screen.
 * GSAP: scale-down + fade + slide.
 * CSS fallback: applies animation class.
 */
export function animateOut(el: HTMLElement, speed: number = 1): Promise<void> {
  const gsap = detectGSAP();

  if (gsap) {
    return new Promise((resolve) => {
      gsap.to(el, {
        opacity: 0,
        scale: 0.5,
        y: -10,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.35 / speed,
        ease: 'power2.in',
        onComplete: () => {
          el.remove();
          resolve();
        },
      });
    });
  }

  // CSS fallback
  return new Promise((resolve) => {
    el.classList.add('tiktik-animate-out');
    const handleEnd = () => {
      el.removeEventListener('animationend', handleEnd);
      el.remove();
      resolve();
    };
    el.addEventListener('animationend', handleEnd);
    // Safety timeout
    setTimeout(() => {
      el.remove();
      resolve();
    }, 400 / speed);
  });
}

/**
 * Animate the progress bar from 100% to 0% width.
 */
export function animateProgress(
  bar: HTMLElement,
  duration: number,
  speed: number = 1
): { pause: () => void; resume: () => void; kill: () => void } {
  const gsap = detectGSAP();
  const actualDuration = duration / 1000 / speed;

  if (gsap) {
    const tween = gsap.fromTo(
      bar,
      { width: '100%' },
      { width: '0%', duration: actualDuration, ease: 'none' }
    );
    return {
      pause: () => tween.pause(),
      resume: () => tween.resume(),
      kill: () => tween.kill(),
    };
  }

  // CSS fallback: use CSS animation
  bar.style.width = '100%';
  bar.style.transition = `width ${actualDuration}s linear`;
  // Force reflow
  bar.getBoundingClientRect();
  bar.style.width = '0%';

  return {
    pause: () => {
      const computed = getComputedStyle(bar).width;
      bar.style.transition = 'none';
      bar.style.width = computed;
    },
    resume: () => {
      bar.style.transition = `width ${actualDuration}s linear`;
      bar.style.width = '0%';
    },
    kill: () => {
      bar.style.transition = 'none';
    },
  };
}

/**
 * Animate stacking reflow when toasts are added/removed.
 */
export function animateReflow(container: HTMLElement): void {
  const gsap = detectGSAP();
  if (!gsap) return; // CSS handles this via transitions on the container

  const children = Array.from(container.children) as HTMLElement[];
  children.forEach((child, i) => {
    gsap.to(child, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      delay: i * 0.03,
    });
  });
}

/**
 * Morph toast width for content changes (e.g., promise state update).
 */
export function animateContentChange(el: HTMLElement, speed: number = 1): void {
  const gsap = detectGSAP();
  if (!gsap) return;

  gsap.from(el, {
    scale: 0.95,
    duration: 0.3 / speed,
    ease: 'back.out(1.7)',
  });
}
