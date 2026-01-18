import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, documents } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build document context for RAG
    let documentContext = "";
    if (documents && documents.length > 0) {
      documentContext = "\n\n--- AVAILABLE DOCUMENTS ---\n";
      documents.forEach((doc: { name: string; content: string }, index: number) => {
        if (doc.content) {
          documentContext += `\nDocument ${index + 1}: "${doc.name}"\nContent:\n${doc.content.slice(0, 5000)}\n---\n`;
        }
      });
    }

    const systemPrompt = `You are FS RAG, a multimodal RAG (Retrieval-Augmented Generation) assistant. Your role is to provide accurate, evidence-based answers using the documents provided to you.

CRITICAL RULES:
1. ONLY answer based on information found in the provided documents
2. If the answer is not in the documents, respond with: "Insufficient information in uploaded documents."
3. NEVER make up or hallucinate information
4. Always cite your sources using the format below

RESPONSE FORMAT:
For every answer, structure your response as:

Answer:
[Your clear, concise answer based on document evidence]

Evidence:
- Document: [document name]
- Page/Section: [if available]
- Source text: "[exact quote from document]"

Confidence:
[High/Medium/Low] - based on how directly the evidence supports the answer

${documentContext}

If no documents are provided, inform the user they need to upload documents first for evidence-based answers.`;

    console.log("Calling AI gateway with RAG context...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Streaming response from AI gateway...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("RAG chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
