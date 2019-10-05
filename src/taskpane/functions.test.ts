import { findCitations, findUnique, parseWordParagraphs, findOrphanedReferences, findOrphanedCitations } from './functions';

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
});

describe(findUnique, () => {
  test('when given empty array, should return empty set', () => {
    // Act
    const unique = findUnique([]);

    // Assert
    expect(unique.size).toBe(0);
  });

  test('when given null, should return empty set', () => {
    // Act
    const unique = findUnique(null);

    // Assert
    expect(unique.size).toBe(0);
  });

  test('when given undefined, should return empty set', () => {
    // Act
    const unique = findUnique(undefined);

    // Assert
    expect(unique.size).toBe(0);
  });

  test('when given single reference, should return single element set', () => {
    // Act
    const unique = findUnique(['Doe (2019)']);

    // Assert
    expect(unique.size).toBe(1);
  });

  test('when given two references to the same source in a different format, should return single element set', () => {
    // Act
    const unique = findUnique(['Doe (2019)', '(Doe, 2019)']);

    // Assert
    expect(unique.size).toBe(1);
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
