/**
 * @tiktik/react — TiktikToast (Declarative Component)
 *
 * An optional declarative alternative to the imperative hook.
 * Renders nothing visible — it triggers a toast when `visible` is true
 * and dismisses it when `visible` is false.
 *
 * Usage:
 *   const [show, setShow] = useState(false);
 *
 *   <TiktikToast
 *     visible={show}
 *     type="success"
 *     message="Operation complete!"
 *     duration={3000}
 *     onDismiss={() => setShow(false)}
 *   />
 */

import { useEffect, useRef } from 'react';
import type { ToastOptions, ToastType, ToastPosition } from 'tiktik';
import { useTiktik } from './useTiktik';

/** Props for the declarative TiktikToast component */
export interface TiktikToastProps {
  /** Whether the toast should be shown */
  visible: boolean;
  /** Toast message text */
  message: string;
  /** Toast type */
  type?: ToastType;
  /** Duration in ms (0 = persistent) */
  duration?: number;
  /** Position on screen */
  position?: ToastPosition;
  /** Show progress bar */
  progress?: boolean;
  /** Extra options passed through to showToast */
  options?: Partial<ToastOptions>;
  /** Callback when the toast is dismissed (auto or manual) */
  onDismiss?: () => void;
}

/**
 * Declarative toast component — shows/hides a toast based on `visible` prop.
 * Renders null (no DOM output). All rendering is handled by Tiktik core.
 */
export function TiktikToast({
  visible,
  message,
  type = 'default',
  duration,
  position,
  progress,
  options,
  onDismiss,
}: TiktikToastProps) {
  const { showToast, dismiss } = useTiktik();
  const toastIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (visible && !toastIdRef.current) {
      // Show the toast
      const id = showToast({
        message,
        type,
        duration,
        position,
        progress,
        ...options,
      });
      toastIdRef.current = id;

      // If there's a duration, set up auto-dismiss callback
      if (duration && duration > 0 && onDismiss) {
        const timer = setTimeout(() => {
          toastIdRef.current = null;
          onDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else if (!visible && toastIdRef.current) {
      // Dismiss the toast
      dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, [visible, message, type, duration, position, progress, options, showToast, dismiss, onDismiss]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, [dismiss]);

  // This component renders nothing — Tiktik manages the DOM
  return null;
}
