import { createClient } from '@supabase/supabase-js';
import { PAK_BUCKET, PAK_FILE_NAME, VIDEO_BUCKET, VIDEO_FILE_NAME } from '../constant';
import type { Game, GameInput, GameRow } from '../types';

function requiredEnv(name: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(
      `${name} is missing.`,
    );
  }
  return value;
}

const supabase = createClient(
  requiredEnv('VITE_SUPABASE_URL'),
  requiredEnv('VITE_SUPABASE_ANON_KEY'),
);

function getPublicUrl(bucket: string, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

async function uploadFile(bucket: string, path: string, file: File): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type || 'application/octet-stream' });

  if (error) throw new Error(error.message);
}

//todo moderate videos
async function moderateGame(input: GameInput): Promise<void> {
  const { data, error } = await supabase.functions.invoke('moderate-game', {
    body: {
      title: input.title,
      description: input.description,
      author: input.author,
    },
  })
  if (error) throw new Error(`Content moderation failed: ${error.message}`)
  if (!data?.approved) throw new Error(data?.reason || 'The content was rejected by moderation')
}

function toGame(row: GameRow): Game {
  return {
    ...row,
    pakUrl: getPublicUrl(PAK_BUCKET, `${row.id}/${PAK_FILE_NAME}`),
    videoUrl: getPublicUrl(VIDEO_BUCKET, `${row.id}/${VIDEO_FILE_NAME}`),
  };
}

// upload a game on supabase
export async function uploadGame(input: GameInput): Promise<void> {
  const id = crypto.randomUUID();

  await moderateGame(input);
  await uploadFile(PAK_BUCKET, `${id}/${PAK_FILE_NAME}`, input.pak);
  await uploadFile(VIDEO_BUCKET, `${id}/${VIDEO_FILE_NAME}`, input.video);

  const { error } = await supabase
    .from('games')
    .insert({ id, title: input.title, description: input.description, author: input.author });

  if (error) throw new Error(error.message);
}

// list all of games 
export async function listGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select('id, title, description,author')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as GameRow[]).map(toGame);
}