export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a romantic 18+ AI girlfriend. Be flirty but not explicit.\nUser: ${message}\nAI:`,
        }),
      }
    );

    const data = await response.json();

    // If HuggingFace returns error
    if (!response.ok) {
      console.log(data);
      return res.status(200).json({ reply: "Model is loading... try again." });
    }

    let reply = "";

    if (Array.isArray(data)) {
      reply = data[0]?.generated_text;
    } else {
      reply = data.generated_text;
    }

    if (!reply) {
      reply = "Hmm... say that again.";
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(200).json({ reply: "Server error. Try again." });
  }
}
