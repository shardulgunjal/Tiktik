import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl border border-border bg-surface-raised overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-overlay/50">
          <span className="text-xs font-mono text-text-muted">{title}</span>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed text-text-secondary">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                     bg-surface-overlay border border-border text-text-muted
                     hover:text-text-primary hover:border-border-hover
                     opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
