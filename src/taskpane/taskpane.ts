import { parseWordParagraphs, findOrphanedReferences, findOrphanedCitations, extractCitations } from '../lib/functions';
import { congratulations, info, renderOrphanedCitations, renderOrphanedReferences } from './render';
import debounce = require('lodash.debounce');

let render: (html: string) => string;
let renderAppend: (html: string) => string;

Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
    document.getElementById('btn-analyze').onclick = debounce(analyze, 500, {
      leading: true,
      trailing: false
    });
    const output = document.getElementById('output');
    output.onclick = selectCitation;
    render = (html: string) => output.innerHTML = html;
    renderAppend = (html: string) => output.innerHTML += html;
  }
});

async function analyze() {
  return Word.run(async context => {
    const wordParagraphs = context.document.body.paragraphs.load('text');
    await context.sync();

    const [paragraphs, references] = parseWordParagraphs(wordParagraphs.items);
    const citations = extractCitations(paragraphs);

    if (citations.length === 0 && references.length === 0) {
      render(congratulations);
      return;
    }

    const i = info(citations.length, references.length);
    render(i);

    const orphanedCitations = findOrphanedCitations(citations, references);
    const orphanedReferences = findOrphanedReferences(citations, references);

    renderOrphanedCitations(renderAppend, orphanedCitations);
    renderOrphanedReferences(renderAppend, orphanedReferences);
  }).catch(console.log);
}

async function selectCitation(event: any) {
  if (!event.target.classList.contains('citation-link')) {
    return;
  }

  const citation: string = event.target.innerText.trim();

  return Word.run(async context => {
    const result = context.document.body.search(citation, { ignoreSpace: true }).load('text');
    await context.sync();

    result.items[0].select();
    await context.sync();
  }).catch(console.log);
}
