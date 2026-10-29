import { createClient } from '@supabase/supabase-js';
import { PAK_BUCKET, PAK_FILE_NAME, VIDEO_BUCKET, VIDEO_FILE_NAME } from '../constant';
import type { Game, GameInput, GameRow } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  
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