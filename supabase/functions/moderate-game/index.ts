const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const blockedText = [
  'bite',
  'encule',
  'enculé',
  'fellation',
  'fuck',
  'gore',
  'merde',
  'murder',
  'nique',
  'naked',
  'pénis',
  'porn',
  'porno',
  'pornographie',
  'putain',
  'rape',
  'sexe',
  'sex',
  'viol',
  'violence',
  'violent',
  'meurtre',
  'tuer',
  'tue',
  'torture',
  'kill',
];

function hasBlockedText(value: string): boolean {
  const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return blockedText.some((term) => normalized.includes(
    term.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  ));
}

function response(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return response({ approved: false, reason: 'Method not allowed' }, 405);

  const form = await request.formData();
  const text = ['title', 'description', 'author']
    .map((field) => String(form.get(field) || ''))
    .join(' ');
  const video = form.get('video');

  if (!(video instanceof File)) return response({ approved: false, reason: 'A video is required' }, 400);
  if (hasBlockedText(text)) return response({ approved: false, reason: 'The text contains prohibited content' });

  const apiUser = Deno.env.get('SIGHTENGINE_API_USER');
  const apiSecret = Deno.env.get('SIGHTENGINE_API_SECRET');
  if (!apiUser || !apiSecret) {
    console.error('Sightengine credentials are not configured');
    return response({ approved: false, reason: 'Content moderation is not configured' }, 500);
  }

  const sightengineForm = new FormData();
  sightengineForm.append('media', video);
  sightengineForm.append('models', 'nudity-2.1,violence');
  sightengineForm.append('api_user', apiUser);
  sightengineForm.append('api_secret', apiSecret);

  const moderationResponse = await fetch('https://api.sightengine.com/1.0/video/check.json', {
    method: 'POST',
    body: sightengineForm,
  });
  if (!moderationResponse.ok) {
    console.error('Sightengine returned an HTTP error', moderationResponse.status);
    return response({ approved: false, reason: 'Video moderation failed' }, 502);
  }

  const result = await moderationResponse.json();
  const nudity = result.nudity || {};
  const violence = result.violence || {};
  const rejected = Number(nudity.sexual_activity || 0) >= 0.5
    || Number(nudity.sexual_display || 0) >= 0.5
    || Number(nudity.erotica || 0) >= 0.5
    || Number(violence.prob || 0) >= 0.5;

  return response({
    approved: !rejected,
    reason: rejected ? 'The video contains prohibited sexual or violent content' : undefined,
  });
});
