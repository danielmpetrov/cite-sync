import CitationFinder from './CitationFinder';

Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
    document.getElementById('btn-count').onclick = count;
    document.getElementById('btn-highlight').onclick = highlight;
  }
});

async function getFinder(context: Word.RequestContext): Promise<CitationFinder> {
  context.document.body.load('text');
  await context.sync();
  return new CitationFinder(context.document.body.text);
}

async function count() {
  return Word.run(async context => {
    const finder = await getFinder(context);
    document.getElementById('count-summary').innerHTML = finder.htmlMessage;
    await context.sync();
  }).catch(console.log);
}

let current: number = 0;

async function highlight() {
  return Word.run(async context => {
    const finder = await getFinder(context);

    if (current === finder.all.length) {
      current = 0;
    }

    const citation = finder.all[current++];
    const result = context.document.body.search(citation).load('text');
    await context.sync();

    result.items[0].select();
    await context.sync();
  }).catch(console.log);
}
