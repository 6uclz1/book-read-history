/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbnail.image.rakuten.co.jp',
        port: '',
        pathname: '/**/**/**/**',
      },
      {
        protocol: 'http',
        hostname: 'thumbnail.image.rakuten.co.jp',
        port: '',
        pathname: '/**/**/**/**/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**/**/**',
      },
      {
        protocol: 'https',
        hostname: 'tshop.r10s.jp',
        port: '',
        pathname: '/**/**/**/**',
      },
      {
        protocol: 'https',
        hostname: 'images-fe.ssl-images-amazon.com',
        port: '',
        pathname: '/**/**/**',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/**/**/**',
      },
    ],
  },
}

module.exports = nextConfig
