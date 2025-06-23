/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true, // Enable SWC minification
  experimental: {
    fonts: true, // Enable experimental font optimization
  },
  images: {
    domains: ["sageai-products.s3.ap-southeast-1.amazonaws.com"],
  },
};
export default nextConfig;
