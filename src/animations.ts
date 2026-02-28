/**
 * Tiktik - Animations Module
 * Pure CSS + WAAPI animations (Zero GSAP dependency).
 * Includes reduced-motion detection for WCAG compliance.
 */

/** Cached reduced-motion preference */
let reducedMotionQuery: MediaQueryList | null = null;

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
 * Animate a toast entering the screen using CSS animation.
 * Respects prefers-reduced-motion: uses simple opacity fade if active.
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

  // Pure CSS animation
  return new Promise((resolve) => {
    el.classList.add('tiktik-animate-in');
    
    // speed multiplier for animation-duration
    if (speed !== 1) {
      el.style.animationDuration = `${0.5 / speed}s`;
    }

    const handleEnd = () => {
      el.removeEventListener('animationend', handleEnd);
      if (speed !== 1) el.style.animationDuration = '';
      el.classList.remove('tiktik-animate-in'); // Ensure forwards animation releases control
      resolve();
    };
    el.addEventListener('animationend', handleEnd);
    
    // Fallback timer if event fails to fire
    setTimeout(() => {
      el.removeEventListener('animationend', handleEnd);
      if (speed !== 1) el.style.animationDuration = '';
      el.classList.remove('tiktik-animate-in');
      resolve();
    }, (550 / speed) + 50);
  });
}

/**
 * Animate a toast leaving the screen using CSS animation.
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

  // Pure CSS animation
  return new Promise((resolve) => {
    el.classList.add('tiktik-animate-out');
    
    if (speed !== 1) {
      el.style.animationDuration = `${0.35 / speed}s`;
    }

    const handleEnd = () => {
      el.removeEventListener('animationend', handleEnd);
      el.remove();
      resolve();
    };
    el.addEventListener('animationend', handleEnd);
    
    setTimeout(() => {
      el.removeEventListener('animationend', handleEnd);
      el.remove();
      resolve();
    }, (400 / speed) + 50);
  });
}

/**
 * Animate the progress bar from 100% to 0% width.
 * Uses WAAPI (Web Animations API) to allow pausing/resuming.
 */
export function animateProgress(
  bar: HTMLElement,
  duration: number,
  speed: number = 1
): { pause: () => void; resume: () => void; kill: () => void } {
  const actualDuration = duration / speed;

  // Use WAAPI if available
  if (typeof bar.animate === 'function' && !prefersReducedMotion()) {
    const animation = bar.animate(
      [{ width: '100%' }, { width: '0%' }],
      { duration: actualDuration, easing: 'linear', fill: 'forwards' }
    );
    return {
      pause: () => animation.pause(),
      resume: () => animation.play(),
      kill: () => animation.cancel(),
    };
  }

  // Fallback (older browsers or reduced motion)
  bar.style.width = '100%';
  bar.style.transition = `width ${actualDuration / 1000}s linear`;
  bar.getBoundingClientRect(); // force reflow
  bar.style.width = '0%';

  return {
    pause: () => {
      const computed = getComputedStyle(bar).width;
      bar.style.transition = 'none';
      bar.style.width = computed;
    },
    resume: () => {
      bar.style.transition = `width ${actualDuration / 1000}s linear`;
      bar.style.width = '0%';
    },
    kill: () => {
      bar.style.transition = 'none';
    },
  };
}

/**
 * Apply Sonner-style deck layout to stacked toasts using pure CSS transitions.
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

  const preferNoMotion = prefersReducedMotion();
  const isBottom = container.className.includes('bottom');
  const transition = preferNoMotion 
    ? 'none' 
    : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.2s ease, translate 0.2s ease';

  children.forEach((child, i) => {
    // Determine distance from the "front" (newest) toast
    const distFromFront = isBottom ? i : (count - 1 - i);

    child.style.transition = transition;

    if (isExpanded || count <= 1) {
      // Expanded: normal vertical layout
      child.style.setProperty('--tiktik-deck-scale', '1');
      child.style.setProperty('--tiktik-deck-y', '0px');
      child.style.opacity = '1';
      child.style.zIndex = '';
    } else {
      // Deck: scale down and offset older toasts
      const scale = Math.max(1 - distFromFront * 0.05, 0.85);
      const yOffset = distFromFront * -8; // Peek above/below
      const opacity = Math.max(1 - distFromFront * 0.15, 0.4);
      const zIndex = count - distFromFront;

      child.style.setProperty('--tiktik-deck-scale', String(scale));
      child.style.setProperty('--tiktik-deck-y', `${yOffset}px`);
      child.style.opacity = distFromFront === 0 ? '1' : String(opacity);
      child.style.zIndex = String(zIndex);
    }
  });
}

/**
 * Legacy reflow for vertical stacking mode using WAAPI.
 */
export function animateReflow(container: HTMLElement): void {
  if (prefersReducedMotion() || typeof Element.prototype.animate !== 'function') return;

  const children = Array.from(container.children) as HTMLElement[];
  children.forEach((child, i) => {
    child.animate(
      [
        { transform: 'translateY(-10px)' },
        { transform: 'translateY(0)' }
      ],
      { duration: 300, delay: i * 30, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    );
  });
}

/**
 * Morph toast for content changes (e.g., promise state update).
 */
export function animateContentChange(el: HTMLElement, speed: number = 1): void {
  if (prefersReducedMotion() || typeof el.animate !== 'function') return;
  
  el.animate(
    [
      { transform: 'scale(0.95)' },
      { transform: 'scale(1)' }
    ],
    { duration: 300 / speed, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
  );
}
