await import("./src/env.mjs");
import { withAxiom } from "next-axiom";

export default withAxiom({
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org/**",
      },
    ],
  },
});
