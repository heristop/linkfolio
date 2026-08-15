/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    // The React Compiler's native port, run inside Turbopack rather than
    // through Babel on Node. Build-time only — the emitted code is the same.
    turbopackRustReactCompiler: true,
  },
  images: {
    qualities: [90, 100],
  },
};

module.exports = nextConfig;
