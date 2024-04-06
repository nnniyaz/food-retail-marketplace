/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    swcMinify: true,
    rewrites: async () => {
        return {
            afterFiles: [{
                source: "/:path*",
                destination: "/not-found",
            }],
        }
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack"]
        });
        return config;
    },
};

export default nextConfig;
