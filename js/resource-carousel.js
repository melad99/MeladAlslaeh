/* "Take This With You" resource carousel — vanilla JS, no library dependency.
   Native scroll-snap handles touch swipe; this just layers arrow/dot controls
   on top, and hides those controls automatically when there's only one card
   (nothing to navigate to). Add more .res-card elements to #resourceTrack in
   index.html and the controls activate on their own — no JS changes needed. */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var carousel = document.getElementById('resourceCarousel');
    var track = document.getElementById('resourceTrack');
    if (!carousel || !track) return;

    var cards = Array.prototype.slice.call(track.children);
    if (cards.length <= 1) {
      carousel.classList.add('single-item');
      return;
    }

    var prevBtn = document.getElementById('resourcePrev');
    var nextBtn = document.getElementById('resourceNext');
    var dotsWrap = document.getElementById('resourceDots');

    // Some browsers restore a scrollable element's previous scroll position on
    // reload/back-forward navigation, which can land the carousel on whatever
    // card it was last showing instead of the first one. Force it back to the
    // start on every load rather than trusting the browser's default.
    track.scrollLeft = 0;

    cards.forEach(function (_, i) {
      var dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('role', 'button');
      dot.setAttribute('tabindex', '0');
      dot.setAttribute('aria-label', 'Go to resource ' + (i + 1));
      dot.addEventListener('click', function () { scrollToCard(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function scrollToCard(i) {
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }

    function currentIndex() {
      var scrollLeft = track.scrollLeft;
      var closest = 0;
      var minDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    }

    function updateUI() {
      var i = currentIndex();
      dots.forEach(function (d, di) { d.classList.toggle('active', di === i); });
      prevBtn.disabled = i === 0;
      nextBtn.disabled = i === cards.length - 1;
    }

    prevBtn.addEventListener('click', function () { scrollToCard(Math.max(0, currentIndex() - 1)); });
    nextBtn.addEventListener('click', function () { scrollToCard(Math.min(cards.length - 1, currentIndex() + 1)); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(updateUI); });

    updateUI();
  });
})();
