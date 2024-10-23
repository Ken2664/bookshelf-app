/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['books.google.com', 'res.cloudinary.com'],
  },
};

export default nextConfig;
