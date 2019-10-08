import { defaultTo, map, prop, filter, pipe, any, trim, all, curry, flatten } from 'ramda';
import { defaultToEmptyString, removeDoubleSpaces, matchCitations, splitBySemicolon, clean, splitBySpace, isReferencesTitle, removeParenthesesIfOdd } from './string'

export const findCitations: (text: string) => ReadonlyArray<string> = pipe(
  defaultToEmptyString,
  removeDoubleSpaces,
  matchCitations,
  map(splitBySemicolon),
  flatten,
  map(pipe(trim, removeParenthesesIfOdd))
);

export function parseWordParagraphs(wordParagraphs: ReadonlyArray<{ text: string }>): [ReadonlyArray<string>, ReadonlyArray<string>] {
  const all: ReadonlyArray<string> = pipe(
    defaultTo([] as ReadonlyArray<{ text: string }>),
    map(prop('text')),
    map(trim),
    filter(x => x.length > 0)
  )(wordParagraphs);

  const index = all.findIndex(isReferencesTitle);
  if (index === -1) {
    return [all, []];
  }
  const paragraphs = all.slice(0, index);
  const references = all.slice(index + 1)

  return [paragraphs, references];
}

export const extractCitations: (citations: ReadonlyArray<string>) => ReadonlyArray<string> = pipe(map(findCitations), flatten);

const citationMatchesReference = curry((reference: string, citation: string) => {
  const cleanCitation = clean(citation);
  const cleanReference = clean(reference);
  const citationParts = splitBySpace(cleanCitation);
  return all(part => cleanReference.indexOf(part) !== -1, citationParts);
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
