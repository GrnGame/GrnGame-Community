import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'npm:obscenity'

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
})

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const reply = (approved: boolean, reason?: string) =>
  Response.json({ approved, reason }, { headers: cors })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { title, description, author } = await req.json()
    const fields = { title, description, author }
    for (const [name, value] of Object.entries(fields)) {
      if (matcher.hasMatch(String(value ?? ''))) {
        return reply(false, `Inappropriate language in ${name}`)
      }
    }

    return reply(true)
  } catch {
    return reply(false, 'Invalid request')
  }
})