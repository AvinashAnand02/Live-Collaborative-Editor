import { NextResponse } from "next/server";

const SYS_EDIT = `You are an editing assistant. When given text and an action:
- "shorten": return a concise version.
- "lengthen": return a slightly longer, clearer version.
- "to_table": convert to a Markdown table if feasible.
Return ONLY the edited text. No extra commentary.`;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, action, selection } = body || {};

    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({
        reply: "ERROR: OPENAI_API_KEY not set. Set it in .env.local",
      });
    }

    // Editing action
    if (selection && action) {
      const prompt = [
        { role: "system", content: SYS_EDIT },
        { role: "user", content: `Action: ${action}\n\nText:\n${selection}` },
      ];
      const suggestion = await callOpenAI(prompt, key);
      return NextResponse.json({ suggestion });
    }

    // Normal chat
    const base = [{ role: "system", content: "You are a helpful assistant." }, ...(messages || [])];
    const reply = await callOpenAI(base, key);
    return NextResponse.json({ reply });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function callOpenAI(messages, key) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("OpenAI error:", txt);
    return "AI error: see server logs";
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "No response.";
}
