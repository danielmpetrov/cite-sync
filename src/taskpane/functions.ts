// Passive Citation
// (Doe, 2019) - 1 author
// (Doe and Borg, 2019) - 2 authors
// (Joe, Doe and Borg, 2019) - 3 authors
// (Doe et al., 2019) - 4+ authors

// Active Citation
// Doe (2019) - 1 author
// Doe and Borg (2019) - 2 authors
// Joe, Doe and Borg (2019) - 3 authors
// Doe et al. (2019) - 4+ authors

// ???
// https://guides.libraries.psu.edu/apaquickguide/intext
// multiple citations, e.g. (Derwing, Rossiter, & Munro, 2002; Thomas, 2004)
// page number, e.g. (Field, 2005, p. 14)
// not dated, e.g (Smith, n.d.)

// const activeCitationRegExp: RegExp = /([A-z.]+(, | and | et al\.)?){1,3} \(\d{4}\)/g;
// const passiveCitationRegExp: RegExp = /\(([A-z ,.&]+, \d{4}(; )?)+\)/g;
const citationRegex: RegExp = /(([A-z.]+(, | and | et al\.)?){1,3} \(\d{4}\))|(\(([A-z ,.&]+, \d{4}(; )?)+\))/g;

export function findCitations(text: string): ReadonlyArray<string> {
  return text.match(citationRegex) || [];
}

export function findUnique(citations: ReadonlyArray<string>): ReadonlySet<string> {
  const filtered = citations.map(citation => citation.replace(/\(|\)|,/g, ''));
  return new Set(filtered);
}

export function htmlMessage(total: number, unique: number): string {
  return `Found <strong>${total}</strong> total (<strong>${unique}</strong> unique) in-text citation${total === 1 ? '' : 's'}.`;
}
