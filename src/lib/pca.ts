export class PCA {
  private components: number[][] = []
  private means: number[] = []

  fit(data: number[][]): void {
    const firstRow = data[0]
    if (!firstRow) {
      throw new Error('Data array cannot be empty')
    }

    // Calculate means
    const n = data.length
    const d = firstRow.length
    this.means = Array(d).fill(0) as number[]

    for (const row of data) {
      if (row.length !== d) {
        throw new Error('All input vectors must have the same dimension')
      }
      row.forEach((val, j) => {
        const mean = this.means[j]
        if (mean !== undefined) {
          this.means[j] = mean + val
        }
      })
    }

    this.means = this.means.map((m) => m / n)

    // Center the data
    const centered = data.map((row) =>
      row.map((val, i) => {
        const mean = this.means[i]
        return mean !== undefined ? val - mean : 0
      }),
    )

    // Compute covariance matrix
    const covariance = Array(d)
      .fill(0)
      .map(() => Array(d).fill(0) as number[])

    for (let i = 0; i < d; i++) {
      for (let j = i; j < d; j++) {
        let sum = 0
        for (const row of centered) {
          const val1 = row[i]
          const val2 = row[j]
          if (val1 !== undefined && val2 !== undefined) {
            sum += val1 * val2
          }
        }
        const cov = sum / (n - 1)
        const covRow = covariance[i]
        const covRowJ = covariance[j]
        if (covRow !== undefined && covRowJ !== undefined) {
          covRow[j] = cov
          covRowJ[i] = cov
        }
      }
    }

    // Power iteration to find principal components
    const numComponents = 3
    this.components = []

    for (let k = 0; k < numComponents; k++) {
      // Initialize eigenvector
      let eigenvector = Array(d).fill(1) as number[]

      // Normalize
      const getSquaredSum = (vec: number[]) =>
        vec.reduce((sum, val) => (val !== undefined ? sum + val * val : sum), 0)

      let norm = Math.sqrt(getSquaredSum(eigenvector))
      eigenvector = eigenvector.map((v) => v / norm)

      // Power iteration
      for (let iter = 0; iter < 50; iter++) {
        const newVector = Array(d).fill(0) as number[]

        for (let i = 0; i < d; i++) {
          const newVecI = newVector[i]
          const covRow = covariance[i]
          if (newVecI !== undefined && covRow !== undefined) {
            let sum = 0
            for (let j = 0; j < d; j++) {
              const covIJ = covRow[j]
              const eigenJ = eigenvector[j]
              if (covIJ !== undefined && eigenJ !== undefined) {
                sum += covIJ * eigenJ
              }
            }
            newVector[i] = sum
          }
        }

        norm = Math.sqrt(getSquaredSum(newVector))
        eigenvector = newVector.map((v) => v / norm)
      }

      this.components.push(eigenvector)

      // Deflate covariance matrix
      for (let i = 0; i < d; i++) {
        const eigenI = eigenvector[i]
        const covRow = covariance[i]
        if (eigenI !== undefined && covRow !== undefined) {
          for (let j = 0; j < d; j++) {
            const eigenJ = eigenvector[j]
            const covIJ = covRow[j]
            if (eigenJ !== undefined && covIJ !== undefined) {
              covRow[j] = covIJ - eigenI * eigenJ
            }
          }
        }
      }
    }
  }

  transform(data: number[][]): number[][] {
    return data.map((row) => {
      // Center the data point
      const centered = row.map((val, i) => {
        const mean = this.means[i]
        return mean !== undefined ? val - mean : 0
      })

      // Project onto principal components
      return this.components.map((comp) => {
        let sum = 0
        for (let i = 0; i < centered.length; i++) {
          const centeredI = centered[i]
          const compI = comp[i]
          if (centeredI !== undefined && compI !== undefined) {
            sum += centeredI * compI
          }
        }
        return sum
      })
    })
  }
}

// Example usage with type safety:
// const data: number[][] = [
//     [1, 2, 3, 4],
//     [2, 4, 6, 8],
//     [3, 6, 9, 12]
// ];
//
// try {
//     const pca = new PCA();
//     pca.fit(data);
//     const reduced = pca.transform(data);
//     console.log('Reduced dimensions:', reduced);
// } catch (error) {
//     console.error('PCA error:', error);
// }
