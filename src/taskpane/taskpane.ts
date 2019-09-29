Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("btn-count").onclick = count;
    document.getElementById("btn-highlight").onclick = highlight;
  }
});

// use JavaScript regex to find the culprits
// then search specifically for them using the word api (and highlight)

// Passive Citation
// (Doe, 2019) - 1 author
// (Doe and Borg, 2019) - 2 authors
// (Joe, Doe and Borg, 2019) - 3 authors
// (Doe et al., 2019) - 4+ authors

// const citationPattern = '[(][!)]@, [0-9]{4}[)]';
const citationPattern: string = '[A-z]@ [(][0-9]{4}[)]';

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

export async function count() {
  return Word.run(async context => {
    context.document.body.load('text');
    await context.sync();
    console.log(context.document.body.text);
    const searchResults = context.document.body.search(citationPattern, { matchWildcards: true });
    searchResults.load('text');
    await context.sync();

    const total = searchResults.items.length;
    const uniqueSet = new Set(searchResults.items.map(item => item.text));
    const countSummary = document.getElementById('count-summary');
    countSummary.innerHTML =
      `Found <strong>${total}</strong> total (<strong>${uniqueSet.size}</strong> unique) in-text citation${total === 1 ? '' : 's'}.`;

    await context.sync();
  }).catch(console.log);
}

export async function highlight() {
  return Word.run(async context => {
    context.document.body.load('text');
    await context.sync();

    const searchResults = context.document.body.search(citationPattern, { matchWildcards: true });
    searchResults.load('font');
    await context.sync();

    searchResults.items.forEach(item => {
      item.font.highlightColor = 'Yellow';
      item.font.bold = true;
    });

    await context.sync();
  }).catch(console.log);
}
