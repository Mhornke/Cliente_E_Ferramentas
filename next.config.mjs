// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'unsplash.com',
            'media.istockphoto.com',
            'istockphoto.com',
            'img.freepik.com' // Este é o domínio correto do Freepik para imagens
        ],
    },
};

export default nextConfig;
