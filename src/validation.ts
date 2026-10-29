import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  MAX_PAK_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  PAK_FILE_NAME,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  MB,
} from './constant';
import type { GameInput } from './types';


// return null if correct or error string 
export function checkGameInput(game: GameInput): string | null {
  const { title, description, author, pak, video } = game;

  if (pak.name !== PAK_FILE_NAME) return `The file must be named ${PAK_FILE_NAME}`;
  if (pak.size > MAX_PAK_SIZE_MB * MB) return `${PAK_FILE_NAME} is too big (max ${MAX_PAK_SIZE_MB} MB)`;

  if (!video.type.startsWith('video/')) return 'The demo must be a video file';
  if (video.size > MAX_VIDEO_SIZE_MB * MB) return `The video is too big (max ${MAX_VIDEO_SIZE_MB} MB)`;

  if (title.length < TITLE_MIN_LENGTH || title.length > TITLE_MAX_LENGTH) {
    return `The title must have between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`;
  }
  if (description.length < DESCRIPTION_MIN_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
    return `The description must have between ${DESCRIPTION_MIN_LENGTH} and ${DESCRIPTION_MAX_LENGTH} characters`;
  }
  if(author.length <TITLE_MIN_LENGTH || author.length > TITLE_MAX_LENGTH){
    return `The author name must have between ${TITLE_MIN_LENGTH} and ${TITLE_MAX_LENGTH} characters`;
  }

  return null;
}