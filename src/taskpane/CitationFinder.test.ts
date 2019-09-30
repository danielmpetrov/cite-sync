import CitationFinder from './CitationFinder';

describe('when passed empty string', () => {
  test('should have total 0', () => {
    // Arrange
    const sut = new CitationFinder('');

    // Assert
    expect(sut.total).toBe(0);
  });

  test('should have all 0', () => {
    // Arrange
    const sut = new CitationFinder('');

    // Act & Assert
    expect(sut.unique).toBe(0);
  });

  test('should have unique 0', () => {
    // Arrange
    const sut = new CitationFinder('');

    // Act & Assert
    expect(sut.all.length).toBe(0);
  });
});

test('should match passive single author citation', () => {
  // Arrange
  const sut = new CitationFinder('Jest is a delightful JavaScript Testing Framework with a focus on simplicity (Doe, 2019).');

  // Act
  expect(sut.all.length).toBe(1);
  expect(sut.all[0]).toBe('(Doe, 2019)');
});

test('should match active single author citation', () => {
  // Arrange
  const sut = new CitationFinder('Doe (2019) claims that Jest is a delightful JavaScript Testing Framework with a focus on simplicity.');

  // Act
  expect(sut.all.length).toBe(1);
  expect(sut.all[0]).toBe('Doe (2019)');
});
