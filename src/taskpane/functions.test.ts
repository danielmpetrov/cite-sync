import { findCitations, findUnique } from './functions';

// ???
// https://guides.libraries.psu.edu/apaquickguide/intext
// multiple citations, e.g. (Derwing, Rossiter, & Munro, 2002; Thomas, 2004)
// page number, e.g. (Field, 2005, p. 14)
// not dated, e.g (Smith, n.d.)

describe('findCitations', () => {
  test('when given empty string, should return empty array', () => {
    // Act
    const citations = findCitations('');

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
});

describe('findUnique', () => {
  test('when given empty array, should return empty set', () => {
    // Act
    const unique = findUnique([]);

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
