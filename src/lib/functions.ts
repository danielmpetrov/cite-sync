import { defaultTo, map, prop, filter, reduce, pipe, any, concat, trim, test, all, curry, flatten } from 'ramda';
import { defaultToEmptyString, removeDoubleSpaces, matchCitations, splitBySemicolon, removeParentheses, clean, splitBySpace, isReferencesTitle } from './string'

const processMultiCitation = pipe(
  splitBySemicolon,
  map(trim),
  map(removeParentheses)
);
const processMultipleCitations = reduce((result: ReadonlyArray<string>, citation: string) => {
  const citations = processMultiCitation(citation);
  return concat(result, citations.length > 1 ? citations : [citation]);
}, []);

export const findCitations: (text: string) => ReadonlyArray<string> = pipe(
  defaultToEmptyString,
  removeDoubleSpaces,
  matchCitations,
  processMultipleCitations
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
