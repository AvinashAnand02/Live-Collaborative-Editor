"use client";
import React from "react";

export default function AIPreviewModal({ original, suggestion, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border-2 border-blue-100 transform transition-transform duration-300 hover:scale-105">
        <div className="p-5 border-b font-bold text-lg text-blue-700 bg-gradient-to-r from-blue-100 to-blue-50">
          AI Suggestion Preview
        </div>
        <div className="grid grid-cols-2 gap-0">
          <div className="p-5 border-r bg-gray-50">
            <div className="text-sm font-semibold mb-2 text-gray-600">Original</div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{original}</div>
          </div>
          <div className="p-5 bg-white">
            <div className="text-sm font-semibold mb-2 text-gray-600">AI Suggestion</div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">{suggestion}</div>
          </div>
        </div>
        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
