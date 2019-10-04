import { parseWordParagraphs, findOrphanedReferences, findOrphanedCitations, extractCitations } from './functions';

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

const citationsHtml = (count: number): string => `<strong>${count}</strong> citation${count === 1 ? '' : 's'}`;
const referencesHtml = (count: number): string => `<strong>${count}</strong> reference${count === 1 ? '' : 's'}`;

async function analyze() {
  return Word.run(async context => {
    const wordParagraphs = context.document.body.paragraphs.load('text');
    await context.sync();

    const [paragraphs, references] = parseWordParagraphs(wordParagraphs.items);
    const citations = extractCitations(paragraphs);

    if (citations.length === 0 && references.length === 0) {
      output.innerHTML = `
        <p style="text-align: center; margin-bottom: 0;font-size: 18px;">
          Congratulations!
        </p>
        <p style="text-align: center; margin-bottom: 0;">
          Everything looks nice and synchronized.
        </p>
        <p style="text-align: center; margin-bottom: 0;">
          <img style="max-width: 200px;" src="../../assets/prize.png" alt="Certificate" title="Certificate" />
        </p>`;
      return;
    }

    const orphanedReferences = findOrphanedReferences(citations, references);
    const orphanedCitations = findOrphanedCitations(citations, references);

    output.innerHTML = `
      <p class="message message--success">
        <img class="message__icon" src="../../assets/info.svg" />
        <span class="message__text">
          Your text contains ${citationsHtml(citations.length)} and ${referencesHtml(references.length)}.
        </span>
      </p>`;

    renderOrphanedReferences(output, orphanedReferences);
    renderOrphanedCitations(output, orphanedCitations);
  }).catch(console.log);
}

function renderOrphanedReferences(output: HTMLElement, references: ReadonlyArray<string>) {
  if (references.length === 0) {
    return;
  }

  output.innerHTML += `
    <p class="message message--warning">
      <img class="message__icon" src="../../assets/alert-circle.svg" />
      <span class="message__text">
        Found ${referencesHtml(references.length)} that are not cited.
      </span>
    </p>`;

  if (references.length > 20) {
    output.innerHTML += `<p style="color: #888;">To keep things running smoothly, displaying the first 20 results only.</p>`;
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

  output.innerHTML += `
    <p class="message message--warning">
      <img class="message__icon" src="../../assets/alert-circle.svg" />
      <span class="message__text">
        Found ${citationsHtml(citations.length)} that are not referenced.
      </span>
    </p>`;

  if (citations.length > 20) {
    output.innerHTML += `<p style="color: #888;">To keep things running smoothly, displaying the first 20 results only.</p>`;
    for (let i = 0; i < 20; i++) {
      output.innerHTML += `
        <div role="button" class="ms-welcome__action ms-Button ms-Button--hero ms-font-sm">
          <span class="ms-Button-label citation-link">${citations[i]}</span>
        </div>`;
    }
  } else {
    citations.forEach(citation => output.innerHTML += `
      <div role="button" class="ms-welcome__action ms-Button ms-Button--hero ms-font-sm">
        <span class="ms-Button-label citation-link">${citation}</span>
      </div>`);
  }
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
