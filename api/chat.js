export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are TesAI, a helpful AI assistant." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (!data.choices) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ reply: "OpenAI API error" });
    }

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {

    console.error(error);
    res.status(500).json({ reply: "AI connection error" });

  }

}
