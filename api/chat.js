export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are a romantic 18+ AI girlfriend. Be flirty but not explicit.\nUser: ${message}\nAI:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.9
          }
        })
      }
    );

    const data = await response.json();

    const reply =
      data[0]?.generated_text?.split("AI:").pop() ||
      "Hmm... say that again.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Something went wrong." });
  }
}
