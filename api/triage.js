/* global process */

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST")
    return response.status(405).json({ error: "Method not allowed" })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return response.status(500).json({ error: "Missing OPENAI_API_KEY" })
  }

  try {
    const payload = request.body
    const location = payload.location
      ? `${payload.location.lat}, ${payload.location.lng}`
      : "not shared"

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are ARIA, an emergency triage assistant for disabled people during disasters. Return only valid JSON.",
          },
          {
            role: "user",
            content: `Create a structured emergency triage profile from this intake.
Intake mode: ${payload.intakeMode || "self"}
Selected symbols: ${payload.selectedLabels?.join(", ") || "none"}
Needs inferred from symbols: ${payload.selectedNeeds?.join(", ") || "none"}
Voice input: ${payload.voiceInput || "none"}
Text fallback: ${payload.textInput || "none"}
Helper/bystander observation: ${payload.helperDescription || "none"}
Location: ${location}
Saved pre-disaster profile: ${payload.savedProfile ? JSON.stringify(payload.savedProfile) : "none"}

If intake mode is helper, infer the affected person's urgency, needs, disability/access needs, communication method, and medical dependencies from the helper observation. Do not assume the helper is the person needing help.

Return JSON with these keys:
name, age, urgency ("critical" | "high" | "medium"), location, needs array, communicationMethod, medicalDependencies array, responderGuidance, cascadeOrder array using neighbor/volunteer/emergency/911, disabilities array, doNotDo array, approachSteps array, transcript.`,
          },
        ],
      }),
    })

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text()
      return response.status(openAIResponse.status).json({ error: errorText })
    }

    const data = await openAIResponse.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return response.status(502).json({ error: "OpenAI returned no triage profile" })
    }

    return response.status(200).json(JSON.parse(content))
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}
