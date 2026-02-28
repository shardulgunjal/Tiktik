/**
 * @tiktik/vue — TiktikPlugin
 *
 * Vue 3 plugin that initializes Tiktik configuration and injects
 * the toast API into the app's provide/inject system.
 *
 * Usage:
 *   import { createApp } from 'vue';
 *   import { TiktikPlugin } from '@tiktik/vue';
 *
 *   const app = createApp(App);
 *   app.use(TiktikPlugin, { theme: 'dark', stackStyle: 'deck' });
 */

import type { App, InjectionKey } from 'vue';
import Tiktik from 'tiktik';
import type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
} from 'tiktik';

/** Shape of the injected Tiktik API */
export interface TiktikAPI {
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  loading: (message: string, options?: Partial<ToastOptions>) => string;
  showToast: (options: ToastOptions) => string;
  promise: <T>(
    promiseValue: Promise<T>,
    options: PromiseOptions<T>,
    toastOptions?: Partial<ToastOptions>
  ) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  configure: (options: Partial<TiktikConfig>) => void;
  resetConfig: () => void;
}

/** Injection key for type-safe provide/inject */
export const TiktikKey: InjectionKey<TiktikAPI> = Symbol('tiktik');

/** The frozen API object (created once, shared across the app) */
const tiktikAPI: TiktikAPI = {
  success: Tiktik.success,
  error: Tiktik.error,
  info: Tiktik.info,
  warning: Tiktik.warning,
  loading: Tiktik.loading,
  showToast: Tiktik.showToast,
  promise: Tiktik.promise,
  dismiss: Tiktik.dismiss,
  dismissAll: Tiktik.dismissAll,
  configure: Tiktik.configure,
  resetConfig: Tiktik.resetConfig,
};

/**
 * Vue 3 plugin — call `app.use(TiktikPlugin, config?)` to initialize.
 */
export const TiktikPlugin = {
  install(app: App, config?: Partial<TiktikConfig>): void {
    // Apply initial config
    if (config) {
      Tiktik.configure(config);
    }

    // Provide the API via injection key (for useTiktik composable)
    app.provide(TiktikKey, tiktikAPI);

    // Also add as a global property for Options API access: this.$tiktik
    app.config.globalProperties.$tiktik = tiktikAPI;
  },
};
