/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// }

//module.exports = nextConfig

const nextConfig = {
  
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'coffee-defiant-crocodile-721.mypinata.cloud',
          port: '',
          pathname: '/**',
        },
      ],
    },
  
}
module.exports = nextConfig