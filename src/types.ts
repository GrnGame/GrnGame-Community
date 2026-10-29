//what the user put in create 
export interface GameInput {
  title: string;
  description: string;
  author:string;
  pak: File;
  video: File;
}

// supabase game line
export interface GameRow {
  id: string;
  title: string;
  description: string;
  author:string;
}

// a game
export interface Game extends GameRow {
  pakUrl: string;
  videoUrl: string;
}