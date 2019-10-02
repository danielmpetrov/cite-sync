import { findCitations, findUnique, htmlMessage, parseWordParagraphs } from './functions';

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
    expect(citations[0]).toBe('(Derwing, Rossiter and Munro, 2002)');
    expect(citations[1]).toBe('(Thomas, 2004)');
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

describe(htmlMessage, () => {
  test('when given no citations, should return correct message', () => {
    // Act
    const message = htmlMessage(0, 0);

    // Assert
    expect(message).toBe('Found <strong>0</strong> total (<strong>0</strong> unique) in-text citations.');
  });

  test('when given single citation, should return correct message', () => {
    // Act
    const message = htmlMessage(1, 1);

    // Assert
    expect(message).toBe('Found <strong>1</strong> total (<strong>1</strong> unique) in-text citation.');
  });

  test('when given multiple citations, should return correct message', () => {
    // Act
    const message = htmlMessage(5, 3);

    // Assert
    expect(message).toBe('Found <strong>5</strong> total (<strong>3</strong> unique) in-text citations.');
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
