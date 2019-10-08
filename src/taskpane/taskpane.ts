import { parseWordParagraphs, findOrphanedReferences, findOrphanedCitations, extractCitations } from '../lib/functions';
import { renderCongratulations, renderInfo, renderReferencesError, renderTop20Warning, renderCitationsError, renderCitation } from './render';
import debounce = require('lodash.debounce');

let output: HTMLElement;

Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
    document.getElementById('btn-analyze').onclick = debounce(analyze, 500, {
      leading: true,
      trailing: false
    });
    output = document.getElementById('output');
    output.onclick = selectCitation;
  }
});

async function analyze() {
  return Word.run(async context => {
    const wordParagraphs = context.document.body.paragraphs.load('text');
    await context.sync();

    const [paragraphs, references] = parseWordParagraphs(wordParagraphs.items);
    const citations = extractCitations(paragraphs);

    if (citations.length === 0 && references.length === 0) {
      output.innerHTML = renderCongratulations;
      return;
    }

    output.innerHTML = renderInfo(citations.length, references.length);

    const orphanedCitations = findOrphanedCitations(citations, references);
    const orphanedReferences = findOrphanedReferences(citations, references);

    renderOrphanedCitations(output, orphanedCitations);
    renderOrphanedReferences(output, orphanedReferences);
  }).catch(console.log);
}

function renderOrphanedReferences(output: HTMLElement, references: ReadonlyArray<string>) {
  if (references.length === 0) {
    return;
  }

  output.innerHTML += renderReferencesError(references.length);

  if (references.length > 20) {
    output.innerHTML += renderTop20Warning;
    for (let i = 0; i < 20; i++) {
      output.innerHTML += `<p>${references[i]}</p>`;
    }
  } else {
    references.forEach(reference => output.innerHTML += `<p>${reference}</p>`);
  }
}

function renderOrphanedCitations(output: HTMLElement, citations: ReadonlyArray<string>) {
  if (citations.length === 0) {
    return;
  }

  output.innerHTML += renderCitationsError(citations.length);

  if (citations.length > 20) {
    output.innerHTML += renderTop20Warning;
    for (let i = 0; i < 20; i++) {
      output.innerHTML += renderCitation(citations[i]);
    }
  } else {
    citations.forEach(citation => output.innerHTML += renderCitation(citation));
  }
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
