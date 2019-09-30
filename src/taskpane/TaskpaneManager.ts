import CitationFinder from './CitationFinder';

// use JavaScript regex to find the culprits
// then search specifically for them using the word api (and highlight)

class TaskpaneManager {
  bind() {
    document.getElementById("btn-count").onclick = this.count;
    document.getElementById("btn-highlight").onclick = this.highlight;
  }

  async count() {
    return Word.run(async context => {
      context.document.body.load('text');
      await context.sync();

      const finder = new CitationFinder(context.document.body.text);
      document.getElementById('count-summary').innerHTML = finder.htmlMessage;

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
