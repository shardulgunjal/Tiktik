/// <reference types="vite/client" />

declare module 'tiktiktoast' {
  export interface ToastOptions {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
    position: 'top' | 'bottom';
    icon: string | SVGElement | undefined;
    progress: boolean;
    id: string | undefined;
    onClick: (() => void) | undefined;
    onDismiss: (() => void) | undefined;
  }

  export interface TiktikConfig {
    type: 'success' | 'error' | 'info' | 'warning';
    duration: number;
    position: 'top' | 'bottom';
    progress: boolean;
    renderer: ((toast: any) => HTMLElement) | undefined;
    audio: boolean;
  }

  export interface PromiseToastOptions<T> {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
    duration?: number;
    position?: 'top' | 'bottom';
    id?: string;
  }

  export type ToastType = 'success' | 'error' | 'info' | 'warning';

  export const Tiktik: {
    showToast(options: Partial<ToastOptions> & { message: string }): string;
    success(message: string, options?: Partial<ToastOptions>): string;
    error(message: string, options?: Partial<ToastOptions>): string;
    info(message: string, options?: Partial<ToastOptions>): string;
    warning(message: string, options?: Partial<ToastOptions>): string;
    promise<T>(promise: Promise<T>, options: PromiseToastOptions<T>): string;
    dismiss(id?: string): void;
    configure(defaults: Partial<TiktikConfig>): void;
    onStackChange(listener: (visible: number, queued: number) => void): void;
  };
}
