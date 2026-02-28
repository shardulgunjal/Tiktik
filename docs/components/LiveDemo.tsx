import { useEffect, useRef } from 'react';
import { Tiktik } from 'tiktiktoast';

export default function LiveDemo() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
    }
  }, []);

  return (
    <div className="rounded-xl border border-border bg-surface-raised p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wider">
        Interactive Demo
      </h3>

      {/* Toast Types */}
      <div className="mb-6">
        <p className="text-xs text-text-muted mb-3 font-medium">Toast Types</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => Tiktik.success('Changes saved successfully!')}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-success/30 text-success bg-success/5
                       hover:bg-success/10 hover:border-success/50 transition-all"
          >
            ✓ Success
          </button>
          <button
            onClick={() => Tiktik.error('Failed to save changes.')}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-error/30 text-error bg-error/5
                       hover:bg-error/10 hover:border-error/50 transition-all"
          >
            ✕ Error
          </button>
          <button
            onClick={() => Tiktik.warning('Your session will expire in 5 minutes.')}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-warning/30 text-warning bg-warning/5
                       hover:bg-warning/10 hover:border-warning/50 transition-all"
          >
            ⚠ Warning
          </button>
          <button
            onClick={() => Tiktik.info('New update available.')}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-info/30 text-info bg-info/5
                       hover:bg-info/10 hover:border-info/50 transition-all"
          >
            ℹ Info
          </button>
        </div>
      </div>

      {/* Promise API */}
      <div className="mb-6">
        <p className="text-xs text-text-muted mb-3 font-medium">Promise API</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const p = new Promise((resolve) => setTimeout(() => resolve({ name: 'Profile' }), 2000));
              Tiktik.promise(p, {
                loading: 'Saving profile...',
                success: (data: any) => `Saved! ${data.name}`,
                error: (err: any) => `Failed: ${err}`,
              });
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Promise (resolve 2s)
          </button>
          <button
            onClick={() => {
              const p = new Promise((_, reject) => setTimeout(() => reject(new Error('Network error')), 1500));
              Tiktik.promise(p, {
                loading: 'Uploading file...',
                success: () => 'Uploaded!',
                error: (err: any) => `Failed: ${err instanceof Error ? err.message : err}`,
              });
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Promise (reject 1.5s)
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="text-xs text-text-muted mb-3 font-medium">Features</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => Tiktik.success('Uploading... 5 seconds.', { progress: true, duration: 5000 })}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Progress Bar (5s)
          </button>
          <button
            onClick={() => {
              const types: Array<'success' | 'error' | 'info' | 'warning'> = ['success', 'error', 'info', 'warning', 'success'];
              types.forEach((type, i) => {
                setTimeout(() => Tiktik.showToast({ message: `Toast #${i + 1} (${type})`, type }), i * 100);
              });
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Stack 5 Toasts
          </button>
          <button
            onClick={() => Tiktik.success('Toast at the bottom!', { position: 'bottom' })}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Bottom Position
          </button>
          <button
            onClick={() => {
              Tiktik.showToast({ message: 'Update 1 of 3', type: 'info', id: 'dedup-demo' });
              setTimeout(() => Tiktik.showToast({ message: 'Update 2 of 3', type: 'warning', id: 'dedup-demo' }), 500);
              setTimeout(() => Tiktik.showToast({ message: 'Update 3 of 3 — Final!', type: 'success', id: 'dedup-demo' }), 1000);
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-border text-text-secondary bg-surface-overlay
                       hover:text-text-primary hover:border-border-hover transition-all"
          >
            Deduplication
          </button>
          <button
            onClick={() => Tiktik.dismiss()}
            className="px-4 py-2 rounded-lg text-sm font-medium border cursor-pointer
                       border-error/30 text-error/70 bg-error/5
                       hover:bg-error/10 hover:border-error/50 transition-all"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
}
