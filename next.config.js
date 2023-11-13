/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "export",
    eslint: {
        dirs: ["src"],
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
