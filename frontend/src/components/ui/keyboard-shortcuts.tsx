"use client";

import { useState, useEffect } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["⌘", "K"], description: "Open search" },
  { keys: ["⌘", "U"], description: "Upload photos" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["G", "H"], description: "Go to home" },
  { keys: ["G", "A"], description: "Go to albums" },
  { keys: ["G", "P"], description: "Go to people" },
  { keys: ["G", "M"], description: "Go to map" },
  { keys: ["G", "S"], description: "Go to settings" },
  { keys: ["←", "→"], description: "Navigate photos (in viewer)" },
  { keys: ["Esc"], description: "Close viewer / dialog" },
  { keys: ["F"], description: "Toggle favorite (in viewer)" },
  { keys: ["I"], description: "Toggle info panel (in viewer)" },
  { keys: ["+", "−"], description: "Zoom in / out (in viewer)" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]" onClick={() => setOpen(false)}>
      <div
        className="bg-[var(--card-solid)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-lg mx-4 animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--hover)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            {SHORTCUTS.map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-sm text-[var(--foreground)]">{shortcut.description}</span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, j) => (
                    <span key={j}>
                      <kbd className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 bg-[var(--muted)] border border-[var(--border)] rounded-md text-xs font-mono text-[var(--foreground)] shadow-sm">
                        {key}
                      </kbd>
                      {j < shortcut.keys.length - 1 && (
                        <span className="text-[var(--muted-foreground)] text-xs mx-0.5">+</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Press <kbd className="px-1.5 py-0.5 bg-[var(--muted)] rounded text-[10px] font-mono">?</kbd> to toggle this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
