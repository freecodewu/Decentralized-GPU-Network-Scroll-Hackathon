/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    webpack(config) {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@mui/material': '@mui/joy',
        }
        return config
    }
}

module.exports = nextConfig
