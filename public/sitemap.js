import GenerateSitemap from "react-router-sitemap-maker";
import {MyRoutes} from "../src/routes";

const sitemapData = await GenerateSitemap(MyRoutes(), {
    baseUrl: "https://dev-shop.vercel.app",
    hashrouting: true,
    changeFrequency: "monthly"
});

sitemapData.toFile("./sitemap.xml");