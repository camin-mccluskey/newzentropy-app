import { cosineSimilarity } from '../cosine-similarity'
import { OCEAN_BASIS_VECTORS } from './interpretability-data'

export function mapToOcean(userPreference: number[]) {
  return {
    openness: calculateTraitSimilarity(userPreference, OCEAN_BASIS_VECTORS.openness),
    conscientiousness: calculateTraitSimilarity(
      userPreference,
      OCEAN_BASIS_VECTORS.conscientiousness,
    ),
    extraversion: calculateTraitSimilarity(userPreference, OCEAN_BASIS_VECTORS.extraversion),
    agreeableness: calculateTraitSimilarity(userPreference, OCEAN_BASIS_VECTORS.agreeableness),
    neuroticism: calculateTraitSimilarity(userPreference, OCEAN_BASIS_VECTORS.neuroticism),
  }
}

type Trait = {
  positive: number[]
  negative: number[]
}

const calculateTraitSimilarity = (userPreference: number[], trait: Trait) => {
  const { positive, negative } = trait
  const positiveTraitSimilarity = cosineSimilarity(userPreference, positive)
  const negativeTraitSimilarity = cosineSimilarity(userPreference, negative)
  return (positiveTraitSimilarity - negativeTraitSimilarity + 1) / 2
}
