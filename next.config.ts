import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        remotePatterns: [
            new URL('https://lh3.googleusercontent.com/**'),
            new URL('https://*.fbcdn.net/**'),
            {
                protocol: 'https',
                hostname: 'platform-lookaside.fbsbx.com',
            }], /* Allowing using profile images from google or fb logged-in */
    }
};

export default nextConfig;
