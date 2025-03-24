import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MATCHAI",
    short_name: "MATCHAI",
    description: "集合がもっと楽になるアプリ",
    start_url: "/",
    display: "standalone",
    theme_color: "#8936FF",
    background_color: "#2EC6FE",
    "icons": [
      {
        "purpose": "maskable",
        "sizes": "512x512",
        "src": "icon512_maskable.png",
        "type": "image/png",
      },
      {
        "purpose": "any",
        "sizes": "512x512",
        "src": "icon512_rounded.png",
        "type": "image/png",
      },
    ],
  };
}
