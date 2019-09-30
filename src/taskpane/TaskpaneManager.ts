// use JavaScript regex to find the culprits
// then search specifically for them using the word api (and highlight)

// Passive Citation
// (Doe, 2019) - 1 author
// (Doe and Borg, 2019) - 2 authors
// (Joe, Doe and Borg, 2019) - 3 authors
// (Doe et al., 2019) - 4+ authors

const activeCitationRegExp: RegExp = /([A-z.]+(, | and | et al\.)?){1,3} \(\d{4}\)/g;
const passiveCitationRegExp: RegExp = /\(([A-z ,.&]+, \d{4}(; )?)+\)/g;

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

class TaskpaneManager {

  bind() {
    document.getElementById("btn-count").onclick = this.count;
    document.getElementById("btn-highlight").onclick = this.highlight;
  }

  async count() {
    return Word.run(async context => {
      context.document.body.load('text');
      await context.sync();

      const text: string = context.document.body.text;
      const citations = [
        ...text.match(passiveCitationRegExp),
        ...text.match(activeCitationRegExp)
      ].map(citation => citation.replace(/\(|\)|,/g, ''));
      const set = new Set(citations);

      const countSummary = document.getElementById('count-summary');
      countSummary.innerHTML =
        `Found <strong>${citations.length}</strong> total (<strong>${set.size}</strong> unique) in-text citation${citations.length === 1 ? '' : 's'}.`;

      await context.sync();
    }).catch(console.log);
  }

  async highlight() {
    return Word.run(async context => {
      context.document.body.load('text');
      await context.sync();

      // const searchResults = context.document.body.search(passiveCitationRegExp, { matchWildcards: true });
      // searchResults.load('font');
      // await context.sync();

      // searchResults.items.forEach(item => {
      //   item.font.highlightColor = 'Yellow';
      //   item.font.bold = true;
      // });

      // await context.sync();
    }).catch(console.log);
  }
}

export default TaskpaneManager;
