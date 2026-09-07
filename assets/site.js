/* RawBlock site scripts: reveal, mega menu, mobile drawer, calculator, filter. */

document.addEventListener("DOMContentLoaded", function () {
  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll("[data-reveal], .reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Header hide on scroll down ---- */
  var header = document.getElementById("siteHeader");
  var lastY = window.scrollY;
  if (header) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y > 120 && y > lastY) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
      lastY = y;
    }, { passive: true });
  }

  /* ---- Mega menu ---- */
  var megaBtn = document.querySelector("[data-mega]");
  var mega = megaBtn ? megaBtn.closest(".mega") : null;
  if (megaBtn && mega) {
    megaBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = mega.classList.toggle("open");
      megaBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!mega.contains(e.target)) { mega.classList.remove("open"); megaBtn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- Mobile drawer ---- */
  var burger = document.getElementById("burgerBtn");
  var drawer = document.getElementById("mobileNav");
  if (burger && drawer) {
    var setOpen = function (open) {
      drawer.classList.toggle("open", open);
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () { setOpen(!drawer.classList.contains("open")); });
    drawer.querySelectorAll("[data-mnav-close]").forEach(function (el) {
      el.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setOpen(false); });
  }

  /* ---- Filament calculator ---- */
  var calc = document.getElementById("filament-calc");
  if (calc) {
    var mat = {
      pla:  { name: "PLA",  density: 1.24 },
      abs:  { name: "ABS",  density: 1.04 },
      petg: { name: "PETG", density: 1.27 },
      tpu:  { name: "TPU",  density: 1.21 }
    };
    var el = function (id) { return calc.querySelector("#" + id); };
    var W = el("calc-w"), H = el("calc-h"), D = el("calc-d");
    var INFILL = el("calc-infill"), MAT = el("calc-material");
    var outMass = el("calc-mass"), outLen = el("calc-length"), outVol = el("calc-vol");
    var DIAM = 1.75;
    var WASTE = 1.10;

    function fmt(n) {
      if (!isFinite(n) || n <= 0) return "—";
      if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
      if (n >= 10) return n.toFixed(1);
      return n.toFixed(2);
    }
    function recompute() {
      var w = parseFloat(W.value) || 0, h = parseFloat(H.value) || 0, d = parseFloat(D.value) || 0;
      var infill = (parseFloat(INFILL.value) || 0) / 100;
      var m = mat[MAT.value] || mat.pla;
      var bbox = w * h * d;
      var part = bbox * infill;
      var mass = part * m.density / 1000 * WASTE;
      var area = Math.PI * (DIAM / 2) * (DIAM / 2);
      var lenMm = (mass / m.density) * 1000 / area;
      outVol.textContent = fmt(bbox) + " mm³";
      outMass.textContent = fmt(mass) + " g";
      outLen.textContent = fmt(lenMm / 1000) + " m";
    }
    [W, H, D, INFILL, MAT].forEach(function (n) { if (n) n.addEventListener("input", recompute); });
    recompute();
  }

  /* ---- Category filter ---- */
  var fi = document.querySelector("[data-filter]");
  var grid = document.querySelector("[data-grid]");
  if (fi && grid) {
    fi.addEventListener("input", function () {
      var q = this.value.toLowerCase();
      grid.querySelectorAll(".product-card").forEach(function (c) {
        var t = c.querySelector("h3").textContent.toLowerCase();
        c.style.display = t.indexOf(q) > -1 ? "" : "none";
      });
    });
  }

  /* ---- Hero word swap ---- */
  document.querySelectorAll(".swap").forEach(function (sw) {
    var words = sw.querySelectorAll(".word");
    if (words.length < 2) return;
    var i = 0;
    setInterval(function () {
      words[i].classList.remove("on");
      i = (i + 1) % words.length;
      words[i].classList.add("on");
    }, 2200);
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-q>button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var q = btn.parentElement;
      var open = q.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
});
