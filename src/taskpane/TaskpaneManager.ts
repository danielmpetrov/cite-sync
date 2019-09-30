import CitationFinder from './CitationFinder';

async function getFinder(context: Word.RequestContext): Promise<CitationFinder> {
  context.document.body.load('text');
  await context.sync();
  return new CitationFinder(context.document.body.text);
}

class TaskpaneManager {
  bind() {
    document.getElementById("btn-count").onclick = this.count;
    document.getElementById("btn-highlight").onclick = this.highlight;
  }

  async count() {
    return Word.run(async context => {
      const finder = await getFinder(context);
      document.getElementById('count-summary').innerHTML = finder.htmlMessage;
      await context.sync();
    }).catch(console.log);
  }

  async highlight() {
    return Word.run(async context => {
      const finder = await getFinder(context);

      for (let citation of finder.all) {
        const result = context.document.body.search(citation).load('font');
        await context.sync();

        result.items.forEach(item => {
          item.font.highlightColor = 'Yellow';
          item.font.bold = true;
        });
        await context.sync();
      }
    }).catch(console.log);
  }
}

export default TaskpaneManager;
