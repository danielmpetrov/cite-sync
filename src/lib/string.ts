import { defaultTo, replace, split, match, pipe, test } from 'ramda';

/**
 * Basic string functions
 */

const pattern = /([A-Z\u00C0-\u00DE][a-z\u00DF-\u00FF]+(, |,? and | et al\.)?){1,3} \((\d{4}[a-z]?|n\.d\.)(, p\. \d+)?\)|\((([A-Z\u00C0-\u00DE][a-z\u00DF-\u00FF]+( |,? & |, |,? and | et al\.)?){1,3}, (\d{4}[a-z]?|n\.d\.)(, p\. \d+)?(; )?)+\)/g;

export const defaultToEmptyString = defaultTo('');
export const removeCitationElements = replace(/\(|\)|,|[A-Z]\.|et al\.|and|&/g, '');
export const removeDoubleSpaces = replace(/ {2,}/g, ' ');
export const matchCitations = match(pattern);
export const splitBySpace = split(' ');
export const splitBySemicolon = split(';');
export const removeParentheses = replace(/\(|\)/g, '');
export const isReferencesTitle = test(/^(bibliography|references)$/gim);
export const clean: (citation: string) => string = pipe(removeCitationElements, removeDoubleSpaces);
