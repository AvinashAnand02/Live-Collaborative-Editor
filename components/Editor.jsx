"use client";
import React, { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import FloatingBubble from "./FloatingBubble";
import AIPreviewModal from "./AIPreviewModal";

export default function Editor({ onReady }) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const provider = useMemo(() => {
    try {
      return new WebrtcProvider("live-collab-room", ydoc);
    } catch (e) {
      console.warn("y-webrtc init failed:", e);
      return null;
    }
  }, [ydoc]);

  const user = useMemo(() => {
    const id = Math.floor(Math.random() * 1000);
    const hues = [0, 220, 140, 30, 280];
    const hue = hues[id % hues.length];
    return { name: "User-" + id, color: `hsl(${hue} 90% 40%)` };
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Placeholder.configure({ placeholder: "Start typing… (Select text to see AI tools)" }),
      Table,
      TableRow,
      TableCell,
      TableHeader,
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({ provider, user }),
    ],
    content: "<p><strong>Live Collaborative Editor</strong> — select text to try the AI toolbar.</p>",
    immediatelyRender: false,
  }, [ydoc, provider, user]);

  useEffect(() => {
    if (!editor || !onReady) return;
    const api = {
      insertAtCursor: (text) => editor.chain().focus().insertContent(text).run(),
      replaceSelection: (text) => {
        const { from, to } = editor.state.selection;
        editor.chain().focus().insertContentAt({ from, to }, text).run();
      },
      getSelectionText: () => {
        const { from, to } = editor.state.selection;
        return editor.state.doc.textBetween(from, to, " ");
      },
    };
    onReady(api);
  }, [editor, onReady]);

  const [aiPreview, setAiPreview] = useState(null);

  if (!editor)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading editor…
      </div>
    );

  return (
    <div className="relative h-full overflow-y-auto bg-gray-50 p-4">
      {/* Floating AI Bubble */}
      <FloatingBubble
        editor={editor}
        onPreview={(original, suggestion) =>
          setAiPreview({ original, suggestion })
        }
      />

      {/* Editor Container */}
      <div className="prose prose-sm sm:prose lg:prose-lg max-w-full mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <EditorContent editor={editor} />
      </div>

      {/* AI Preview Modal */}
      {aiPreview && (
        <AIPreviewModal
          original={aiPreview.original}
          suggestion={aiPreview.suggestion}
          onConfirm={() => {
            const { from, to } = editor.state.selection;
            editor
              .chain()
              .focus()
              .insertContentAt({ from, to }, aiPreview.suggestion)
              .run();
            setAiPreview(null);
          }}
          onCancel={() => setAiPreview(null)}
        />
      )}
    </div>
  );
}
