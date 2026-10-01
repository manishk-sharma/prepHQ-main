import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";

const BASE_URL = "https://prephq.theiotacademy.co";

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/practice",
  "/terms-and-conditions",
  "/privacy-policy",
  // "/search",

  // Domains
  "/data-science",
  "/embedded-and-iot",
  "/artificial-intelligence-genai",
  "/machine-learning",
  "/cyber-security",
  "/database-management",
  "/system-design",
  "/data-analytics",
  "/quantum-computing",
  "/blockchain-and-web3",
  "/edge-computing",
  "/extended-reality",
  "/5g",
  "/digital-twin-technologies",
  "/robotics-and-automation",
];

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream("./public/sitemap.xml");

  publicRoutes.forEach(route => {
    sitemap.write({
      url: route,
      changefreq: "weekly",
      priority: route === "/" ? 1.0 : 0.8,
    });
  });

  sitemap.end();

  const xml = await streamToPromise(sitemap);
  writeStream.write(xml.toString());

  console.log("Sitemap generated successfully");
}

generateSitemap();
