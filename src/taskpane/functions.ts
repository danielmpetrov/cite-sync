export function findCitations(text: string): ReadonlyArray<string> {
  return text.match(/(([A-z.]+(, | and | et al\.)?){1,3} \((\d{4}|n\.d\.)\))|(\(([A-z ,.&]+, (\d{4}|n\.d\.)(; )?)+\))/g) || [];
}

export function findUnique(citations: ReadonlyArray<string>): ReadonlySet<string> {
  const filtered = citations.map(citation => citation.replace(/\(|\)|,/g, ''));
  return new Set(filtered);
}

export function htmlMessage(total: number, unique: number): string {
  return `Found <strong>${total}</strong> total (<strong>${unique}</strong> unique) in-text citation${total === 1 ? '' : 's'}.`;
}

export function parseWordParagraphs(wordParagraphs: ReadonlyArray<Word.Paragraph>): [ReadonlyArray<string>, ReadonlyArray<string>] {
  const all: ReadonlyArray<string> = wordParagraphs
    .map(wordParagraph => wordParagraph.text.trim())
    .filter(paragraph => paragraph.length > 0);

  const index = all.findIndex(paragraph => /^(bibliography|references)$/gim.test(paragraph));
  const paragraphs = all.slice(0, index);
  const references = all.slice(index + 1)

  return [paragraphs, references];
}
