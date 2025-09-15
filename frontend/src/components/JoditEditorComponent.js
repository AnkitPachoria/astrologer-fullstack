"use client";

import { useRef, useMemo } from "react";
import { Toaster, toast } from "react-hot-toast";

// ✅ Dynamically import JoditEditor on client only
let JoditEditor = null;
if (typeof window !== "undefined") {
  JoditEditor = require("jodit-react").default;
}

export default function JoditEditorComponent({ value, onChange }) {
  const editor = useRef(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    minHeight: 300,
    toolbar: true,
    spellcheck: true,
    language: "en",
    theme: "default",
    buttons: [
      "source", "|", "bold", "italic", "underline", "strikethrough", "|",
      "ul", "ol", "|", "outdent", "indent", "|",
      "font", "fontsize", "brush", "paragraph", "|",
      "image", "table", "link", "|",
      "align", "undo", "redo", "|",
      "hr", "eraser", "copyformat", "|",
      "symbol", "fullsize", "print"
    ],
    buttonsXS: [
      "bold", "italic", "underline", "|",
      "ul", "ol", "|",
      "image", "link", "|",
      "align", "undo", "redo"
    ],
    style: {
      color: "black",
      backgroundColor: "white",
      fontSize: "16px",
    },
    uploader: {
      url: `${API_URL}/api/upload`,
      format: "json",
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      prepareData: (formData) => {
        const file = formData.get("files[0]");
        if (file) {
          if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            throw new Error("Invalid file type");
          }
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size exceeds 5MB limit.");
            throw new Error("File too large");
          }
        } else {
          toast.error("No file selected for upload.");
          throw new Error("No file selected");
        }
        return formData;
      },
      process: (response) => {
        if (!response || !response.file) {
          toast.error("Upload failed: Invalid server response.");
          throw new Error("Invalid response format");
        }
        return {
          files: [response.file],
          path: response.file,
          baseurl: API_URL,
          error: response.error || null,
          message: response.message || "",
        };
      },
      defaultHandlerSuccess: (data, file) => {
        if (data.files && data.files.length) {
          data.files.forEach((filePath) => {
            const img = `<img src="${API_URL}${filePath}" alt="Uploaded Image" style="max-width: 100%; height: auto; border: 2px solid black; border-radius: 6px;" />`;
            editor.current?.selection?.insertHTML?.(img);
            toast.success("Image uploaded successfully.");
          });
        } else if (file && file instanceof File) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = `<img src="${e.target.result}" alt="Local Image" style="max-width: 100%; height: auto; border: 2px solid black; border-radius: 6px;" />`;
            editor.current?.selection?.insertHTML?.(img);
            toast.warning("Image inserted as base64 due to upload failure.");
          };
          reader.readAsDataURL(file);
        }
      },
      error: (e) => {
        toast.error(`Failed to upload image: ${e.message || "Server error"}`);
      },
    },
    enableDragAndDropFileToEditor: true,
    events: {
      afterDrop: (event) => {
        const files = event.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (!file.type.startsWith("image/")) {
            toast.error("Only image files can be dropped.");
            return false;
          }
          if (file.size > 5 * 1024 * 1024) {
            toast.error("Dropped image exceeds 5MB limit.");
            return false;
          }
          return true;
        }
        return false;
      },
    },
    image: {
      openOnDblClick: true,
      editProperties: true,
      showPreview: true,
      defaultWidth: "auto",
      defaultHeight: "auto",
    },
    placeholder: "Start typing your content here...",
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
    saveHeightInStorage: true,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    defaultActionOnPaste: "insert_clear_html",
    tabIndex: 0,
  }), [API_URL]);

  // ✅ Conditional check — agar JoditEditor load nahi hua toh loading dikhayein
  if (!JoditEditor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="jodit-container">
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onChange={onChange}
        className="mt-1"
      />
      <style jsx>{`
        .jodit-container :global(.jodit-wysiwyg) {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.75rem;
          min-height: 300px;
          color: black;
          background-color: white;
        }
        .jodit-container :global(.jodit-wysiwyg img) {
          border: 2px solid black;
          border-radius: 6px;
          max-width: 100%;
          height: auto;
        }
        .jodit-container :global(.jodit-toolbar__box) {
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        .jodit-container :global(.jodit-status-bar) {
          border-top: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        @media (max-width: 640px) {
          .jodit-container :global(.jodit-wysiwyg) {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
