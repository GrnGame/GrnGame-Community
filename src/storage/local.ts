import { get, set, del, keys } from 'idb-keyval';
import type { GameInput } from '../types';

export interface StoredGame extends GameInput {
  id: string;
  createdAt: number;
}

export async function saveGame(game: GameInput): Promise<string> {
  const id = crypto.randomUUID();
  await set(`${id}`, { ...game, id, createdAt: Date.now() } satisfies StoredGame);
  return id;
}

export const loadGame = (id: string) => get<StoredGame>(`${id}`);
export const deleteGame = (id: string) => del(`${id}`);
export const listGameIds = () => keys<string>();