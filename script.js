(async () => {
  const res = await fetch(window.faqAPI + "/faqs/" + window.faqProjectID + `?path=${encodeURIComponent(window.location.pathname)}`);
  if (res.status !== 200) {
    console.error(`FAQ fetch failed status ${res.status}: ${await res.text()}`)
    return;
  }
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = await res.text();
  document.head.appendChild(script);
})()
