// ==UserScript==
// @name binki-churchcenter-login-auto-approve
// @version 1.0.0
// @match https://*.churchcenter.com/*
// @require https://raw.githubusercontent.com/binki/binki-userscript-when-element-changed-async/88cf57674ab8fcaa0e86bdf5209342ec7780739a/binki-userscript-when-element-changed-async.js
// @require https://raw.githubusercontent.com/binki/binki-userscript-when-event-dispatched-async/0daa1c0c3501aeba7132d520aa8f389e0627aba6/binki-userscript-when-event-dispatched-async.js
// ==/UserScript==

(async () => {
  while (true) {
    // Wait for the URL to be right.
    while (true) {
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
            await whenEventDisaptchedAsync(window, 'popstate');
          }
        } else {
          await whenElementChangedAsync(document.body);
        }
      } else {
        await whenEventDispatchedAsync(window, 'popstate');
      }
    }
  }
})();
