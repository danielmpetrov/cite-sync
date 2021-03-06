import { findCitations, parseWordParagraphs, findOrphanedReferences, findOrphanedCitations } from './functions';

// https://guides.libraries.psu.edu/apaquickguide/intext
describe(findCitations, () => {
  test('when given empty string, should return empty array', () => {
    // Act
    const citations = findCitations('');

    // Assert
    expect(citations.length).toBe(0);
  });

  test('when given undefined, should return empty array', () => {
    // Act
    const citations = findCitations(undefined);

    // Assert
    expect(citations.length).toBe(0);
  });

  test('when given null, should return empty array', () => {
    // Act
    const citations = findCitations(null);

    // Assert
    expect(citations.length).toBe(0);
  });

  test('should match passive single author citation', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Doe, 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Doe, 2019)');
  });

  test('should match active single author citation', () => {
    // Act
    const citations = findCitations('Doe (2019) claims that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Doe (2019)');
  });

  test('should match passive double author citation', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Doe and Borg, 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Doe and Borg, 2019)');
  });

  test('should match passive double author citation using "&" instead of "and"', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Doe & Borg, 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Doe & Borg, 2019)');
  });

  test('should match active double author citation', () => {
    // Act
    const citations = findCitations('Doe and Borg (2019) claim that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Doe and Borg (2019)');
  });

  test('should match passive triple author citation', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Joe, Doe and Borg, 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Joe, Doe and Borg, 2019)');
  });

  test('should match active triple author citation', () => {
    // Act
    const citations = findCitations('Joe, Doe and Borg (2019) claim that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Joe, Doe and Borg (2019)');
  });

  test('should match passive triple author citation with oxford comma', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Joe, Doe, and Borg, 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Joe, Doe, and Borg, 2019)');
  });

  test('should match active triple author citation with oxford comma', () => {
    // Act
    const citations = findCitations('Joe, Doe, and Borg (2019) claim that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Joe, Doe, and Borg (2019)');
  });

  test('should match passive et al. citation', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Doe et al., 2019).');

    // Act
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Doe et al., 2019)');
  });

  test('should match active et al. author citation', () => {
    // Act
    const citations = findCitations('Doe et al. (2019) claim that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Doe et al. (2019)');
  });

  test('should match multiple citation separated by ;', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Derwing, Rossiter and Munro, 2002; Thomas, 2004).');

    // Assert
    expect(citations.length).toBe(2);
    expect(citations[0]).toBe('Derwing, Rossiter and Munro, 2002');
    expect(citations[1]).toBe('Thomas, 2004');
  });

  test('should match passive citation with page number', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Field, 2005, p. 14).');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Field, 2005, p. 14)');
  });

  test('should match active citation with page number', () => {
    // Act
    const citations = findCitations('Field (2005, p. 14) claims that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Field (2005, p. 14)');
  });

  test('should match not dated passive citation', () => {
    // Act
    const citations = findCitations('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Smith, n.d.).');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Smith, n.d.)');
  });

  test('should match not dated active citation', () => {
    // Act
    const citations = findCitations('Smith (n.d.) claims that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Smith (n.d.)');
  });

  test('should match citation using the "a,b,c" system', () => {
    const citations = findCitations('Low job satisfaction may increase the likelihood of dysfunctional practices such as premature signing-off (Al Shbail et al., 2018b).');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Al Shbail et al., 2018b)');
  });

  test('should match citation with accidental double space and return it without the space', () => {
    const citations = findCitations('[...] Personal Resilience and Resilient Relationships (PRRR) program (Waite and  Richardson, 2004).');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('(Waite and Richardson, 2004)');
  });

  test('should match citation using characters from the Latin-1 Supplement block', () => {
    const citations = findCitations('As a result, it is in the organisation’s interest to encourage ethical behaviour whilst discouraging unethical conduct (Treviño et al., 1998). Formal systems include leadership, authority structures, systems for rewards and penalties, and training efforts (Svanberg and Öhman, 2013).');

    // Assert
    expect(citations.length).toBe(2);
    expect(citations[0]).toBe('(Treviño et al., 1998)');
    expect(citations[1]).toBe('(Svanberg and Öhman, 2013)');
  });

  test('should not match lowercase word as part of the citation', () => {
    // Act
    const citations = findCitations('In fact, Johansen and Christoffersen (2017) suggest that performance evaluation...');

    // Assert
    expect(citations.length).toBe(1);
    expect(citations[0]).toBe('Johansen and Christoffersen (2017)');
  });
});

describe(parseWordParagraphs, () => {
  test('when given empty array, should return empty paragraphs and references', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs([]);

    // Assert
    expect(paragraphs.length).toBe(0);
    expect(references.length).toBe(0);
  });

  test('when given undefined, should return empty paragraphs and references', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs(undefined);

    // Assert
    expect(paragraphs.length).toBe(0);
    expect(references.length).toBe(0);
  });

  test('when given null, should return empty paragraphs and references', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs(null);

    // Assert
    expect(paragraphs.length).toBe(0);
    expect(references.length).toBe(0);
  });

  test('when given no references title, should return empty references array', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs([
      { text: 'Once upon a time' },
      { text: 'There was a paragraph' }
    ]);

    // Assert
    expect(paragraphs.length).toBe(2);
    expect(references.length).toBe(0);
  });

  test('when given references title, but no references, should return empty references array', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs([
      { text: 'Once upon a time' },
      { text: 'There was a paragraph' },
      { text: 'References' }
    ]);

    // Assert
    expect(paragraphs.length).toBe(2);
    expect(references.length).toBe(0);
  });

  test('when given references title and references, should return correct paragraphs and references', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs([
      { text: 'Once upon a time' },
      { text: 'There was a paragraph' },
      { text: 'References' },
      { text: 'Joe Doe, 2019...' }
    ]);

    // Assert
    expect(paragraphs.length).toBe(2);
    expect(references.length).toBe(1);
  });

  test('when given only references, should return empty paragraphs', () => {
    // Act
    const [paragraphs, references] = parseWordParagraphs([
      { text: 'References' },
      { text: 'Once upon a time' },
      { text: 'There was a paragraph' },
      { text: 'Joe Doe, 2019...' }
    ]);

    // Assert
    expect(paragraphs.length).toBe(0);
    expect(references.length).toBe(3);
  });
});

describe(findOrphanedCitations, () => {
  test('when citation is referenced, should return empty array', () => {
    // Act
    const citations = [
      '(Alsmadi and Gan, 2019)'
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(0);
  });

  test('when citation is referenced and reference contains double space, should return empty array', () => {
    // Act
    const citations = [
      '(Alsmadi and Gan, 2019)'
    ];
    const references = [
      'Alsmadi, I. and  Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(0);
  });

  test('when citation is not referenced, should return array with the orphaned citation', () => {
    // Act
    const citations = [
      '(Doe, 2019)'
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(1);
    expect(orphanedCitations[0]).toBe('(Doe, 2019)');
  });

  test('when citation is referenced with double initials, should return empty array', () => {
    // Act
    const citations = [
      'Jones (1991)'
    ];
    const references = [
      'Jones, T.M. 1991, "Ethical decision making by individual in organisations: an issue-contingent model", Academy of Management Review, vol. 16, no. 2, pp. 366-395.'
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(0);
  });

  test('when citation is referenced and multiple references are present, should return empty array', () => {
    // Act
    const citations = [
      'Jones (1991)'
    ];
    const references = [
      'Jones, T.M. 1991, "Ethical decision making by individual in organisations: an issue-contingent model", Academy of Management Review, vol. 16, no. 2, pp. 366-395.',
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.',
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(0);
  });

  test('when citation containing et al. is referenced, should return empty array', () => {
    // Act
    const citations = [
      'Kelley et al. (1992)'
    ];
    const references = [
      'Kelley, T., Margheim, L. and Pattison, D. 1992, “Survey on the differential effects of time deadline pressure versus time budget pressure on auditor behaviour”, The Journal of Applied Business Research, vol. 15, no. 4, pp. 117-128.'
    ];
    const orphanedCitations = findOrphanedCitations(citations, references);

    // Assert
    expect(orphanedCitations.length).toBe(0);
  });
});

describe(findOrphanedReferences, () => {
  test('when reference is cited, should return empty array', () => {
    // Act
    const citations = [
      '(Alsmadi and Gan, 2019)'
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(0);
  });

  test('when reference is cited and citation contains double space, should return empty array', () => {
    // Act
    const citations = [
      '(Alsmadi and  Gan, 2019)'
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(0);
  });

  test('when reference is cited and multiple citations are present, should return empty array', () => {
    // Act
    const citations = [
      '(Alsmadi and Gan, 2019)',
      'Jones (1991)',
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(0);
  });

  test('when reference with et al. is cited, should return empty array', () => {
    // Act
    const citations = [
      '(Al Shbail et al., 2018b)'
    ];
    const references = [
      'Al Shbail, M., Salleh, Z. and Mohd Nor, M.N. 2018b, "Antecedents of Burnout and its Relationship to Internal Audit Quality", Business and Economic Horizons, vol. 14, no. 4, pp. 789-817, doi: 10.15208/beh.2018.55.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(0);
  });

  test('when reference with page number is cited, should return empty array', () => {
    // Act
    const citations = [
      'Girdano and Everly (1986, p. 5)'
    ];
    const references = [
      // reference does not contain page number
      'Girdano, D. and Everly, G.S. 1986, Controlling stress and tension. (2nd ed.), Prentice-Hall, Englewood Cliffs, NJ.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(0);
  });

  test('when reference is not cited, should return array with the orphaned reference', () => {
    // Act
    const citations = [
      '(Doe, 2019)'
    ];
    const references = [
      'Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.'
    ];
    const orphanedReferences = findOrphanedReferences(citations, references);

    // Assert
    expect(orphanedReferences.length).toBe(1);
    expect(orphanedReferences[0]).toBe('Alsmadi, I. and Gan, K. (2019). Review of short-text classification. International Journal of Web Information Systems.');
  });
});
