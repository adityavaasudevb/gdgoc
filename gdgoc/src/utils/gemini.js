/*
  Gemini API helper (CRA compatible)
  Read-only usage
  Purpose: Reason over Firestore data, never invent information
*/

export const callGemini = async (context, question) => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a campus assistant for a college productivity platform.

You are given STRUCTURED campus data below.

HOW YOU MUST ANSWER:
- If the question asks "what are all the clubs", list the club names.
- If the question asks "technical clubs", filter clubs where category contains "technical".
- If the question asks about events "today" or "tomorrow", compare with TODAY'S DATE.
- If the question asks about events, list relevant event titles and clubs.
- Be concise and clear.

STRICT RULES:
- Use ONLY the data provided below.
- Do NOT invent or assume details.
- If the requested information is not present, say exactly:
  "I don't have that information yet."

DATA:
${context}

QUESTION:
${question}
`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I don't have that information yet."
  );
};
