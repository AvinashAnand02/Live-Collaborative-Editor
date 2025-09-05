"use client";
import React, { useState } from "react";

export default function ChatSidebar({ onInsertToEditor, onReplaceSelection, getSelectionText }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: "user", content: input }];
    setMessages(next);
    setInput("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });
    const data = await res.json();
    const reply = data?.reply ?? "(no reply)";
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
  };

  const applyToSelection = async () => {
    const sel = getSelectionText();
    if (!sel) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: `Improve this:\n\n${sel}` }],
        action: "edit_selection",
        selection: sel,
      }),
    });
    const data = await res.json();
    if (data?.suggestion) onReplaceSelection(data.suggestion);
  };

  return (
    <aside className="h-full w-full max-w-md border-l bg-white flex flex-col shadow-lg">
      <div className="p-4 border-b font-bold text-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700">
        AI Assistant
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl shadow-sm ${
              m.role === "user" ? "bg-blue-50 self-end" : "bg-white self-start"
            }`}
          >
            <div className="text-xs font-medium text-gray-500 mb-1 capitalize">{m.role}</div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t bg-white space-y-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Ask anything…"
        />
        <div className="flex gap-3">
          <button
            onClick={send}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition"
          >
            Send
          </button>
          <button
            onClick={() => onInsertToEditor(input)}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Insert
          </button>
          <button
            onClick={applyToSelection}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Improve
          </button>
        </div>
      </div>
    </aside>
  );
}
