/**
 * Tiktik - Animations Module
 * GSAP-powered animations with CSS fallback.
 * Includes reduced-motion detection for WCAG compliance.
 */

/** Reference to GSAP, if available */
let gsapLib: any = null;

/** Cached reduced-motion preference */
let reducedMotionQuery: MediaQueryList | null = null;

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
 * Check if the user prefers reduced motion (WCAG).
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (!reducedMotionQuery) {
    reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }
  return reducedMotionQuery.matches;
}

/**
 * Animate a toast entering the screen.
 * Respects prefers-reduced-motion: uses simple opacity fade if active.
 * GSAP: elastic scale + fade.
 * CSS fallback: applies animation class.
 */
export function animateIn(el: HTMLElement, speed: number = 1): Promise<void> {
  // Reduced motion: instant show with simple fade
  if (prefersReducedMotion()) {
    return new Promise((resolve) => {
      el.style.opacity = '0';
      el.getBoundingClientRect(); // Force reflow
      el.style.transition = 'opacity 0.15s ease';
      el.style.opacity = '1';
      setTimeout(resolve, 150);
    });
  }

  const gsap = detectGSAP();

  if (gsap) {
    return new Promise((resolve) => {
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
    setTimeout(resolve, 600 / speed);
  });
}

/**
 * Animate a toast leaving the screen.
 * Respects prefers-reduced-motion.
 */
export function animateOut(el: HTMLElement, speed: number = 1): Promise<void> {
  if (prefersReducedMotion()) {
    return new Promise((resolve) => {
      el.style.transition = 'opacity 0.15s ease';
      el.style.opacity = '0';
      setTimeout(() => {
        el.remove();
        resolve();
      }, 150);
    });
  }

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

  if (gsap && !prefersReducedMotion()) {
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

  // CSS fallback
  bar.style.width = '100%';
  bar.style.transition = `width ${actualDuration}s linear`;
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
 * Apply Sonner-style deck layout to stacked toasts.
 * Newest toast is fully visible; older ones shrink and peek behind it.
 * On hover, expands to full vertical list.
 */
export function applyDeckLayout(
  container: HTMLElement,
  isExpanded: boolean
): void {
  const children = Array.from(container.children) as HTMLElement[];
  const count = children.length;
  if (count === 0) return;

  const gsap = detectGSAP();
  const useGsap = gsap && !prefersReducedMotion();

  // The "front" toast is the last child (newest) in top containers,
  // or the first child in bottom containers (due to column-reverse).
  const isBottom = container.className.includes('bottom');

  children.forEach((child, i) => {
    // Determine distance from the "front" (newest) toast
    const distFromFront = isBottom ? i : (count - 1 - i);

    if (isExpanded || count <= 1) {
      // Expanded: normal vertical layout
      const props = { transform: 'scale(1) translateY(0)', opacity: '1', zIndex: '' };
      if (useGsap) {
        gsap.to(child, { scale: 1, y: 0, opacity: 1, zIndex: count - distFromFront, duration: 0.3, ease: 'power2.out' });
      } else {
        Object.assign(child.style, props);
      }
    } else {
      // Deck: scale down and offset older toasts
      const scale = Math.max(1 - distFromFront * 0.05, 0.85);
      const yOffset = distFromFront * -8; // Peek above/below
      const opacity = Math.max(1 - distFromFront * 0.15, 0.4);
      const zIndex = count - distFromFront;

      if (useGsap) {
        gsap.to(child, {
          scale,
          y: yOffset,
          opacity: distFromFront === 0 ? 1 : opacity,
          zIndex,
          duration: 0.35,
          ease: 'power2.out',
        });
      } else {
        child.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
        child.style.opacity = distFromFront === 0 ? '1' : String(opacity);
        child.style.zIndex = String(zIndex);
      }
    }
  });
}

/**
 * Legacy reflow for vertical stacking mode.
 */
export function animateReflow(container: HTMLElement): void {
  const gsap = detectGSAP();
  if (!gsap || prefersReducedMotion()) return;

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
 * Morph toast for content changes (e.g., promise state update).
 */
export function animateContentChange(el: HTMLElement, speed: number = 1): void {
  if (prefersReducedMotion()) return;
  const gsap = detectGSAP();
  if (!gsap) return;

  gsap.from(el, {
    scale: 0.95,
    duration: 0.3 / speed,
    ease: 'back.out(1.7)',
  });
}
