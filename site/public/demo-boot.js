if (new URLSearchParams(location.search).get('demo') === '1') {
  document.documentElement.classList.add('demo-loading');
  window.setTimeout(() => document.documentElement.classList.remove('demo-loading'), 3000);
}
