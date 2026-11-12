/* Stackly local scroll reveal engine: offline, no dependencies, small observer footprint */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = [];
  function revealAll() {
    targets.forEach(function (el) {
      el.classList.remove("motion-pending");
      el.classList.add("motion-visible");
    });
  }
  function init() {
    targets = Array.prototype.slice.call(document.querySelectorAll("[data-aos]"));
    if (!targets.length || reduceMotion || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }
    document.documentElement.classList.add("motion-ready");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("motion-pending");
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    targets.forEach(function (el) {
      var delay = parseInt(el.getAttribute("data-aos-delay") || "0", 10);
      el.style.setProperty("--motion-delay", Math.min(Math.max(delay, 0), 130) + "ms");
      el.classList.add("motion-pending");
      observer.observe(el);
    });
    // Safety net: content must never remain hidden if observer setup is interrupted.
    window.setTimeout(function () {
      targets.forEach(function (el) {
        if (el.classList.contains("motion-pending") && !document.documentElement.contains(el)) return;
        if (el.classList.contains("motion-pending") && el.getBoundingClientRect().top < window.innerHeight * 1.4) {
          el.classList.remove("motion-pending");
          el.classList.add("motion-visible");
          observer.unobserve(el);
        }
      });
    }, 1800);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();