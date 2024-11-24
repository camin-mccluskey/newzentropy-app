/**
 * Calculate the cosine similarity between two vectors.
 * @param vectorA - First vector (array of numbers)
 * @param vectorB - Second vector (array of numbers)
 * @returns The cosine similarity between the two vectors.
 */
export function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error('Vectors must have the same length')
  }

  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * (vectorB[i] ?? 0), 0)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0))

  if (magnitudeA === 0 || magnitudeB === 0) {
    throw new Error('Vectors must not be zero-length')
  }

  return dotProduct / (magnitudeA * magnitudeB)
}
