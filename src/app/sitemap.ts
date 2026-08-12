import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://plot.example.com/", lastModified: new Date() },
    { url: "https://plot.example.com/gardens", lastModified: new Date() },
    { url: "https://plot.example.com/gardens/new", lastModified: new Date() },
  ];
}
