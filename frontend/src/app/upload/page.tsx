"use client";

import { Header } from "@/components/layout/header";
import { UploadZone } from "@/components/upload/upload-zone";

export default function UploadPage() {
  return (
    <>
      <Header title="Upload" showViewToggle={false} showSort={false} />
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <UploadZone />
      </div>
    </>
  );
}
