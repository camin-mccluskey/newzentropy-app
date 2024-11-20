/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    // TODO: remove this when json-types-generator can generator non-any types
    ignoreDuringBuilds: true,
  },
}

export default config
