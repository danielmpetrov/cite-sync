export function findCitations(text: string): ReadonlyArray<string> {
  return (text || '').match(/([A-z]+(, |,? and | et al\.)?){1,3} \((\d{4}|n\.d\.)(, p\. \d+)?\)|\(([A-z ,.&]+, (\d{4}|n\.d\.)(, p\. \d+)?(; )?)+\)/g) || [];
}

export function findUnique(citations: ReadonlyArray<string>): ReadonlySet<string> {
  const filtered = (citations || []).map(citation => citation.replace(/\(|\)|,/g, ''));
  return new Set(filtered);
}

export function htmlMessage(total: number, unique: number): string {
  return `Found <strong>${total}</strong> total (<strong>${unique}</strong> unique) in-text citation${total === 1 ? '' : 's'}.`;
}

export function parseWordParagraphs(wordParagraphs: ReadonlyArray<Word.Paragraph>): [ReadonlyArray<string>, ReadonlyArray<string>] {
  const all: ReadonlyArray<string> = (wordParagraphs || [])
    .map(wordParagraph => wordParagraph.text.trim())
    .filter(paragraph => paragraph.length > 0);

  const index = all.findIndex(paragraph => /^(bibliography|references)$/gim.test(paragraph));
  const paragraphs = all.slice(0, index);
  const references = all.slice(index + 1)

  return [paragraphs, references];
}

const clean = (citation: string) => citation.replace(/\(|\)|,|[A-Z]\. /g, '');

export function findOrphanedReferences(paragraphs: ReadonlyArray<string>, references: ReadonlyArray<string>): ReadonlyArray<string> {
  const citations = paragraphs.reduce((result, paragraph) => result.concat(findCitations(paragraph)), [] as ReadonlyArray<string>);
  const cleanCitations = citations.map(clean);
  const cleanReferences = references.reduce((result, reference) => result.concat(clean(reference)), [] as ReadonlyArray<string>);

  const isCited = (reference: string) => cleanCitations.some(citation => reference.indexOf(citation) !== -1);

  return cleanReferences.reduce(
    (orphaned, cleanReference, index) => isCited(cleanReference) ? orphaned : orphaned.concat(references[index]),
    [] as ReadonlyArray<string>);
}

export function findOrphanedCitations(paragraphs: ReadonlyArray<string>, references: ReadonlyArray<string>): ReadonlyArray<string> {
  const citations = paragraphs.reduce((result, paragraph) => result.concat(findCitations(paragraph)), [] as ReadonlyArray<string>);
  const cleanCitations = citations.map(clean);
  const cleanReferences = references.reduce((result, reference) => result.concat(clean(reference)), [] as ReadonlyArray<string>);

  const isReferenced = (citation: string) => cleanReferences.some(reference => reference.indexOf(citation) !== -1);

  return cleanCitations.reduce(
    (orphaned, cleanCitation, index) => isReferenced(cleanCitation) ? orphaned : orphaned.concat(citations[index]),
    [] as ReadonlyArray<string>);
}
