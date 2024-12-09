/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dudlxsoui/**", // Matches all paths specific to your account
      },
    ],
  },
};

export default nextConfig;
