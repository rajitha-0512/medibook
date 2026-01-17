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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { prompt } = await req.json();

    const defaultPrompt = "Generate a modern healthcare mobile app logo icon. Feature a stylized medical cross combined elegantly with a heart shape. Use a beautiful teal to cyan gradient. Ultra clean minimalist design with smooth curves. Square format, professional app icon style, centered on pure white background. No text, just the icon symbol.";

    // Fallback icon (SVG data URI) so the app never crashes if AI credits are exhausted.
    const fallbackImageUrl =
      "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='512'%20height='512'%20viewBox='0%200%20512%20512'%3E%3Crect%20width='512'%20height='512'%20rx='120'%20fill='white'/%3E%3Cpath%20d='M256%20120c-55%200-100%2045-100%20100v72c0%2055%2045%20100%20100%20100s100-45%20100-100v-72c0-55-45-100-100-100z'%20fill='%2306b6d4'%20opacity='0.18'/%3E%3Cpath%20d='M192%20212h48v-48h32v48h48v32h-48v48h-32v-48h-48v-32z'%20fill='%2306b6d4'/%3E%3Ctext%20x='256'%20y='382'%20text-anchor='middle'%20font-family='Arial,Helvetica,sans-serif'%20font-size='96'%20font-weight='800'%20fill='%2306b6d4'%3EM%3C/text%3E%3C/svg%3E";

    console.log("Calling AI gateway with prompt:", prompt || defaultPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt || defaultPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      // Common cases: 402 (out of credits) or 429 (rate limited)
      if (response.status === 402 || response.status === 429) {
        return new Response(
          JSON.stringify({
            imageUrl: fallbackImageUrl,
            warning:
              response.status === 402
                ? "AI credits exhausted"
                : "AI rate limited",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI gateway response structure:", JSON.stringify({
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasImages: !!data.choices?.[0]?.message?.images,
      imagesLength: data.choices?.[0]?.message?.images?.length,
    }));

    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("Full response:", JSON.stringify(data));
      throw new Error("No image generated - API response did not contain an image");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating logo:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});