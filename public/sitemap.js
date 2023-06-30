import GenerateSitemap from "react-router-sitemap-maker";
import {Routes} from "../src/routes.jsx";

const sitemapData = await GenerateSitemap(Routes(), {
    baseUrl: "https://dev-shop.vercel.app",
    hashrouting: true,
    changeFrequency: "monthly"
});

sitemapData.toFile("./sitemap.xml");