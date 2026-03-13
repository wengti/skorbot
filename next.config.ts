import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    images: {
        domains: ['lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com'], /* Allowing using profile images from google or fb logged-in */
    }
};

export default nextConfig;
