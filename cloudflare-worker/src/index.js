const ALLOWED_ORIGINS = [
  'https://moorentpm.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
]

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function callGroq(messages, env) {
  const delays = [0, 3000, 6000]
  let lastError

  for (let i = 0; i < delays.length; i++) {
    if (delays[i] > 0) await sleep(delays[i])

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        max_tokens: 400,
        temperature: 0.4,
      }),
    })

    if (res.status === 429) {
      // Rate limited — wait for retry-after header or use fixed delay
      const retryAfter = parseInt(res.headers.get('retry-after') || '0', 10) * 1000
      if (i < delays.length - 1) {
        await sleep(retryAfter > 0 ? retryAfter : 2000)
        continue
      }
      lastError = 'rate-limit'
      break
    }

    const data = await res.json()

    if (!res.ok) {
      lastError = data.error?.message || 'groq-error'
      break
    }

    return data.choices?.[0]?.message?.content || ''
  }

  throw new Error(lastError || 'groq-failed')
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o))
    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const { messages, system } = await request.json()

      const groqMessages = []
      if (system) groqMessages.push({ role: 'system', content: system })
      for (const m of messages) groqMessages.push({ role: m.role, content: m.content })

      const text = await callGroq(groqMessages, env)

      return new Response(JSON.stringify({ text }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  },
}
