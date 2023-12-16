/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
    ],
  },
  transpilePackages: ["baby-log-api"],
  async redirects() {
    return [
      {
        source: "/",
        destination: `/today`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
