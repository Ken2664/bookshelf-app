/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['books.google.com','res.cloudinary.com'],
  },
}

module.exports = nextConfig
