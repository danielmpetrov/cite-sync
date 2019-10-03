import { findUnique, parseWordParagraphs, findOrphanedReferences, findOrphanedCitations, extractCitations } from './functions';

let output: HTMLElement;

Office.onReady(info => {
  if (info.host === Office.HostType.Word) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
    document.getElementById('btn-analyze').onclick = analyze;
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
    const unique = findUnique(citations);
    const orphanedReferences = findOrphanedReferences(citations, references);
    const orphanedCitations = findOrphanedCitations(citations, references);

    output.innerHTML = `
      <p style="text-align: center; margin-bottom: 0;">
        Your text contains <strong>${citations.length}</strong> total (<strong>${unique.size}</strong> unique) in-text citation(s) and <strong>${references.length}</strong> reference(s).
      </p>`;

    output.innerHTML += `
      <p style="text-align: center; margin-bottom: 0;">
        Found <strong>${orphanedReferences.length}</strong> reference(s) that were never cited in-text.
      </p>`;
    orphanedReferences.forEach(reference => output.innerHTML += `<p>${reference}</p>`);

    output.innerHTML += `
      <p style="text-align: center; margin-bottom: 0;">
        Found <strong>${orphanedCitations.length}</strong> total (<strong>${findUnique(orphanedCitations).size}</strong> unique) in-text citation(s) that were not referenced.
      </p>`;
    orphanedCitations.forEach(citation => output.innerHTML += `
      <div role="button" class="ms-welcome__action ms-Button ms-Button--hero ms-font-sm">
        <span class="ms-Button-label citation-link">${citation}</span>
      </div>`);
  }).catch(console.log);
}

async function selectCitation(event: any) {
  if (!event.target.classList.contains('citation-link')) {
    return;
  }

  const citation = event.target.innerText.trim();

  return Word.run(async context => {
    const result = context.document.body.search(citation).load('text');
    await context.sync();

    result.items[0].select();
    await context.sync();
  }).catch(console.log);
}
