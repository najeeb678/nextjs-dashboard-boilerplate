"use client";

import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LexicalEditor } from "lexical";
import {
  $getRoot,
  EditorState,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  $getSelection as $getLexicalSelection,
  $isTextNode,
} from "lexical";
import { HeadingNode, QuoteNode, $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import {
  ListItemNode,
  ListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $isLinkNode, TOGGLE_LINK_COMMAND, LinkNode, AutoLinkNode } from "@lexical/link";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import {
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Link2,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Type,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

// Initial config for Lexical
const initialConfig = {
  namespace: "NGMEditor",
  theme: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
    heading: {
      h1: "text-3xl font-bold mb-4",
      h2: "text-2xl font-bold mb-3",
      h3: "text-xl font-bold mb-2",
    },
    list: {
      ul: "list-disc ml-5 mb-4",
      ol: "list-decimal ml-5 mb-4",
      listitem: "list-none",
    },
    link: "text-[#2563eb] !text-[#2563eb] underline !underline cursor-pointer transition-all decoration-[#2563eb] hover:bg-blue-50",
  },
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode, AutoLinkNode],
  onError: (error: Error) => {
    console.error(error);
  },
};

// Toolbar Component
const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Inter");

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Update Font Size and Family from selection
          const node = selection.anchor.getNode();
          const parent = node.getParent();

          // Get style from node or parent
          const fontSizeStyle = $isTextNode(node) ? node.getStyle() : "";
          const matchSize = fontSizeStyle.match(/font-size:\s*([^;]+)/);
          if (matchSize) setFontSize(matchSize[1]);

          const matchFamily = fontSizeStyle.match(/font-family:\s*([^;]+)/);
          if (matchFamily) setFontFamily(matchFamily[1].replace(/['"]/g, ""));

          if ($isLinkNode(parent)) {
            setIsLink(true);
            setLinkUrl(parent.getURL());
          } else if ($isLinkNode(node)) {
            setIsLink(true);
            setLinkUrl(node.getURL());
          } else {
            const nodes = selection.getNodes();
            const linkNode = nodes.find((n) => $isLinkNode(n) || $isLinkNode(n.getParent()));
            if (linkNode) {
              setIsLink(true);
              const url = $isLinkNode(linkNode)
                ? linkNode.getURL()
                : (linkNode.getParent() as LinkNode).getURL();
              setLinkUrl(url);
            } else {
              setIsLink(false);
              setLinkUrl("");
            }
          }
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  const applyFontSize = (size: string) => {
    setFontSize(size);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": size,
        });
      }
    });
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-family": family,
        });
      }
    });
  };

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      setShowLinkInput(true);
    }
  };

  const applyLink = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    }
    setShowLinkInput(false);
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(element) && element.getTag() === headingSize) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-[#E2D7CC80] bg-gray-50 px-2 py-2 sticky top-0 z-10">
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
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
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
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
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* Font Family Dropdown */}
      <div className="relative group">
        <button
          type="button"
          className="flex items-center gap-1 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657] text-sm font-medium h-9"
        >
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline w-20 text-left truncate">{fontFamily}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        {/* Invisible bridge to prevent closing on hover gap */}
        <div className="absolute top-8 left-0 w-full h-2 bg-transparent hidden group-hover:block" />

        <div className="absolute top-full left-0 mt-0 hidden group-hover:block bg-white border border-[#E2D7CC80] rounded-md shadow-lg z-30 min-w-[200px] py-1 max-h-72 overflow-y-auto">
          {[
            // Sans-serif (modern UI)
            "Inter",
            "Roboto",
            "Open Sans",
            "Lato",
            "Poppins",
            "Montserrat",
            "Nunito",
            "Raleway",
            "Ubuntu",

            // System / Web-safe
            "Arial",
            "Helvetica",
            "Verdana",
            "Tahoma",
            "Trebuchet MS",

            // Serif
            "Times New Roman",
            "Georgia",
            "Merriweather",
            "Playfair Display",

            // Monospace
            "Courier New",
            "Fira Code",
            "Source Code Pro",
            "JetBrains Mono",

            // Display / Fun (for testing extremes)
            "Impact",
            "Comic Sans MS",
            "Pacifico",
            "Lobster",
          ].map((family) => (
            <button
              key={family}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFontFamily(family);
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              style={{ fontFamily: family }}
            >
              {family}
            </button>
          ))}
        </div>
      </div>
      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
      {/* Font Size Dropdown */}
      <div className="flex items-center">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const current = parseInt(fontSize);
            if (current > 8) applyFontSize(`${current - 1}px`);
          }}
          className="p-1 px-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
          title="Decrease font size"
        >
          <Minus className="h-3 w-3" />
        </button>

        <div className="relative group mx-0.5">
          <button
            type="button"
            className="flex items-center gap-1 p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657] text-sm font-medium h-9"
          >
            <span className="w-[30px] text-center">{fontSize.replace("px", "")}</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {/* Invisible bridge to prevent closing on hover gap */}
          <div className="absolute top-8 left-0 w-full h-2 bg-transparent hidden group-hover:block" />

          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 hidden group-hover:block bg-white border border-[#E2D7CC80] rounded-md shadow-lg z-30 max-h-[250px] overflow-y-auto min-w-[70px] py-1">
            {[
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
            ].map((size) => (
              <button
                key={size}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applyFontSize(size);
                }}
                className={`block w-full text-center py-1.5 text-sm hover:bg-gray-50 transition-colors ${
                  fontSize === size ? "bg-blue-50 text-blue-600 font-bold" : ""
                }`}
              >
                {size.replace("px", "")}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            const current = parseInt(fontSize);
            if (current < 100) applyFontSize(`${current + 1}px`);
          }}
          className="p-1 px-1.5 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
          title="Increase font size"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
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
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
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
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
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
          formatHeading("h1");
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          formatHeading("h2");
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          formatHeading("h3");
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Unordered List"
      >
        <ListIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </button> */}

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          toggleLink();
        }}
        className={`p-2 rounded-md transition-all ${
          isLink
            ? "bg-blue-100 text-blue-600 shadow-sm"
            : "hover:bg-white hover:shadow-sm text-[#545657]"
        }`}
        title={isLink ? "Remove Link" : "Add Link"}
      >
        <Link2 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          editor.dispatchCommand(UNDO_COMMAND, undefined);
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
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all text-[#545657]"
        title="Redo"
      >
        <Redo className="h-4 w-4" />
      </button>

      {showLinkInput && (
        <div className="absolute top-full left-0 mt-1 z-20 flex bg-white border border-[#E2D7CC80] rounded-[8px] p-2 shadow-lg gap-2 items-center">
          <input
            type="text"
            className="flex-1 px-3 py-1 text-sm border border-[#E2D7CC80] rounded-[6px] focus:outline-none focus:border-(--color-gold-accent) min-w-[200px]"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                setShowLinkInput(false);
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-3 py-1 text-xs bg-(--color-gold-accent) text-white rounded-[6px] hover:bg-opacity-90 transition-all font-medium"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-red-500 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const LoadInitialContentPlugin = ({ initialHtml }: { initialHtml: string }) => {
  const [editor] = useLexicalComposerContext();
  const isFirstLoad = React.useRef(true);

  useEffect(() => {
    if (isFirstLoad.current && initialHtml && editor) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().clear();
        $getRoot().append(...nodes);
      });
      isFirstLoad.current = false;
    }
  }, [editor, initialHtml]);

  return null;
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter content here...",
  minHeight = "200px",
  label,
  required,
  error,
}) => {
  const handleEditorChange = (editorState: EditorState, editor: LexicalEditor) => {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor);
      if (htmlString !== value) {
        onChange(htmlString);
      }
    });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[16px] font-semibold text-[#171717]">
          {label} {required && <span className="text-[#E33535]">*</span>}
        </label>
      )}

      <div
        className={`rounded-[10px] border ${error ? "border-red-500" : "border-[#E2D7CC80]"} bg-white overflow-hidden transition-all focus-within:border-(--color-gold-accent)`}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="rich-text-content px-4 py-3 text-[15px] text-(--color-heading) focus:outline-none overflow-y-auto"
                  style={{ minHeight: minHeight || "200px" }}
                />
              }
              placeholder={
                <div className="pointer-events-none absolute left-4 top-3 text-sm text-gray-400">
                  {placeholder}
                </div>
              }
              ErrorBoundary={() => <div className="p-4 text-red-500">Editor Error</div>}
            />
            <HistoryPlugin />
            <ListPlugin />
            <LinkPlugin />
            <LoadInitialContentPlugin initialHtml={value} />
            <OnChangePlugin onChange={handleEditorChange} />
          </div>
        </LexicalComposer>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
