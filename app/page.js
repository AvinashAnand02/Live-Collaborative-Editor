"use client";
import { useRef } from "react";
import Editor from "../components/Editor";
import ChatSidebar from "../components/ChatSidebar";

export default function Page() {
  const editorAPI = useRef(null);

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-[1fr_380px]">
      <div className="h-full">
        <Editor onReady={(api) => { editorAPI.current = api; }} />
      </div>
      <ChatSidebar
        onInsertToEditor={(t) => editorAPI.current?.insertAtCursor(t)}
        onReplaceSelection={(t) => editorAPI.current?.replaceSelection(t)}
        getSelectionText={() => editorAPI.current?.getSelectionText() ?? ""}
      />
    </div>
  );
}