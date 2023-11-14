/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
      },
    output: "export",
    eslint: {
        dirs: ["src"],
    },
};

export default nextConfig;
