import { map, take, forEach, isEmpty } from 'ramda';

const citationsHtml = (count: number): string => `<strong>${count}</strong> citation${count === 1 ? '' : 's'}`;
const referencesHtml = (count: number): string => `<strong>${count}</strong> reference${count === 1 ? '' : 's'}`;

export const congratulations: string = `
  <p style="text-align: center; margin-bottom: 0;font-size: 18px;">
    Congratulations!
  </p>
  <p style="text-align: center; margin-bottom: 0;">
    Everything looks nice and synchronized.
  </p>
  <p style="text-align: center; margin-bottom: 0;">
    <img style="max-width: 200px;" src="../../assets/prize.png" alt="Certificate" title="Certificate" />
  </p>`;

const top20Warning: string = `
  <p class="message message--warning">
    <img class="message__icon" src="../../assets/alert-circle.svg" />
    <span class="message__text">Displaying top 20 results only.</span>
  </p>`;

export const info = (citationCount: number, referenceCount: number): string => `
  <p class="message message--info">
    <img class="message__icon" src="../../assets/info.svg" />
    <span class="message__text">
      Your text contains ${citationsHtml(citationCount)} and ${referencesHtml(referenceCount)}.
    </span>
  </p>`;

const citationErrors = (count: number): string => `
  <p class="message message--error">
    <img class="message__icon" src="../../assets/x-circle.svg" />
    <span class="message__text">
      Found ${citationsHtml(count)} that are not referenced.
    </span>
  </p>`;

const referenceErrors = (count: number): string => `
  <p class="message message--error">
    <img class="message__icon" src="../../assets/x-circle.svg" />
    <span class="message__text">
      Found ${referencesHtml(count)} that are not cited.
    </span>
  </p>`;

const citation = (citation: string): string => `
  <div role="button" class="ms-welcome__action ms-Button ms-Button--hero ms-font-sm">
    <span class="ms-Button-label citation-link">${citation}</span>
  </div>`;

const reference = (reference: string): string => `<p>${reference}</p>`;

const top20 = take(20);

export function renderOrphanedReferences(render: (html: string) => string, references: ReadonlyArray<string>) {
  if (isEmpty(references)) {
    return;
  }

  render(referenceErrors(references.length));

  if (references.length > 20) {
    render(top20Warning);
  }

  forEach(render, map(reference, top20(references)));
}

export function renderOrphanedCitations(render: (html: string) => string, citations: ReadonlyArray<string>) {
  if (isEmpty(citations)) {
    return;
  }

  render(citationErrors(citations.length));

  if (citations.length > 20) {
    render(top20Warning);
  }

  forEach(render, map(citation, top20(citations)));
}
