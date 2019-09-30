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

class CitationFinder {

  private _all: string[];
  private _unique: Set<string>;

  constructor(private text: string) {
    this._all = this.text.match(citationRegex) || [];
    this._unique = new Set(this._all.map(citation => citation.replace(/\(|\)|,/g, '')));
  }

  get all() {
    return this._all;
  }

  get total(): number {
    return this._all.length;
  }

  get unique(): number {
    return this._unique.size;
  }

  get htmlMessage(): string {
    return `Found <strong>${this.total}</strong> total (<strong>${this.unique}</strong> unique) in-text citation${this.total === 1 ? '' : 's'}.`;
  }
}

export default CitationFinder;
