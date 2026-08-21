import { useEffect, useState } from "react";
import { fetchAuthedBlobUrl } from "@/lib/api";
import { ImageOff } from "lucide-react";

/**
 * Displays a private file (image or PDF) fetched through the authed /files/{id}
 * endpoint using blob URLs (img tags cannot send Authorization headers).
 *
 * Props:
 *   fileId  — the file record id
 *   alt     — accessible label
 *   className — img className
 *   fallback — optional React node to show if fileId is empty / errors
 *   asLink  — if true, renders as an <a> that opens the blob in a new tab
 */
export default function AuthedImage({ fileId, alt = "", className = "", fallback = null, asLink = false }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    if (!fileId) {
      setStatus("idle");
      setUrl("");
      return;
    }
    let cancelled = false;
    let objectUrl = "";
    (async () => {
      setStatus("loading");
      try {
        objectUrl = await fetchAuthedBlobUrl(fileId);
        if (!cancelled) {
          setUrl(objectUrl);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  if (!fileId) return fallback;
  if (status === "idle" || status === "loading" || (status === "ready" && !url)) {
    return (
      <div
        data-testid="authed-image-loading"
        className={`bg-warmBorder/30 animate-pulse rounded ${className}`}
      />
    );
  }
  if (status === "error") {
    return (
      fallback || (
        <div
          data-testid="authed-image-error"
          className={`flex items-center justify-center bg-warmBorder/20 text-muted2 rounded ${className}`}
        >
          <ImageOff className="w-6 h-6" />
        </div>
      )
    );
  }
  if (asLink) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={className}
        data-testid={`authed-file-link-${fileId}`}
      >
        {alt || "View document"}
      </a>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      data-testid={`authed-image-${fileId}`}
    />
  );
}
