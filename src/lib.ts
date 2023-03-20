/**
 * Pluralises a word and chooses a suffix attached to the root provided.
 * - pluralise("credit", "s") = credit/credits
 * - pluralise("part", "ies", "y") = party/parties
 * - pluralise("sheep") = sheep
 */
export function pluralise(
  value: number,
  word: string,
  plural = '',
  singular = '',
  excludeNumber = false,
): string {
  let result = excludeNumber ? '' : `${value} `;

  if (value === 1) result += word + singular;
  else result += word + plural;

  return result;
}
