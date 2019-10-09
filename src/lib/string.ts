import {
    defaultTo, replace, split, match, pipe, test, __, length, mathMod, equals, identity, ifElse, slice
} from 'ramda';

// Patterns
const parentheses = /[()]/g;
const twoOrMoreSpaces = / {2,}/g;
const citationElements = /[(),&]|[A-Z]\.|et al\.|and|p\. \d+/g;
const referencesTitle = /^(bibliography|references)$/gim;
const citation = /([A-Z\u00C0-\u00DE][a-z\u00DF-\u00FF]+(, |,? and | et al\.)?){1,3} \((\d{4}[a-z]?|n\.d\.)(, p\. \d+)?\)|\((([A-Z\u00C0-\u00DE][a-z\u00DF-\u00FF]+( |,? & |, |,? and | et al\.)?){1,3}, (\d{4}[a-z]?|n\.d\.)(, p\. \d+)?(; )?)+\)/g;

// https://www.smart-words.org/linking-words/transition-words.html
const oppositionWords = /although|instead|whereas|despite|conversely|otherwise|however|rather|nevertheless|nonetheless|regardless|notwithstanding/gi;
const agreementWords = /moreover|as well as|together with|of course|likewise|comparatively|correspondingly|similarly|furthermore|additionally/gi;
const exampleWords = /indeed|certainly|surely|markedly|such as|fact|general|particular|detail|example|instance|demonstrate|emphasize|repeat|clarify|explain|enumerate/gi;
const effectWords = /consequently|therefore|thereupon|forthwith|accordingly|henceforth/gi;

// Cleaners
export const removeCitationElements = replace(citationElements, '');
export const removeDoubleSpaces = replace(twoOrMoreSpaces, ' ');
export const removeLinkingWords = pipe(
    replace(oppositionWords, ''),
    replace(agreementWords, ''),
    replace(effectWords, ''),
    replace(exampleWords, ''),
);
const removeParentheses = replace(parentheses, '');
const hasOddNumberOfParentheses = pipe(match(parentheses), length, mathMod(__, 2), equals(1));
export const removeParenthesesIfOdd: (text: string) => string
    = ifElse(hasOddNumberOfParentheses, removeParentheses, identity);
export const clean: (citation: string) => string = pipe(removeCitationElements, removeDoubleSpaces);

// Matchers
export const matchCitations = match(citation);

// Defaults
export const defaultToEmptyString = defaultTo('');

// Splitters
export const splitBySpace = split(' ');
export const splitBySemicolon = split(';');
export const splitAtRemove =
    <T>(index: number, list: ReadonlyArray<T>): [ReadonlyArray<T>, ReadonlyArray<T>] => [slice(0, index, list), slice(index + 1, Infinity, list)];

// Predicates
export const isReferencesTitle = test(referencesTitle);
