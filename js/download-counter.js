/* Download counter for the "Take This With You" resource cards.
   Talks to netlify/functions/track-download.js (Netlify Blobs-backed). Fails
   silently and just leaves the counter hidden if the function isn't reachable
   (e.g. running locally without `netlify dev`, or a network hiccup) — a
   missing download count should never be a visible error on the page, and
   must never get in the way of the actual download link working. */
(function () {
  'use strict';

  var ENDPOINT = '/.netlify/functions/track-download';

  function label(count) {
    return count === 1 ? '1 download' : count + ' downloads';
  }

  function showCount(card, count) {
    var el = card.querySelector('.res-download-count');
    if (!el) return;
    el.textContent = label(count);
    el.hidden = false;
  }

  function fetchCount(id) {
    return fetch(ENDPOINT + '?id=' + encodeURIComponent(id))
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function recordDownload(id) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var cards = document.querySelectorAll('[data-download-id]');

    cards.forEach(function (card) {
      var id = card.getAttribute('data-download-id');
      var link = card.querySelector('a[download]');

      fetchCount(id).then(function (data) {
        if (data) showCount(card, data.count);
      });

      if (!link) return;

      link.addEventListener('click', function () {
        // One count per browser per resource — not a security measure (clearing
        // storage or using another browser resets it), just keeps a curious
        // visitor clicking the same button repeatedly from inflating the number.
        var storageKey = 'dl_counted_' + id;
        var alreadyCounted = false;
        try {
          alreadyCounted = !!localStorage.getItem(storageKey);
        } catch (e) {
          /* localStorage unavailable — just always count, no big deal here */
        }
        if (alreadyCounted) return;

        try {
          localStorage.setItem(storageKey, '1');
        } catch (e) {
          /* ignore — worst case this click gets counted again later */
        }
        recordDownload(id).then(function (data) {
          if (data) showCount(card, data.count);
        });
      });
    });
  });
})();
