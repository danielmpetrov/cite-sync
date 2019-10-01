import { findCitations, findUnique } from './functions';

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
});

describe('findUnique', () => {
  test('when given empty array, should return empty set', () => {
    // Act
    const unique = findUnique([]);

    // Assert
    expect(unique.size).toBe(0);
  });
});
