import Script from "next/script";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  return (
    <>
      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href^="tel:"],a[data-track^="tel"]');if(!a)return;gtag('event','click',{event_category:'telephone',event_label:a.getAttribute('data-track')||a.getAttribute('href')});});`}
          </Script>
        </>
      ) : null}
      {!gaId ? (
        <Script id="tel-track" strategy="lazyOnload">
          {`document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[data-track^="tel"]');if(!a||!window.plausible)return;window.plausible('Telephone Click',{props:{id:a.getAttribute('data-track')}});});`}
        </Script>
      ) : null}
    </>
  );
}
