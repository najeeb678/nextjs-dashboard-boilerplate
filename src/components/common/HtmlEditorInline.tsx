"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  Loader2,
  List,
  ListOrdered,
  Pencil,
  Redo,
  Smile,
  Trash2,
  Type,
  Underline,
  Undo,
} from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
// import apiClient from "@/lib/api/api-client";

interface HtmlEditorInlineProps {
  value: string;

  onChange(value: string): void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export const HtmlEditorInline: React.FC<HtmlEditorInlineProps> = ({
  value,
  onChange,
  placeholder = "Write your email content in HTML here...",
  minHeight = "420px",
  label,
  required,
  error,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageMenuRef = useRef<HTMLDivElement>(null);
  const textColorMenuRef = useRef<HTMLDivElement>(null);
  const bgColorMenuRef = useRef<HTMLDivElement>(null);
  const lastEmittedHtmlRef = useRef<string>("");
  const savedRangeRef = useRef<Range | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageWidth, setSelectedImageWidth] = useState<number>(200);
  const [imageMenuPos, setImageMenuPos] = useState({ top: 0, left: 0 });
  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showBgColorMenu, setShowBgColorMenu] = useState(false);
  const [uploadMode, setUploadMode] = useState<"insert" | "replace">("insert");
  const [currentFontSize, setCurrentFontSize] = useState("3");
  const [currentFontFamily, setCurrentFontFamily] = useState("Arial");
  const [currentTextColor, setCurrentTextColor] = useState("#000000");

  const fontFamilies = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Poppins",
    "Montserrat",
    "Nunito",
    "Raleway",
    "Ubuntu",
    "Arial",
    "Helvetica",
    "Verdana",
    "Tahoma",
    "Trebuchet MS",
    "Times New Roman",
    "Georgia",
    "Merriweather",
    "Playfair Display",
    "Courier New",
    "Fira Code",
    "Source Code Pro",
    "JetBrains Mono",
    "Impact",
    "Comic Sans MS",
    "Pacifico",
    "Lobster",
  ];

  const fontSizes = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
  ];

  const textColorOptions = [
    "#000000",
    "#444444",
    "#6b7280",
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#16a34a",
    "#06b6d4",
    "#2563eb",
    "#7c3aed",
    "#ec4899",
    "#ffffff",
  ];

  const bgColorOptions = [
    "#ffffff",
    "#fef3c7",
    "#fde68a",
    "#fed7aa",
    "#fecaca",
    "#d9f99d",
    "#bbf7d0",
    "#bfdbfe",
    "#ddd6fe",
    "#fbcfe8",
    "#e5e7eb",
    "#000000",
  ];

  const svgToDataUri = (svgString: string): string => {
    try {
      // Clean the SVG string
      const cleanedSvg = svgString.trim();
      // Encode SVG as data URI
      const encoded = encodeURIComponent(cleanedSvg);
      return `data:image/svg+xml;utf8,${encoded}`;
    } catch {
      return "";
    }
  };

  const normalizeHtmlForEditor = (incomingHtml: string) => {
    if (!incomingHtml) return "";

    let processedHtml = incomingHtml;

    // Convert inline SVG elements to data URI images (contentEditable doesn't render SVGs reliably)
    if (processedHtml.includes("<svg")) {
      processedHtml = processedHtml.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, (svgMatch) => {
        const dataUri = svgToDataUri(svgMatch);
        if (dataUri) {
          // Convert SVG to img tag with data URI
          return `<img src="${dataUri}" style="display:inline-block;vertical-align:middle;max-width:100%;height:auto;" alt="svg" />`;
        }
        return svgMatch;
      });
    }

    const hasDocumentTags = /<!doctype|<html|<head|<body|<style/i.test(processedHtml);
    if (!hasDocumentTags) return processedHtml;

    try {
      const parser = new DOMParser();
      const parsed = parser.parseFromString(processedHtml, "text/html");

      const styles = Array.from(parsed.querySelectorAll("style"))
        .map((styleTag) => {
          const originalCss = styleTag.innerHTML;

          // Scope styles to the editor to prevent global UI leakage
          const scopedCss = originalCss.replace(/([^\r\n,{}]+)(?=[^{}]*\{)/g, (match) => {
            const selectors = match.split(",").map((s) => {
              const trimmed = s.trim();
              if (!trimmed) return "";

              // Use an ID-based selector if possible, or a very specific class
              const containerSelector = ".html-editor-content";

              // Handle special selectors that should be mapped to the container
              if (
                trimmed.toLowerCase() === "body" ||
                trimmed.toLowerCase() === "html" ||
                trimmed.toLowerCase() === ":root" ||
                trimmed.toLowerCase() === "*"
              ) {
                return containerSelector;
              }

              // Prepend container selector to all other selectors
              return `${containerSelector} ${trimmed}`;
            });
            return selectors.join(", ");
          });

          return `<style data-scoped="true">${scopedCss}</style>`;
        })
        .join("\n");

      // Remove the original style tags so they don't leak before they are replaced
      parsed.querySelectorAll("style").forEach((s) => s.remove());

      const bodyHtml = parsed.body?.innerHTML || "";
      return `${styles}${bodyHtml}`;
    } catch (err) {
      console.error("Error in normalizeHtmlForEditor:", err);
      return processedHtml;
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const normalizedValue = normalizeHtmlForEditor(value);

    if (
      normalizedValue !== lastEmittedHtmlRef.current &&
      normalizedValue !== editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = normalizedValue;
      lastEmittedHtmlRef.current = normalizedValue;
    }
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedEditor = editorRef.current?.contains(target);
      const clickedMenu = imageMenuRef.current?.contains(target);
      const clickedTextColorMenu = textColorMenuRef.current?.contains(target);
      const clickedBgColorMenu = bgColorMenuRef.current?.contains(target);

      if (!clickedEditor && !clickedMenu) {
        setSelectedImage(null);
      }

      if (!clickedTextColorMenu) {
        setShowTextColorMenu(false);
      }

      if (!clickedBgColorMenu) {
        setShowBgColorMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (!selection || !savedRangeRef.current) return;

    selection.removeAllRanges();
    selection.addRange(savedRangeRef.current);
  };

  const emitChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastEmittedHtmlRef.current = html;
    onChange(html);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const exec = (command: string, commandValue?: string) => {
    focusEditor();
    if (savedRangeRef.current) {
      restoreSelection();
    }
    document.execCommand(command, false, commandValue ?? "");
    saveSelection();
    emitChange();
  };

  const insertEmoji = (emojiData: EmojiClickData) => {
    exec("insertText", emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleLink = () => {
    const inputUrl = window.prompt("Enter link URL", "https://");
    if (!inputUrl) return;
    exec("createLink", inputUrl);
  };

  const applyTextColor = (color: string) => {
    setCurrentTextColor(color);
    exec("foreColor", color);
  };

  const applyBackgroundColor = (color: string) => {
    exec("hiliteColor", color);
  };

  const applyCustomStyle = (style: Partial<CSSStyleDeclaration>) => {
    focusEditor();
    restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      // If collapsed, we'd normally want to set the style for the next typed character
      // but execCommand styleWithCSS is better for that.
      return;
    }

    // For better "Google Docs" like behavior, we use execCommand to apply a marker
    // and then we clean it up. This handles complex nested selections better than manual DOM manipulation.
    document.execCommand("styleWithCSS", false, "true");

    // We use a temporary high-contrast style that's unlikely to be used otherwise
    const dummyColor = "#000001";
    document.execCommand("foreColor", false, dummyColor);

    const editor = editorRef.current;
    if (!editor) return;

    // Find all spans that were just created/modified with the dummy color
    const spans = editor.querySelectorAll(
      `span[style*="color: rgb(0, 0, 1)"], span[style*="color: #000001"]`,
    );

    spans.forEach((span) => {
      const el = span as HTMLElement;
      // Remove our marker color
      el.style.color = "";
      if (el.getAttribute("style") === "") el.removeAttribute("style");

      // Apply our desired styles
      Object.entries(style).forEach(([key, val]) => {
        if (val) {
          el.style.setProperty(
            key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
            String(val),
          );
        }
      });
    });

    saveSelection();
    emitChange();
  };

  const applyFontSize = (size: string) => {
    setCurrentFontSize(size);
    applyCustomStyle({ fontSize: size });
  };

  const applyFontFamily = (family: string) => {
    setCurrentFontFamily(family);
    applyCustomStyle({ fontFamily: family });
  };

  const toBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
    reader.readAsDataURL(file);
    return base64Promise;
  };

  const insertImageAtSelection = (url: string) => {
    focusEditor();
    restoreSelection();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      exec("insertImage", url);
      return;
    }

    const range = selection.getRangeAt(0);
    const img = document.createElement("img");
    img.src = url;
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.display = "inline-block";

    range.insertNode(img);
    range.setStartAfter(img);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    saveSelection();
    emitChange();
  };

  const deleteSelectedImage = () => {
    if (!selectedImage) return;
    selectedImage.remove();
    setSelectedImage(null);
    emitChange();
  };

  const alignSelectedImage = (alignment: "left" | "center" | "right") => {
    if (!selectedImage) return;

    selectedImage.style.display = "block";
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";

    if (alignment === "left") {
      selectedImage.style.marginLeft = "0";
      selectedImage.style.marginRight = "auto";
      return emitChange();
    }

    if (alignment === "center") {
      selectedImage.style.marginLeft = "auto";
      selectedImage.style.marginRight = "auto";
      return emitChange();
    }

    selectedImage.style.marginLeft = "auto";
    selectedImage.style.marginRight = "0";
    emitChange();
  };

  const resizeSelectedImage = (nextWidth: number) => {
    if (!selectedImage) return;
    const safeWidth = Math.max(24, Math.min(1200, nextWidth));
    setSelectedImageWidth(safeWidth);
    selectedImage.style.width = `${safeWidth}px`;
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";
    emitChange();
  };

  const resetSelectedImageSize = () => {
    if (!selectedImage) return;
    selectedImage.style.removeProperty("width");
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";
    const widthFromDom = Math.round(selectedImage.getBoundingClientRect().width) || 200;
    setSelectedImageWidth(widthFromDom);
    emitChange();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    //TODO: uncomment and implement image upload when API is ready
    // try {
    //   setIsUploadingImage(true);
    //   const base64String = await toBase64(file);
    //   const uploadRes = await apiClient.post("/image-upload/public", {
    //     image: base64String,
    //     folderPrefix: "selling-requests-jewellery",
    //   });

    //   const imageUrl = uploadRes?.data?.publicUrl as string | undefined;

    //   if (!imageUrl) {
    //     throw new Error("Image upload failed");
    //   }

    //   if (uploadMode === "replace" && selectedImage) {
    //     selectedImage.src = imageUrl;
    //     setSelectedImage(null);
    //     emitChange();
    //   } else {
    //     insertImageAtSelection(imageUrl);
    //   }
    // } catch (uploadError) {
    //   console.error("Image upload failed:", uploadError);
    // } finally {
    //   setIsUploadingImage(false);
    //   event.target.value = "";
    //   setUploadMode("insert");
    // }
  };

  const handleEditorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "IMG") {
      const imageEl = target as HTMLImageElement;
      const imageRect = imageEl.getBoundingClientRect();
      const containerRect = editorRef.current?.getBoundingClientRect();
      const containerHeight = editorRef.current?.clientHeight || 0;
      const widthFromStyle = parseInt(imageEl.style.width || "", 10);
      const widthFromDom = Math.round(imageRect.width);
      const rawTop = imageRect.top - (containerRect?.top || 0) + imageRect.height + 8;
      const popupHeight = 220;
      const clampedTop = Math.max(8, Math.min(rawTop, Math.max(8, containerHeight - popupHeight)));

      setSelectedImage(imageEl);
      setSelectedImageWidth(Number.isFinite(widthFromStyle) ? widthFromStyle : widthFromDom || 200);
      setImageMenuPos({
        top: clampedTop,
        left: imageRect.left - (containerRect?.left || 0),
      });
      return;
    }

    setSelectedImage(null);
    saveSelection();
  };

  const isEditorEmpty = !value || value === "<br>" || value === "<div><br></div>" || value === "<p></p>";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[16px] font-semibold text-[#171717]">
          {label} {required && <span className="text-[#E33535]">*</span>}
        </label>
      )}

      <div
        className={`rounded-[10px] border ${error ? "border-red-500" : "border-[#E2D7CC80]"} bg-white overflow-hidden transition-all focus-within:border-(--color-gold-accent) shadow-sm relative`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <div className="flex flex-wrap items-center gap-1 border-b border-[#E2D7CC80] bg-gray-50 px-2 py-2 sticky top-0 z-10">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("bold");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("italic");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("underline");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

          <select
            value={currentFontSize}
            onChange={(e) => {
              applyFontSize(e.target.value);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-20 px-1 py-1 border border-gray-200 rounded text-xs bg-white hover:border-[#2787F5] focus:outline-none transition-colors cursor-pointer"
            title="Font Size"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            value={currentFontFamily}
            onChange={(e) => {
              applyFontFamily(e.target.value);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-32 px-1 py-1 border border-gray-200 rounded text-xs bg-white hover:border-[#2787F5] focus:outline-none transition-colors cursor-pointer"
            title="Font Family"
          >
            {fontFamilies.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </select>

          <div className="relative" ref={textColorMenuRef}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowBgColorMenu(false);
                setShowTextColorMenu((prev) => !prev);
              }}
              className="flex items-center gap-1 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
              title="Text Color"
            >
              <Type className="h-4 w-4" />
              <span className="h-0.5 w-4 rounded" style={{ backgroundColor: currentTextColor }} />
              <ChevronDown className="h-3 w-3" />
            </button>
            {showTextColorMenu && (
              <div className="absolute top-11 left-0 z-50 w-52 rounded-md border border-[#E2D7CC80] bg-white p-2 shadow-lg">
                <p className="mb-2 text-[11px] font-semibold text-gray-500">Text color</p>
                <input
                  type="color"
                  value={currentTextColor}
                  className="mb-2 h-8 w-full cursor-pointer rounded border border-gray-300 bg-white"
                  onChange={(event) => {
                    applyTextColor(event.target.value);
                  }}
                />
                <div className="grid grid-cols-6 gap-2">
                  {textColorOptions.map((color) => (
                    <button
                      key={`text-${color}`}
                      type="button"
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        applyTextColor(color);
                        setShowTextColorMenu(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={bgColorMenuRef}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowTextColorMenu(false);
                setShowBgColorMenu((prev) => !prev);
              }}
              className="flex items-center gap-1 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
              title="Text Background Color"
            >
              <Highlighter className="h-4 w-4" />
              <span className="h-0.5 w-4 rounded bg-[#fef3c7]" />
              <ChevronDown className="h-3 w-3" />
            </button>
            {showBgColorMenu && (
              <div className="absolute top-11 left-0 z-50 w-52 rounded-md border border-[#E2D7CC80] bg-white p-2 shadow-lg">
                <p className="mb-2 text-[11px] font-semibold text-gray-500">Background color</p>
                <input
                  type="color"
                  className="mb-2 h-8 w-full cursor-pointer rounded border border-gray-300 bg-white"
                  onChange={(event) => {
                    applyBackgroundColor(event.target.value);
                  }}
                />
                <div className="grid grid-cols-6 gap-2">
                  {bgColorOptions.map((color) => (
                    <button
                      key={`bg-${color}`}
                      type="button"
                      className="h-5 w-5 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        applyBackgroundColor(color);
                        setShowBgColorMenu(false);
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("justifyLeft");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("justifyCenter");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("justifyRight");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertUnorderedList");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Bulleted List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("insertOrderedList");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleLink();
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setUploadMode("insert");
              fileInputRef.current?.click();
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Insert Image"
            disabled={isUploadingImage}
          >
            <ImagePlus className="h-4 w-4" />
          </button>
          {isUploadingImage && (
            <div className="flex items-center gap-1 px-1 text-xs text-gray-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Uploading...
            </div>
          )}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowEmojiPicker((prev) => !prev);
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Insert Emoji"
          >
            <Smile className="h-4 w-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("undo");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              exec("redo");
            }}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute top-12 right-4 z-50 shadow-2xl">
            <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
            <div className="relative">
              <EmojiPicker onEmojiClick={insertEmoji} />
            </div>
          </div>
        )}

        <div className="relative">
          {selectedImage && (
            <div
              ref={imageMenuRef}
              className="absolute z-[120] min-w-[280px] bg-white border border-[#E2D7CC80] p-2 shadow-lg rounded-md"
              style={{ top: imageMenuPos.top, left: imageMenuPos.left }}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadMode("replace");
                    fileInputRef.current?.click();
                  }}
                  className="p-1.5 hover:bg-green-50 text-green-600 rounded flex items-center gap-1 text-[11px] font-bold"
                >
                  <Pencil className="w-3.5 h-3.5" /> REPLACE
                </button>
                <div className="w-px h-4 bg-gray-200 self-center" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSelectedImage();
                  }}
                  className="p-1.5 hover:bg-red-50 text-red-600 rounded flex items-center gap-1 text-[11px] font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" /> DELETE
                </button>
              </div>

              <div className="mt-2 border-t border-gray-200 pt-2">
                <p className="mb-1 text-[11px] font-semibold text-gray-500">Align</p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="px-2 py-1 text-[11px] rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      alignSelectedImage("left");
                    }}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-[11px] rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      alignSelectedImage("center");
                    }}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-[11px] rounded border border-gray-300 hover:bg-gray-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      alignSelectedImage("right");
                    }}
                  >
                    Right
                  </button>
                </div>
              </div>

              <div className="mt-2 border-t border-gray-200 pt-2">
                <p className="mb-1 text-[11px] font-semibold text-gray-500">Width</p>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={24}
                    max={800}
                    value={selectedImageWidth}
                    onChange={(e) => resizeSelectedImage(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <input
                    type="number"
                    min={24}
                    max={1200}
                    value={selectedImageWidth}
                    onChange={(e) => resizeSelectedImage(parseInt(e.target.value || "0", 10))}
                    className="w-16 rounded border border-gray-300 px-1 py-0.5 text-[11px]"
                  />
                  <span className="text-[11px] text-gray-500">px</span>
                </div>
                <button
                  type="button"
                  className="mt-1 text-[11px] text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetSelectedImageSize();
                  }}
                >
                  Reset size
                </button>
              </div>
            </div>
          )}

          {isEditorEmpty && (
            <div className="pointer-events-none absolute left-4 top-3 text-sm text-gray-400">
              {placeholder}
            </div>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="html-editor-content px-4 py-3 text-[15px] text-(--color-heading) focus:outline-none overflow-visible [&_img]:inline-block [&_img]:align-middle [&_img]:max-w-full [&_img]:h-auto [&_img]:max-h-[600px]"
            style={{ minHeight, paddingBottom: selectedImage ? "230px" : undefined }}
            onInput={emitChange}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            onBlur={saveSelection}
            onFocus={saveSelection}
            onClick={handleEditorClick}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .html-editor-content {
              line-height: 1.6;
            }
            .html-editor-content section,
            .html-editor-content main,
            .html-editor-content .relative {
              position: relative !important;
              display: block !important;
              width: 100% !important;
              overflow: hidden !important;
            }
            .html-editor-content [style*="position:absolute"],
            .html-editor-content [style*="position: absolute"] {
              pointer-events: none;
              max-width: 100% !important;
            }
            .html-editor-content ul {
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin: 0.5rem 0 !important;
              display: block !important;
            }
            .html-editor-content ol {
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin: 0.5rem 0 !important;
              display: block !important;
            }
            .html-editor-content li {
              display: list-item !important;
              margin-bottom: 0.25rem !important;
              list-style: inherit !important;
            }
            .html-editor-content p {
              margin-bottom: 0.5rem;
            }
          `,
            }}
          />
        </div>

        {isUploadingImage && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/75 text-white text-xs px-2 py-1">
            Uploading image...
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
