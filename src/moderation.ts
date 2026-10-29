import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from 'obscenity';

const textMatcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});


//todo add english terms and more french terms 
const BlockedTerms = [
  'bite',
  'encule',
  'enculé',
  'fellation',
  'merde',
  'nique',
  'pénis',
  'porno',
  'pornographie',
  'putain',
  'seins nus',
  'sexe',
  'viol',
  'violence',
  'violent',
  'violente',
  'meurtre',
  'tuer',
  'tue',
  'torture',
];

export function containsBlockedText(value: string): boolean {
  if (textMatcher.hasMatch(value)) return true;

  const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return BlockedTerms.some((term) => normalized.includes(
    term.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
  ));
}

export function checkTextModeration(
  fields: { title: string; description: string; author: string },
): string | null {
  if (containsBlockedText(fields.title)) return 'The title contains prohibited content';
  if (containsBlockedText(fields.description)) return 'The description contains prohibited content';
  if (containsBlockedText(fields.author)) return 'The author contains prohibited content';
  return null;
}
