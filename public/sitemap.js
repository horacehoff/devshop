import GenerateSitemap from "react-router-sitemap-maker";
import {MyRoutes} from "./routes.jsx";

const sitemapData = await GenerateSitemap(MyRoutes(), {
    baseUrl: "https://dev-shop.vercel.app",
    hashrouting: true,
    changeFrequency: "monthly"
});

sitemapData.toFile("./sitemap.xml");