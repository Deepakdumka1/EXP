"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { CloudUpload, File, X, Check, Loader2, AlertCircle, ImageIcon, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useToast } from "@/components/ui/toast";
import { api } from "@/lib/api";

interface UploadFile {
  id: string;
  name: string;
  size: string;
  status: "pending" | "uploading" | "complete" | "error";
  progress: number;
  originalFile: File;
}

export function UploadZone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const simulateUpload = useCallback(async (file: UploadFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, status: "uploading" } : f))
    );
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id && f.status === "uploading" ? { ...f, progress: Math.min(progress, 90) } : f
        )
      );
    }, 500);

    try {
      await api.uploads.single(file.originalFile);
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "complete", progress: 100 } : f
        )
      );
      addToast("success", `${file.name} uploaded successfully`);
    } catch (error) {
      clearInterval(interval);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "error", progress: 0 } : f
        )
      );
      addToast("error", `Failed to upload ${file.name}`);
    }
  }, [addToast]);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const newFiles: UploadFile[] = Array.from(fileList).map((f) => ({
        id: Math.random().toString(36).slice(2),
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
        status: "pending" as const,
        progress: 0,
        originalFile: f,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      newFiles.forEach((f) => setTimeout(() => simulateUpload(f), 300));
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const statusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "pending": return <Loader2 className="w-4 h-4 text-[var(--muted-foreground)] animate-spin" />;
      case "uploading": return <Loader2 className="w-4 h-4 text-[var(--accent)] animate-spin" />;
      case "complete": return <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500" /></div>;
      case "error": return <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"><AlertCircle className="w-3 h-3 text-red-500" /></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center min-h-[360px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden",
          isDragActive
            ? "border-[var(--accent)] bg-[var(--accent)]/5"
            : "border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--hover)]"
        )}
      >
        <div className={cn(
          "w-20 h-20 rounded-xl flex items-center justify-center mb-6 transition-all duration-200",
          isDragActive
            ? "bg-[var(--accent)]/10"
            : "bg-[var(--muted)] border border-[var(--border)]"
        )}>
          <CloudUpload
            className={cn(
              "w-10 h-10 transition-colors duration-200",
              isDragActive ? "text-[var(--accent)]" : "text-[var(--muted-foreground)]"
            )}
          />
        </div>
        <h3 className="text-lg font-bold mb-1">Drop your files here</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">or click to browse from your device</p>
        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          Select Files
        </Button>
        <div className="flex items-center gap-4 mt-6 text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <ImageIcon className="w-3.5 h-3.5" />
            JPG, PNG, HEIC
          </div>
          <div className="w-px h-3 bg-[var(--border)]" />
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <Film className="w-3.5 h-3.5" />
            MP4, MOV
          </div>
          <div className="w-px h-3 bg-[var(--border)]" />
          <span className="text-xs font-medium">Max 50MB</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="border border-[var(--border)] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold">Uploading {files.length} files</h4>
              <p className="text-xs text-[var(--muted-foreground)]">{files.filter(f => f.status === 'complete').length} of {files.length} complete</p>
            </div>
            <button
              onClick={() => setFiles([])}
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-[var(--hover)] transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
                <div className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <File className="w-5 h-5 text-[var(--muted-foreground)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{file.size}</p>
                  {file.status === "uploading" && (
                    <ProgressBar value={file.progress} className="mt-1.5" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {statusIcon(file.status)}
                  {file.status !== "uploading" && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 rounded-md hover:bg-[var(--hover)] cursor-pointer text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
