import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /join was a broken, unlinked duplicate of /reps — its form displayed
  // a success message without ever writing to the database (see
  // docs/adr/0003-join-route-consolidation.md). Its legitimate content
  // (agreement gate, industry field, fuller earnings breakdown) was
  // merged into /reps; this redirect protects any external link/bookmark
  // that still points at the old URL instead of silently 404ing.
  async redirects() {
    return [
      {
        source: "/join",
        destination: "/reps",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
