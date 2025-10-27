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
    const { roomType, aesthetic, colorScheme, budget, mood, notes } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build mood-based prompt adjustments
    const moodStyles: Record<string, string> = {
      happy: "bright, airy spaces with natural light and cheerful colors",
      calm: "soft tones, warm neutral colors, peaceful and serene atmosphere",
      inspired: "elegant, creative, artsy touches with bold accents",
      stressed: "cozy, dimly lit, pastel-themed interiors with comfortable textures",
      focused: "clean lines, organized layout, productivity-enhancing design",
    };

    // Build aesthetic prompt
    const aestheticPrompts: Record<string, string> = {
      minimal: "minimalist with clean lines and simple forms",
      modern: "contemporary modern with sleek furniture",
      luxurious: "luxury high-end with premium materials and elegant details",
      korean: "Korean-inspired design with soft colors and natural wood",
      rustic: "rustic with natural materials and warm tones",
      "dark-academia": "dark academia aesthetic with rich wood tones and vintage elements",
      bohemian: "bohemian eclectic with plants and textiles",
      industrial: "industrial loft style with exposed elements and metal accents",
    };

    const colorPrompt = colorScheme ? ` featuring ${colorScheme} colors` : "";
    const moodPrompt = moodStyles[mood] || "";
    const aestheticPrompt = aestheticPrompts[aesthetic] || aesthetic;
    const notesPrompt = notes ? ` Additional details: ${notes}.` : "";

    const imagePrompt = `Create a photorealistic interior design rendering of a ${roomType.replace("-", " ")} in ${aestheticPrompt} style${colorPrompt}. The design should evoke a ${moodPrompt} mood. Ultra high resolution, professional interior photography, 16:9 aspect ratio.${notesPrompt}`;

    console.log("Generating image with prompt:", imagePrompt);

    // Generate image using Lovable AI
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
            content: imagePrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    // Generate intelligent suggestions based on room type and aesthetic
    const suggestions = generateSuggestions(roomType, aesthetic, budget, mood);

    return new Response(
      JSON.stringify({
        image: imageUrl,
        suggestions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-interior function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate design" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateSuggestions(
  roomType: string,
  aesthetic: string,
  budget: string,
  mood: string
) {
  const furnitureSuggestions: Record<string, string[]> = {
    bedroom: ["Platform bed with upholstered headboard", "Bedside tables with soft lighting", "Comfortable reading chair", "Full-length mirror"],
    "living-room": ["Modular sofa with throw pillows", "Coffee table with storage", "Entertainment unit", "Accent chairs"],
    kitchen: ["Kitchen island with seating", "Open shelving units", "Modern bar stools", "Pendant lighting fixtures"],
    bathroom: ["Floating vanity", "Rainfall shower head", "Freestanding bathtub", "Storage cabinet"],
    office: ["Ergonomic desk chair", "Standing desk", "Bookshelves", "Task lighting"],
    dining: ["Dining table with extension", "Comfortable dining chairs", "Buffet or sideboard", "Statement chandelier"],
  };

  const lightingSuggestions: Record<string, string[]> = {
    happy: ["Bright LED ceiling lights", "Large windows for natural light", "Colorful accent lamps"],
    calm: ["Warm dimmable lights", "Soft wall sconces", "Ambient floor lamps"],
    inspired: ["Statement pendant lights", "Track lighting for artwork", "Decorative table lamps"],
    stressed: ["Soft recessed lighting", "Himalayan salt lamps", "Candle displays"],
    focused: ["Task lighting", "Adjustable desk lamps", "Natural daylight bulbs"],
  };

  const decorSuggestions: Record<string, string[]> = {
    minimal: ["Simple geometric wall art", "One or two indoor plants", "Neutral textiles"],
    modern: ["Abstract art pieces", "Sleek decorative objects", "Metallic accents"],
    luxurious: ["Velvet cushions", "Crystal decorative items", "Ornate mirrors"],
    korean: ["Minimalist ceramics", "Natural wood accents", "Paper lanterns"],
    rustic: ["Vintage finds", "Woven baskets", "Natural fiber rugs"],
    "dark-academia": ["Antique books", "Vintage globe", "Classical artwork"],
    bohemian: ["Macramé wall hangings", "Patterned textiles", "Collection of plants"],
    industrial: ["Metal wall art", "Exposed bulb fixtures", "Vintage industrial items"],
  };

  const colorPalettes: Record<string, string[]> = {
    minimal: ["White", "Gray", "Beige", "Black accents"],
    modern: ["Charcoal", "White", "Navy", "Brass"],
    luxurious: ["Deep purple", "Gold", "Cream", "Black"],
    korean: ["Soft pink", "Natural wood", "White", "Sage green"],
    rustic: ["Warm brown", "Terracotta", "Cream", "Forest green"],
    "dark-academia": ["Deep brown", "Hunter green", "Burgundy", "Cream"],
    bohemian: ["Terracotta", "Mustard", "Teal", "Natural"],
    industrial: ["Gray", "Black", "Raw wood", "Copper"],
  };

  return {
    furniture: furnitureSuggestions[roomType] || ["Custom furniture pieces", "Storage solutions", "Seating options"],
    lighting: lightingSuggestions[mood] || ["Ambient lighting", "Task lighting", "Accent lighting"],
    decor: decorSuggestions[aesthetic] || ["Wall art", "Decorative objects", "Textiles"],
    colors: colorPalettes[aesthetic] || ["Neutral tones", "Accent colors", "Natural materials"],
  };
}
