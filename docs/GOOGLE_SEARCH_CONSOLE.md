# Google Search Console Kurulumu

Site SEO altyapısı hazır. Google'da indekslenmek için şu adımları tamamlayın:

## 1. Search Console'a kayıt

1. [Google Search Console](https://search.google.com/search-console) adresine gidin
2. **Add property** → `https://emircanozdag.com` ekleyin
3. Doğrulama yöntemi olarak **DNS kaydı** (Vercel/domain sağlayıcınız) veya **HTML tag** kullanın

### HTML tag yöntemi (alternatif)

Search Console size bir meta tag verecek. `index.html` `<head>` bölümüne ekleyin:

```html
<meta name="google-site-verification" content="VERIFICATION_CODE" />
```

Deploy sonrası Search Console'da **Verify** tıklayın.

## 2. Sitemap gönderin

1. Search Console → **Sitemaps**
2. URL: `https://emircanozdag.com/sitemap.xml`
3. **Submit**

## 3. İndeksleme isteği

1. **URL Inspection** → `https://emircanozdag.com/` girin
2. **Request Indexing** tıklayın
3. Aynı işlemi `/myworks` ve `/play` için tekrarlayın

## 4. Performans takibi

- **Performance** sekmesinden hangi aramalarda göründüğünüzü izleyin
- **Pages** sekmesinden indekslenen sayfaları kontrol edin
- **Core Web Vitals** ile mobil performansı takip edin (Vercel Speed Insights ile birlikte kullanın)

## 5. Off-page SEO (sıralama için kritik)

- LinkedIn ve GitHub profillerinize `https://emircanozdag.com` linkini ekleyin
- Proje yazıları (Dev.to, Medium) yayınlayıp siteye link verin
- Tüm platformlarda aynı isim ve URL kullanın

## Mevcut SEO dosyaları

| Dosya | Açıklama |
|-------|----------|
| `public/robots.txt` | Crawler yönergeleri |
| `public/sitemap.xml` | Site haritası |
| `src/seo/siteSeo.ts` | Meta ve schema yapılandırması |
| `src/components/SeoHead.tsx` | Sayfa bazlı meta etiketleri |
| `src/components/SeoFooter.tsx` | İndekslenebilir site özeti |
