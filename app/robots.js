export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://mousequetaire.com/sitemap.xml",
    other: "llms.txt: https://mousequetaire.com/llms.txt",
  };
}
