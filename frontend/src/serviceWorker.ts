// @ts-ignore
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./custom-sw.js');
  });
}
