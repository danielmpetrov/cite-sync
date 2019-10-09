import { defaultTo, map, prop, filter, pipe, any, trim, all, curry, flatten, includes, findIndex, length, reject, isEmpty } from 'ramda';
import { defaultToEmptyString, removeDoubleSpaces, matchCitations, splitBySemicolon, clean, splitBySpace, isReferencesTitle, removeParenthesesIfOdd, splitAtRemove } from './string'

export const findCitations: (text: string) => ReadonlyArray<string> = pipe(
  defaultToEmptyString,
  removeDoubleSpaces,
  matchCitations,
  map(splitBySemicolon),
  flatten,
  map(pipe(trim, removeParenthesesIfOdd))
);

const parse: (wordParagraphs: ReadonlyArray<{ text: string }>) => ReadonlyArray<string> = pipe(
  defaultTo([] as ReadonlyArray<{ text: string }>),
  map(pipe(prop('text'), trim)),
  reject(isEmpty)
);
export function parseWordParagraphs(wordParagraphs: ReadonlyArray<{ text: string }>): [ReadonlyArray<string>, ReadonlyArray<string>] {
  const all = parse(wordParagraphs);
  const index = findIndex(isReferencesTitle, all);
  const splitIndex = index === -1 ? length(all) : index;
  return splitAtRemove(splitIndex, all);
}

export const extractCitations: (citations: ReadonlyArray<string>) => ReadonlyArray<string> = pipe(map(findCitations), flatten);

const citationMatchesReference = curry((reference: string, citation: string) => {
  const cleanCitation = clean(citation);
  const cleanReference = clean(reference);
  const citationParts = splitBySpace(cleanCitation);
  return all(part => includes(part, cleanReference), citationParts);
});

const referenceMatchesCitation = curry((citation: string, reference: string) => citationMatchesReference(reference, citation));

export function findOrphanedReferences(citations: ReadonlyArray<string>, references: ReadonlyArray<string>): ReadonlyArray<string> {
  const isOrphaned = (reference: string) => !any(citationMatchesReference(reference), citations);
  return filter(isOrphaned, references);
}

export function findOrphanedCitations(citations: ReadonlyArray<string>, references: ReadonlyArray<string>): ReadonlyArray<string> {
  const isOrphaned = (citation: string) => !any(referenceMatchesCitation(citation), references);
  return filter(isOrphaned, citations);
}
