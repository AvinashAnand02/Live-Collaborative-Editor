import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { query } = body || {};
    if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

    // Use DuckDuckGo Instant Answer API (no key) for a small demo
    const q = encodeURIComponent(query);
    const ddg = await fetch(`https://api.duckduckgo.com/?q=${q}&format=json&no_redirect=1&no_html=1`);
    const ddgJson = await ddg.json().catch(() => ({}));

    const snippets = [];
    if (ddgJson.AbstractText) snippets.push(ddgJson.AbstractText);
    if (Array.isArray(ddgJson.RelatedTopics)) {
      ddgJson.RelatedTopics.slice(0,5).forEach(r => {
        if (r.Text) snippets.push(r.Text);
        else if (r.Topics && r.Topics[0] && r.Topics[0].Text) snippets.push(r.Topics[0].Text);
      });
    }

    const assembled = snippets.slice(0,6).join("\n\n") || "No quick results found.";

    // Summarize via chat route (server-side)
    const base = [
      { role: "system", content: "Summarize the following into 4-6 short bullet points." },
      { role: "user", content: assembled }
    ];

    const host = process.env.NEXT_PUBLIC_BASE_URL || '';
    // Call our chat API directly (server-side). If NEXT_PUBLIC_BASE_URL not set, call internal function by importing is harder — so call OpenAI directly if available.
    const chatRes = await fetch(`${host}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: base })
    }).catch(() => null);

    const chatJson = chatRes ? await chatRes.json().catch(() => ({})) : {};
    return NextResponse.json({ summary: chatJson.reply ?? "Summary unavailable." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}