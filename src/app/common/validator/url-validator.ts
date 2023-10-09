export function isValidURL(url) {
  // URL'nin başında http:// veya https:// olmalı
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  // URL, boşluk veya çift tırnak içermemeli
  if (/\s/.test(url) || /"/.test(url)) {
    return false;
  }

  // URL geçerli kabul edilir
  return true;
}
