import { findCitations, findUnique, htmlMessage, parseWordParagraphs } from './functions';

Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
    document.getElementById('btn-count').onclick = count;
    document.getElementById('btn-highlight').onclick = findReferences;
  }
});

async function count() {
  return Word.run(async context => {
    context.document.body.load('text');
    await context.sync();

    const citations = findCitations(context.document.body.text);
    const unique = findUnique(citations);
    const message = htmlMessage(citations.length, unique.size);
    document.getElementById('count-summary').innerHTML = message;

    await context.sync();
  }).catch(console.log);
}

let current: number = 0;

async function highlight() {
  return Word.run(async context => {
    context.document.body.load('text');
    await context.sync();

    const citations = findCitations(context.document.body.text);

    if (current === citations.length) {
      current = 0;
    }

    const citation = citations[current++];
    const result = context.document.body.search(citation).load('text');
    await context.sync();

    result.items[0].select();
    await context.sync();
  }).catch(console.log);
}

async function findReferences() {
  return Word.run(async context => {
    const wordParagraphs = context.document.body.paragraphs.load('text');
    await context.sync();

    const [paragraphs, references] = parseWordParagraphs(wordParagraphs.items);

    console.log(paragraphs, references);
  });
}
