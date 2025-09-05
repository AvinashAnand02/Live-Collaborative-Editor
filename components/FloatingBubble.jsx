"use client";
import React, { useEffect, useRef, useState } from "react";

export default function FloatingBubble({ editor, onPreview }) {
  const ref = useRef(null);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const update = () => {
      const { state, view } = editor;
      const { from, to } = state.selection;
      if (from === to) return setCoords(null);
      try {
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);

        // Calculate top above the selection
        const boxTop = Math.min(start.top, end.top) - 60 + window.scrollY;

        // Center horizontally on selection
        const boxLeft = (start.left + end.left) / 2 + window.scrollX;

        setCoords({ top: boxTop, left: boxLeft });
      } catch (e) {
        setCoords(null);
      }
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    update();

    return () => {
      try {
        editor.off("selectionUpdate", update);
        editor.off("transaction", update);
      } catch (e) {}
    };
  }, [editor]);

  const runAI = async (mode) => {
    const { state } = editor;
    const { from, to } = state.selection;
    if (from === to) return;
    const selected = state.doc.textBetween(from, to, " ");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: mode, selection: selected }),
    });
    const data = await res.json();
    if (data?.suggestion) onPreview(selected, data.suggestion);
  };

  if (!coords) return null;

  return (
    <div
      ref={ref}
      className="fixed z-20 rounded-2xl border border-gray-200 bg-white shadow-xl p-3 flex gap-3 items-center backdrop-blur-sm transition-transform duration-200 hover:scale-105"
      style={{
        top: coords.top,
        left: coords.left,
        width: 280,
        transform: "translateX(-50%)", // center horizontally
      }}
    >
      <button
        className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium text-sm hover:from-blue-100 hover:to-blue-200 transition"
        onClick={() => runAI("shorten")}
      >
        Shorten
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium text-sm hover:from-green-100 hover:to-green-200 transition"
        onClick={() => runAI("lengthen")}
      >
        Lengthen
      </button>
      <button
        className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium text-sm hover:from-purple-100 hover:to-purple-200 transition"
        onClick={() => runAI("to_table")}
      >
        To Table
      </button>
      <button
        className="ml-auto px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-md transition"
        onClick={() => runAI("lengthen")}
      >
        Edit ✨
      </button>
    </div>
  );
}
