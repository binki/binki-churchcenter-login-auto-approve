// ==UserScript==
// @name binki-churchcenter-login-auto-approve
// @homepageURL https://github.com/binki/binki-churchcenter-login-auto-approve
// @version 1.0.2
// @match https://*.churchcenter.com/*
// @require https://raw.githubusercontent.com/binki/binki-userscript-when-element-changed-async/88cf57674ab8fcaa0e86bdf5209342ec7780739a/binki-userscript-when-element-changed-async.js
// ==/UserScript==

(async () => {
  while (true) {
    // Wait for the URL to be right.
    if (window.location.pathname.startsWith('/login')) {
      // There is really no programmatic clue as to what the right button to click is. Try our best?
      const mainPageContent = document.getElementById('main_page_content');
      if (mainPageContent && mainPageContent.querySelectorAll('input').length === 0 && mainPageContent.querySelectorAll('button').length === 2 && mainPageContent.querySelectorAll('button > span').length === 1) {
        const button = mainPageContent.querySelector('button');
        console.log('found login button, clicking…');
        button.click();
        console.log('clicked!');
        // Have to wait for the page to do something else. Otherwise, we end up in an infinite click
        // loop and the page never advances.
        //
        // If we had a false positive on the button and clicked something random, then holding off until
        // we’re no longer in /login might let the user do whatever it is that they needed to do.
        while (window.location.pathname.startsWith('/login')) {
          await whenElementChangedAsync(document.body);
        }
      }
    }
    // Wait for something to change before checking again. Ideally we’d be hooking into some sort of navigation
    // event, but there is no such thing (popstate doesn’t get called when pushState or replaceState are called).
    await whenElementChangedAsync(document.body);
  }
})();
