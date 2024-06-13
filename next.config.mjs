/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'ucarecdn.com',
        },
        {
          protocol: 'https',
          hostname: 'wordpress-1281916-4642466.cloudwaysapps.com',
        },
      ],
    },
  }
  
  export default nextConfig