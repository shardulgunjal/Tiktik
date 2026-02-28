/**
 * @tiktik/svelte — toast Action
 *
 * A Svelte `use:` action that triggers a toast when the element is
 * clicked. Provides a declarative way to show notifications.
 *
 * Usage:
 *   <script>
 *     import { toast } from '@tiktik/svelte';
 *   </script>
 *
 *   <button use:toast={{ message: 'Saved!', type: 'success' }}>
 *     Save
 *   </button>
 *
 *   <!-- Or with just a message string -->
 *   <button use:toast={'Changes saved!'}>
 *     Save
 *   </button>
 */

import Tiktik from 'tiktik';
import type { ToastOptions } from 'tiktik';

/** Action parameter: full options object or a simple message string */
export type ToastActionParam = Partial<ToastOptions> & { message: string } | string;

/**
 * Svelte action: shows a toast on click.
 *
 * @param node - The DOM element the action is attached to
 * @param params - Toast options or a message string
 */
export function toast(node: HTMLElement, params: ToastActionParam) {
  let currentParams = params;

  function handleClick() {
    if (typeof currentParams === 'string') {
      Tiktik.success(currentParams);
    } else {
      Tiktik.showToast(currentParams);
    }
  }

  node.addEventListener('click', handleClick);

  return {
    /** Update the action parameters when the Svelte prop changes */
    update(newParams: ToastActionParam) {
      currentParams = newParams;
    },

    /** Clean up when the element is removed from the DOM */
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}
