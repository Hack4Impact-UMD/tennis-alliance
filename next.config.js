/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    eslint: {
        dirs: ["src"],
    },
    images: { unoptimized: true }
};

export default nextConfig;
