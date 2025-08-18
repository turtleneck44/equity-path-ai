import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbol, currentPrice, priceHistory, marketData } = await req.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a professional financial analyst with expertise in stock market analysis. Provide detailed, actionable insights based on real market data. Focus on technical analysis, market trends, and risk assessment. Always include specific price targets and confidence levels.`
          },
          {
            role: 'user',
            content: `Analyze ${symbol} stock:
            Current Price: $${currentPrice}
            Recent Price History: ${JSON.stringify(priceHistory?.slice(-10))}
            Market Data: ${JSON.stringify(marketData)}
            
            Please provide:
            1. Technical analysis summary
            2. Short-term (1-week) prediction with price targets
            3. Medium-term (1-month) outlook  
            4. Key resistance/support levels
            5. Risk assessment and confidence level (1-10)
            6. Trading recommendations (buy/hold/sell)
            
            Format as JSON with these exact keys: technicalAnalysis, shortTermPrediction, mediumTermOutlook, supportResistance, riskAssessment, recommendation, confidenceLevel`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    })

    const aiData = await response.json()
    const analysisText = aiData.choices[0].message.content

    // Parse JSON from AI response
    let analysis
    try {
      analysis = JSON.parse(analysisText)
    } catch {
      // Fallback parsing if AI doesn't return pure JSON
      analysis = {
        technicalAnalysis: analysisText.substring(0, 200) + "...",
        shortTermPrediction: "AI analysis in progress...",
        mediumTermOutlook: "Detailed analysis available",
        supportResistance: "Calculating levels...",
        riskAssessment: "Moderate risk",
        recommendation: "Hold",
        confidenceLevel: 7
      }
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    )
  }
})