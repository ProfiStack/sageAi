/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Enable SWC minification
  experimental: {
    fonts: true, // Enable experimental font optimization
  },
  images: {
    domains: ["nemat.s3.eu-north-1.amazonaws.com"],
  },
};
export default nextConfig;
