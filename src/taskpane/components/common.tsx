import { take } from 'ramda';
import * as React from 'react';

const CitationsHtml = (props: { count: number }) =>
  <>
    <strong>{props.count}</strong> citation{props.count === 1 ? '' : 's'}
  </>;

const ReferencesHtml = (props: { count: number }) =>
  <>
    <strong>{props.count}</strong> reference{props.count === 1 ? '' : 's'}
  </>;

export const Welcome = () =>
  <div>
    <p style={{ textAlign: 'center', marginBottom: 0 }}>
      Write your document and press <b>Run Analysis</b>.
    </p>
    <p style={{ textAlign: 'center', marginBottom: 0 }}>
      <img style={{ maxWidth: 180 }} src="../../assets/hands.png" alt="Hands" title="Hands" />
    </p>
  </div>;

export const Congratulations = () =>
  <>
    <p style={{ textAlign: 'center', marginBottom: 0, fontSize: 18 }}>
      Congratulations!
    </p>
    <p style={{ textAlign: 'center', marginBottom: 0 }}>
      Everything looks nice and synchronized.
    </p>
    <p style={{ textAlign: 'center', marginBottom: 0 }}>
      <img style={{ maxWidth: 200 }} src="../../assets/prize.png" alt="Certificate" title="Certificate" />
    </p>
  </>;

export const Warning = () =>
  <p className="message message--warning">
    <img className="message__icon" src="../../assets/alert-circle.svg" />
    <span className="message__text">Displaying top 20 results only.</span>
  </p>;

export const Info = (props: { citationCount: number; referenceCount: number; }) =>
  <p className="message message--info">
    <img className="message__icon" src="../../assets/info.svg" />
    <span className="message__text">
      Your text contains <CitationsHtml count={props.citationCount} /> and <ReferencesHtml count={props.referenceCount} />.
    </span>
  </p>;

export const CitationErrors = (props: { count: number }) =>
  <p className="message message--error">
    <img className="message__icon" src="../../assets/x-circle.svg" />
    <span className="message__text">
      Found <CitationsHtml count={props.count} /> that are not referenced.
    </span>
  </p>;

export const ReferenceErrors = (props: { count: number }) =>
  <p className="message message--error">
    <img className="message__icon" src="../../assets/x-circle.svg" />
    <span className="message__text">
      Found <ReferencesHtml count={props.count} /> that are not cited.
    </span>
  </p>;

export const Citation = (props: { citation: string }) =>
  <div role="button" className="ms-welcome__action ms-Button ms-Button--hero ms-font-sm">
    <span className="ms-Button-label citation-link">{props.citation}</span>
  </div>;

export const Reference = (props: { reference: string }) => <p>{props.reference}</p>;
export const top20 = take(20);
