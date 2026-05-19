import { Helmet } from "react-helmet-async";
import {
  DEFAULT_OG_IMAGE,
  getCanonicalUrl,
  getCreativeWorkListSchema,
  getPersonSchema,
  getProfilePageSchema,
  getWebSiteSchema,
  seoPages,
  SITE_NAME,
  type SeoPageKey,
} from "../seo/siteSeo";

interface SeoHeadProps {
  page: SeoPageKey;
}

const SeoHead = ({ page }: SeoHeadProps) => {
  const { title, description, path, keywords } = seoPages[page];
  const canonical = getCanonicalUrl(path);

  const jsonLd =
    page === "home"
      ? [getPersonSchema(), getWebSiteSchema(), getProfilePageSchema()]
      : page === "myworks"
        ? [getCreativeWorkListSchema(), getPersonSchema()]
        : [getPersonSchema()];

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:alt" content={`${SITE_NAME} - AI & Full-Stack Developer`} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} - AI & Full-Stack Developer`} />

      {jsonLd.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SeoHead;
