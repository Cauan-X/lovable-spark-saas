(function () {
  var BADGE_SELECTORS = '#lovable-badge, a.lovable-badge, a[href*="utm_source=lovable-badge"]';
  try {
    var style = document.createElement("style");
    style.id = "ql-badge-remover";
    style.textContent = BADGE_SELECTORS + " { display: none !important; }";
    document.documentElement.appendChild(style);
  } catch (e) {}
  function hideBadges() {
    try {
      document.querySelectorAll(BADGE_SELECTORS).forEach(function (el) {
        el.style.display = "none";
        el.style.visibility = "hidden";
      });
    } catch (e) {}
  }
  hideBadges();
  try {
    var obs = new MutationObserver(hideBadges);
    obs.observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}
})();
