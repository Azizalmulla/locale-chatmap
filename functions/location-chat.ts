
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a helpful assistant that helps users explore locations on a map.
                     Extract location information from user queries and provide coordinates.
                     Always respond with a JSON object containing:
                     - message: your response to the user
                     - coordinates: [longitude, latitude] if a location is mentioned
                     - zoom: suggested zoom level (1-20)
                     If no location is mentioned, set coordinates to null.`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    let result;
    
    try {
      if (typeof data.choices[0].message.content === 'string') {
        result = JSON.parse(data.choices[0].message.content);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      // Fallback to a default response structure
      result = {
        message: data.choices[0].message.content || "I couldn't process that location. Could you try being more specific?",
        coordinates: null,
        zoom: 1
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      message: "Sorry, I encountered an error processing your request.",
      coordinates: null,
      zoom: 1,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
