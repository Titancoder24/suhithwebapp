import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, X, Loader2, FileText } from "lucide-react";
import api from "@/lib/api";
import AuthedImage from "./AuthedImage";

/**
 * Authed file uploader. Uploads to /api/files/upload and returns the new file id
 * via onChange(fileId).
 *
 * Props:
 *   value      — current file id (empty string if none)
 *   onChange   — (fileId) => void; called after successful upload or clear
 *   purpose    — one of "profile" | "kyc" | "certificate" | "invoice" | "misc"
 *   label      — displayed label
 *   accept     — accept attribute (default images + pdf)
 *   testId     — root data-testid
 *   preview    — "image" | "file" (default "image")
 */
export default function FileUpload({
  value = "",
  onChange,
  purpose = "misc",
  label = "Upload file",
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  testId = "file-upload",
  preview = "image",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const pick = () => inputRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File too large (max 5 MB).");
    }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", purpose);
    setUploading(true);
    try {
      const { data } = await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange?.(data.id);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = () => onChange?.("");

  return (
    <div data-testid={testId} className="space-y-2">
      <div className="text-xs text-muted2">{label}</div>
      {value ? (
        <div className="flex items-start gap-3">
          {preview === "image" ? (
            <AuthedImage
              fileId={value}
              alt="Uploaded file"
              className="w-24 h-24 object-cover rounded-lg border border-warmBorder"
              fallback={
                <div className="w-24 h-24 rounded-lg border border-warmBorder flex items-center justify-center bg-warmBorder/20">
                  <FileText className="w-8 h-8 text-muted2" />
                </div>
              }
            />
          ) : (
            <div className="w-24 h-24 rounded-lg border border-warmBorder flex items-center justify-center bg-warmBorder/20">
              <FileText className="w-8 h-8 text-muted2" />
            </div>
          )}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Uploaded
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={pick}
                data-testid={`${testId}-replace`}
                className="text-xs px-3 py-1.5 rounded-full border border-warmBorder hover:bg-warmBorder/30 transition"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={clear}
                data-testid={`${testId}-clear`}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-700 hover:bg-red-50 transition inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={pick}
          disabled={uploading}
          data-testid={`${testId}-picker`}
          className="w-full h-24 rounded-lg border-2 border-dashed border-warmBorder hover:border-saffron hover:bg-saffron/5 transition flex flex-col items-center justify-center text-muted2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-saffron" />
              <span className="mt-1 text-xs">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5" />
              <span className="mt-1 text-xs">Click to upload · JPG · PNG · PDF · 5 MB max</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        data-testid={`${testId}-input`}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
