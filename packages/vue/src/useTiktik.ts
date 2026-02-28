/**
 * @tiktik/vue — useTiktik Composable
 *
 * The primary way to access Tiktik's toast API from any Vue 3 component.
 * Must be used inside a component tree where TiktikPlugin has been installed.
 *
 * Usage:
 *   <script setup>
 *   import { useTiktik } from '@tiktik/vue';
 *   const { success, promise } = useTiktik();
 *   success('Saved!');
 *   </script>
 */

import { inject } from 'vue';
import { TiktikKey, type TiktikAPI } from './plugin';

/**
 * Composable to access all Tiktik toast methods.
 *
 * @throws Error if TiktikPlugin was not installed.
 * @returns The full TiktikAPI with all toast methods.
 */
export function useTiktik(): TiktikAPI {
  const tiktik = inject(TiktikKey);

  if (!tiktik) {
    throw new Error(
      'useTiktik() requires TiktikPlugin to be installed. ' +
      'Call app.use(TiktikPlugin) in your Vue app setup.'
    );
  }

  return tiktik;
}
