/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Same ImageKit account Andrew's photos and logo are hosted on.
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/mkvu8hdr5/**",
      },
    ],
  },
};

export default nextConfig;
