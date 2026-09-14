/* ============================================================
   SOAMIQ — shared app: renders header/footer + page content
   from window.SOAMIQ (data.js) and wires up Apple-style motion.
   ============================================================ */
(function () {
  "use strict";
  var D = window.SOAMIQ || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function brandMarkup(slotClass) {
    // Logo slot: existing repo wordmark as temporary placeholder.
    // Do not invent or redesign the Soamiq mark — swap file when official arrives.
    var cls = "logo-slot" + (slotClass ? " " + slotClass : "");
    return '<span class="' + cls + '"><span class="brand"><img class="brand__img" src="/assets/img/logo-wordmark.png" alt="SOAMIQ — soamiq.ai" width="321" height="207" /></span></span>';
  }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }
  function slugify(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  function isGauriService(it) {
    return /gauri/i.test(it.title || "") || String(it.tag || "").toUpperCase() === "GA";
  }

  /* ---------- animated domain / framework illustrations (inline SVG) ---------- */
  var ILLU = {
    bank:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Banking and financial services">' +
        '<g class="illu-float" fill="none" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">' +
          '<path d="M42 62 L100 32 L158 62 Z" fill="rgba(31,107,255,.08)"/>' +
          '<line x1="40" y1="62" x2="160" y2="62"/>' +
          '<line x1="58" y1="62" x2="58" y2="108"/><line x1="82" y1="62" x2="82" y2="108"/>' +
          '<line x1="118" y1="62" x2="118" y2="108"/><line x1="142" y1="62" x2="142" y2="108"/>' +
          '<line x1="38" y1="108" x2="162" y2="108"/><line x1="30" y1="122" x2="170" y2="122"/>' +
        "</g>" +
        '<polyline class="illu-draw" points="56,98 84,80 114,88 150,58" fill="none" stroke="#12a150" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle class="illu-pulse" cx="150" cy="58" r="4.5" fill="#12a150"/>' +
      "</svg>",
    shield:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Insurance">' +
        '<g class="illu-float">' +
          '<path d="M100 26 L150 44 V82 C150 112 128 130 100 138 C72 130 50 112 50 82 V44 Z" fill="rgba(31,107,255,.08)" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round"/>' +
          '<polyline class="illu-draw" points="76,84 95,104 128,66" fill="none" stroke="#12a150" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</g>" +
      "</svg>",
    retail:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Retail">' +
        '<g class="illu-swing">' +
          '<path d="M62 58 H138 L148 132 H52 Z" fill="rgba(31,107,255,.08)" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round"/>' +
          '<path d="M80 64 V50 a20 20 0 0 1 40 0 V64" fill="none" stroke="#1f6bff" stroke-width="3.4" stroke-linecap="round"/>' +
          '<circle class="illu-pulse" cx="100" cy="94" r="6" fill="#12a150"/>' +
        "</g>" +
      "</svg>",
    box:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Consumer packaged goods">' +
        '<g class="illu-float" fill="none" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">' +
          '<path d="M100 32 L156 62 V112 L100 142 L44 112 V62 Z" fill="rgba(31,107,255,.07)"/>' +
          '<path d="M44 62 L100 92 L156 62"/>' +
          '<line x1="100" y1="92" x2="100" y2="142"/>' +
        "</g>" +
        '<path class="illu-draw" d="M70 47 L126 77" fill="none" stroke="#12a150" stroke-width="3.6" stroke-linecap="round"/>' +
      "</svg>",
    game:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Gaming">' +
        '<g class="illu-float">' +
          '<rect x="44" y="64" width="112" height="56" rx="28" fill="rgba(31,107,255,.08)" stroke="#1f6bff" stroke-width="3.4"/>' +
          '<line x1="72" y1="82" x2="72" y2="102" stroke="#1f6bff" stroke-width="3.4" stroke-linecap="round"/>' +
          '<line x1="62" y1="92" x2="82" y2="92" stroke="#1f6bff" stroke-width="3.4" stroke-linecap="round"/>' +
          '<circle class="illu-pulse" cx="128" cy="86" r="5.4" fill="#12a150"/>' +
          '<circle class="illu-pulse" style="animation-delay:.6s" cx="142" cy="100" r="5.4" fill="#1f6bff"/>' +
        "</g>" +
      "</svg>",
    cloud:
      '<svg viewBox="0 0 200 160" role="img" aria-label="New age cloud platforms">' +
        '<g class="illu-float">' +
          '<path d="M70 108 a25 25 0 0 1 4 -49 a31 31 0 0 1 59 -6 a23 23 0 0 1 7 55 Z" fill="rgba(31,107,255,.08)" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round"/>' +
        "</g>" +
        '<g>' +
          '<circle class="illu-pulse" cx="84" cy="124" r="4.4" fill="#12a150"/>' +
          '<circle class="illu-pulse" style="animation-delay:.4s" cx="106" cy="130" r="4.4" fill="#1f6bff"/>' +
          '<circle class="illu-pulse" style="animation-delay:.8s" cx="128" cy="124" r="4.4" fill="#12a150"/>' +
        "</g>" +
      "</svg>",
    funnel:
      '<svg viewBox="0 0 200 160" role="img" aria-label="Revenue intelligence funnel">' +
        '<g class="illu-float">' +
          '<path d="M48 46 H152 L116 96 V132 L84 116 V96 Z" fill="rgba(31,107,255,.08)" stroke="#1f6bff" stroke-width="3.4" stroke-linejoin="round"/>' +
        "</g>" +
        '<g stroke="#12a150" stroke-width="4" stroke-linecap="round">' +
          '<line class="illu-drop" x1="86" y1="28" x2="86" y2="36"/>' +
          '<line class="illu-drop" style="animation-delay:.5s" x1="100" y1="24" x2="100" y2="32"/>' +
          '<line class="illu-drop" style="animation-delay:1s" x1="114" y1="28" x2="114" y2="36"/>' +
        "</g>" +
      "</svg>"
  };
  function illu(type) { return ILLU[type] || ILLU.cloud; }

  /* Stage diagrams — visual-only (no title/body copy). Teal on immersive. */
  var STAGE_ILLU = {
    discover:
      '<svg viewBox="0 0 200 160" role="img" aria-hidden="true">' +
        '<g fill="none" stroke="#2bb5a8" stroke-linecap="round">' +
          '<circle cx="100" cy="82" r="22" stroke-width="2.6" opacity=".95"/>' +
          '<circle class="illu-pulse" cx="100" cy="82" r="40" stroke-width="2" opacity=".55"/>' +
          '<circle cx="100" cy="82" r="58" stroke-width="1.6" opacity=".28"/>' +
        "</g>" +
        '<circle class="illu-pulse" cx="148" cy="52" r="5" fill="#2bb5a8"/>' +
        '<circle cx="58" cy="64" r="4" fill="rgba(245,245,247,.85)"/>' +
        '<circle cx="128" cy="118" r="4" fill="rgba(245,245,247,.7)"/>' +
      "</svg>",
    understand:
      '<svg viewBox="0 0 200 160" role="img" aria-hidden="true">' +
        '<g fill="none" stroke="#2bb5a8" stroke-width="2.4" stroke-linecap="round">' +
          '<line x1="100" y1="46" x2="58" y2="88"/><line x1="100" y1="46" x2="142" y2="88"/>' +
          '<line x1="58" y1="88" x2="100" y2="122"/><line x1="142" y1="88" x2="100" y2="122"/>' +
          '<line x1="58" y1="88" x2="142" y2="88"/>' +
        "</g>" +
        '<circle cx="100" cy="46" r="8" fill="#2bb5a8"/>' +
        '<circle cx="58" cy="88" r="7" fill="rgba(245,245,247,.9)"/>' +
        '<circle cx="142" cy="88" r="7" fill="rgba(245,245,247,.9)"/>' +
        '<circle class="illu-pulse" cx="100" cy="122" r="8" fill="#2bb5a8"/>' +
      "</svg>",
    prioritize:
      '<svg viewBox="0 0 200 160" role="img" aria-hidden="true">' +
        '<g fill="rgba(43,181,168,.16)" stroke="#2bb5a8" stroke-width="2.4" stroke-linejoin="round">' +
          '<rect x="46" y="92" width="28" height="36" rx="6"/>' +
          '<rect x="86" y="68" width="28" height="60" rx="6"/>' +
          '<rect x="126" y="40" width="28" height="88" rx="6" fill="rgba(43,181,168,.32)"/>' +
        "</g>" +
        '<circle class="illu-pulse" cx="140" cy="32" r="4.5" fill="#2bb5a8"/>' +
      "</svg>",
    activate:
      '<svg viewBox="0 0 200 160" role="img" aria-hidden="true">' +
        '<rect x="54" y="38" width="92" height="92" rx="22" fill="rgba(43,181,168,.12)" stroke="#2bb5a8" stroke-width="2.6"/>' +
        '<polyline class="illu-draw" points="78,86 96,104 128,68" fill="none" stroke="#2bb5a8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>"
  };
  function stageIllu(key) {
    var k = String(key || "").toLowerCase();
    return STAGE_ILLU[k] || STAGE_ILLU.discover;
  }

  /* ---------- header (nav only, no banner) ---------- */
  function renderHeader(page) {
    var nav = D.navigation || { links: [], cta: "Get Started" };
    var activeMap = { home: "/", gauri: "/gauri", capabilities: "/capabilities", services: "/capabilities", about: "/about", contact: "/contact" };
    var active = activeMap[page];
    var links = nav.links.map(function (l) {
      var isActive = l.href === active;
      return '<a href="' + l.href + '"' + (isActive ? ' class="is-active"' : "") + ">" + l.label + "</a>";
    }).join("");
    var mobLinks = nav.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("");
    return (
      '<div class="progress" id="progress" aria-hidden="true"></div>' +
      '<header class="gnav nav" id="nav">' +
        '<div class="gnav__inner nav__inner">' +
          '<a href="/" aria-label="' + (D.site.brand || "Soamiq") + ' home">' + brandMarkup() + "</a>" +
          '<nav class="gnav__links nav__links" aria-label="Primary">' + links + "</nav>" +
          '<div class="gnav__actions nav__actions">' +
            '<a href="/contact" class="btn btn--primary btn--sm">' + nav.cta + "</a>" +
            '<button class="nav__toggle" id="navToggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
          "</div>" +
        "</div>" +
        '<div class="nav__mobile" id="navMobile">' + mobLinks +
          '<a href="/contact" class="btn btn--primary">' + nav.cta + "</a>" +
        "</div>" +
      "</header>"
    );
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    var f = D.footer || { columns: [], social: [] };
    var cols = f.columns.map(function (c) {
      var links = c.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("");
      return '<div class="footer__col"><h4>' + c.title + "</h4>" + links + "</div>";
    }).join("");
    var social = (f.social || []).map(function (s) {
      return '<a href="' + s.href + '"' + (/^https?:/.test(s.href) ? ' target="_blank" rel="noopener"' : "") + ">" + s.label + "</a>";
    }).join("");
    return (
      '<footer class="footer footer--parchment"><div class="container">' +
        '<div class="footer__top">' +
          '<div class="footer__about"><a href="/">' + brandMarkup() + "</a>" +
            "<p>" + (D.site.footerDescription || "") + "</p>" +
            '<div class="footer__social">' + social + "</div></div>" +
          cols +
        "</div>" +
        '<div class="footer__bottom">' +
          "<span>&copy; " + (D.site.copyrightYear || new Date().getFullYear()) + " " + (D.site.legalName || "") + ". All rights reserved.</span>" +
          "<span>" + (D.location ? D.location.display : "") + "</span>" +
        "</div>" +
      "</div></footer>"
    );
  }

  /* ---------- reusable sections ---------- */
  function homeHeroStage() {
    var x = D.hero;
    var g = D.gauri || {};
    var flow = (g.stages || []).map(function (s) { return s.title; }).join(" → ");
    return (
      '<section class="tile tile--immersive tile--lit hero-apple stage--immersive stage--lit" aria-label="Hero">' +
        '<div class="container hero-apple__inner">' +
          "<div>" +
            brandMarkup("logo-slot--hero") +
            '<p class="eyebrow reveal">' + (x.eyebrow || "Soamiq Labs") + "</p>" +
            '<h1 class="hero-apple__title reveal" data-anim="up">' + (x.kicker || x.title) + "</h1>" +
            '<p class="hero-apple__desc reveal" data-anim="up">' + x.description + "</p>" +
            '<div class="hero-apple__cta reveal" data-anim="up">' +
              '<a href="' + x.primaryHref + '" class="btn btn--primary">' + x.primaryCta + "</a>" +
              '<a href="' + (x.secondaryHref || "/gauri") + '" class="btn btn--ghost">' + (x.secondaryCta || "Explore GAURI") + "</a>" +
            "</div>" +
            /* hero.proofPoints quarantined — no metric chips on Home */
          "</div>" +
          '<div class="hero-apple__media reveal" data-anim="scale" aria-hidden="true">' +
            '<div class="hero-apple__object-ring"></div>' +
            '<div class="hero-apple__object">' +
              '<div class="hero-apple__object-mark">GAURI</div>' +
              '<div class="hero-apple__object-flow">' + (flow || "Discover → Understand → Prioritize → Activate") + "</div>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function homeHighlightTiles() {
    var p = D.premiumFlow;
    var cards = p.items.map(function (it, i) {
      return (
        '<article class="highlight-card reveal" data-anim="up">' +
          '<div class="highlight-card__idx">0' + (i + 1) + "</div>" +
          "<h3>" + it.title + "</h3>" +
          "<p>" + it.description + "</p>" +
          '<div class="highlight-card__label">' + it.label + "</div>" +
        "</article>"
      );
    }).join("");
    return (
      '<section class="tile tile--white" aria-label="Pillars">' +
        '<div class="container" style="padding-bottom:48px">' +
          '<p class="eyebrow reveal" style="text-align:center">' + p.eyebrow + "</p>" +
          '<h2 class="section__title reveal" style="text-align:center;max-width:20ch;margin:0 auto 40px">' + p.title + "</h2>" +
        "</div>" +
        '<div class="highlight-grid" data-stagger>' + cards + "</div>" +
      "</section>"
    );
  }

  /* Locked split-step pattern:
     visual side = chrome + diagram/logic only (never title/body);
     copy side = title + body + optional one CTA. Alternate L/R. */
  function renderSplitStep(s) {
    var side = s.i % 2 === 0 ? "media-start" : "media-end";
    var ticks = "";
    var t;
    for (t = 0; t < s.total; t++) {
      ticks += "<span" + (t === s.i ? ' class="is-active"' : "") + "></span>";
    }
    var Heading = s.heading || "h3";
    var kicker = s.kicker ? '<p class="eyebrow">' + s.kicker + "</p>" : "";
    var cta = (s.ctaLabel && s.ctaHref)
      ? '<div class="split-step__cta"><a href="' + s.ctaHref + '" class="btn btn--primary">' + s.ctaLabel + "</a></div>"
      : "";
    var visual =
      '<div class="split-step__media" aria-hidden="true">' +
        '<div class="split-step__panel' + (s.panelClass ? " " + s.panelClass : "") + '">' +
          '<div class="split-step__chrome">' +
            '<span class="split-step__mark">' + pad2(s.i + 1) + "</span>" +
          "</div>" +
          s.visualHtml +
          '<div class="split-step__ticks">' + ticks + "</div>" +
        "</div>" +
      "</div>";
    var copy =
      '<div class="split-step__copy">' +
        '<div class="split-step__copy-inner reveal" data-anim="up">' +
          kicker +
          "<" + Heading + ">" + s.title + "</" + Heading + ">" +
          "<p>" + s.body + "</p>" +
          cta +
        "</div>" +
      "</div>";
    return (
      '<article class="split-step sticky-story__chapter" data-side="' + side +
        '" data-chapter="' + (s.chapter || "") + '" data-step="' + s.i + '"' +
        (s.id ? ' id="' + s.id + '"' : "") + ">" +
        visual + copy +
      "</article>"
    );
  }

  function gauriStepsStory(opts) {
    opts = opts || {};
    var g = D.gauri || {};
    var stages = g.stages || [];
    var total = stages.length;
    var last = opts.ctaOnLast || null;
    var steps = stages.map(function (s, i) {
      var cta = (last && i === total - 1) ? last : null;
      return renderSplitStep({
        i: i,
        total: total,
        title: s.title,
        body: s.description,
        kicker: s.kicker || "",
        visualHtml: '<div class="split-step__diagram">' + stageIllu(s.visual || s.title) + "</div>",
        ctaLabel: cta ? cta.label : "",
        ctaHref: cta ? cta.href : "",
        id: opts.ids ? "stage-" + slugify(s.title) : "",
        chapter: slugify(s.title)
      });
    }).join("");
    return '<div class="split-steps gauri-steps sticky-story" id="gauriSticky">' + steps + "</div>";
  }

  function homeGauriSticky() {
    var g = D.gauri;
    return (
      '<section class="tile tile--canvas" style="padding:0" aria-label="How GAURI works" id="how-gauri">' +
        '<div class="container" style="padding-top:var(--section-y);padding-bottom:40px;text-align:center">' +
          '<p class="eyebrow reveal">' + (g.eyebrow || "GAURI") + "</p>" +
          '<h2 class="section__title reveal">' + (g.howItWorksTitle || "Discover → Understand → Prioritize → Activate") + "</h2>" +
          '<p class="lede lede--center reveal">' + (g.howItWorksDescription || "") + "</p>" +
        "</div>" +
        gauriStepsStory({ ctaOnLast: { label: "Explore GAURI", href: "/gauri" } }) +
      "</section>"
    );
  }

  function homeProofStage() {
    // Home proof cards only — never hero.proofPoints or about.stats metric chips.
    var a = D.about || {};
    var strengths = (a.strengths || []).map(function (s) {
      return (
        '<article class="highlight-card reveal" data-anim="up">' +
          "<h3>" + s.title + "</h3>" +
          "<p>" + s.description + "</p>" +
        "</article>"
      );
    }).join("");
    return (
      '<section class="tile tile--parchment" aria-label="Proof">' +
        '<div class="container" style="padding-bottom:40px;text-align:center">' +
          '<p class="eyebrow reveal">Why Soamiq</p>' +
          '<h2 class="section__title reveal">Built for teams that must defend every decision.</h2>' +
        "</div>" +
        '<div class="highlight-grid" data-stagger>' + strengths + "</div>" +
      "</section>"
    );
  }

  function homeActionBand() {
    var x = D.hero;
    return (
      '<section class="tile tile--white" style="padding:0" aria-label="Contact">' +
        '<div class="cta-band">' +
          '<h2 class="reveal" data-anim="up">Build smarter.<br>Build optimized.</h2>' +
          '<p class="reveal" data-anim="up">' + (D.site.positioning || "") + "</p>" +
          '<div class="hero-apple__cta reveal" data-anim="up">' +
            '<a href="' + x.primaryHref + '" class="btn btn--primary">' + x.primaryCta + "</a>" +
            '<a href="/capabilities" class="btn btn--ghost">See capabilities</a>' +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  /* legacy aliases kept for inner pages */
  function homeTrustStage() { return homeHeroStage(); }
  function homePillarsStage() { return homeHighlightTiles(); }
  function homeGauriStage() { return homeGauriSticky(); }
  function homePrimaryCta() { return homeActionBand(); }

    function heroSection() {
    // Kept for inner pages that still call a dense hero; homepage uses stage-views.
    var x = D.hero;
    return (
      '<section class="hero">' +
        '<div class="container hero__inner">' +
          "<div>" +
            brandMarkup("logo-slot--hero") +
            '<span class="chip reveal"><span class="dot"></span>' + x.eyebrow + "</span>" +
            '<h1 class="hero__title reveal" data-anim="up" style="margin-top:22px">' + x.title + "</h1>" +
            '<p class="hero__desc reveal" data-anim="up">' + x.description + "</p>" +
            '<div class="hero__cta reveal" data-anim="up">' +
              '<a href="' + x.primaryHref + '" class="btn btn--primary">' + x.primaryCta + "</a>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function capabilitiesStrip() {
    var c = D.capabilities;
    if (!c) return "";
    var inner = c.items.map(function (i) { return "<span>" + i + "</span>"; }).join("");
    return '<section class="strip" aria-label="' + c.title + '"><div class="strip__track">' + inner + inner + "</div></section>";
  }

  function premiumFlowSection() {
    return homePillarsStage();
  }

  function servicesSection(opts) {
    opts = opts || {};
    var s = D.services;
    var chapters = [];
    var capItems = (s.items || []).filter(function (it) { return !isGauriService(it); });
    capItems.forEach(function (it, i) {
      var outs = (it.outcomes || []).map(function (o) { return "<li>" + o + "</li>"; }).join("");
      var id = slugify(it.title);
      chapters.push(renderSplitStep({
        i: i,
        total: capItems.length,
        title: it.title,
        body: it.description,
        heading: "h2",
        visualHtml: '<ul class="split-step__logic">' + outs + "</ul>",
        panelClass: "split-step__panel--logic",
        id: id,
        chapter: id
      }));
    });
    var g = D.gauri || {};
    chapters.push(
      '<article class="cap-chapter reveal" data-anim="up" id="gauri" data-chapter="gauri" style="background:var(--bg-elevated);text-align:center">' +
        '<div class="cap-chapter__inner" style="grid-template-columns:1fr;justify-items:center">' +
          "<div>" +
            '<div class="cap-chapter__tag">Product</div>' +
            "<h2>" + (g.eyebrow || "GAURI") + "</h2>" +
            '<p class="cap-chapter__desc" style="margin-inline:auto">' + (g.oneLiner || g.description || "") + "</p>" +
            '<div style="margin-top:28px"><a href="/gauri" class="btn btn--primary">Explore GAURI</a></div>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
    var head = opts.hideHead ? "" : (
      '<div class="tile tile--canvas" style="padding-bottom:0"><div class="container">' +
        '<div class="section__head reveal"><p class="eyebrow">What we deliver</p>' +
        '<h2 class="section__title">' + s.title + '</h2>' +
        '<p class="lead lead--center">' + s.description + "</p></div></div></div>"
    );
    var rail = '';
    if (opts.spyRail) {
      var links = (s.items || []).filter(function (it) { return !isGauriService(it); }).map(function (it) {
        return '<a href="#' + slugify(it.title) + '">' + it.title + "</a>";
      }).join("");
      rail = '<nav class="spy-rail" id="capSpyRail" aria-label="Chapters">' + links + '<a href="#gauri">GAURI</a></nav>';
    }
    return (
      '<section id="services">' +
        head +
        chapters.join("") +
        rail +
      "</section>"
    );
  }

  function processSection() {
    var p = D.process;
    var steps = p.steps.map(function (st) {
      return '<li class="reveal" data-anim="up"><div class="timeline__num grad-text">' + st.number + "</div><h3>" + st.title + "</h3><p>" + st.description + "</p></li>";
    }).join("");
    return (
      '<section class="section section--alt"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Method</p>' +
            '<h2 class="section__title">' + p.title + '</h2>' +
            '<p class="lead lead--center">' + p.description + "</p></div>" +
          '<ol class="timeline" data-stagger>' + steps + "</ol>" +
      "</div></section>"
    );
  }

  function storyVisual(svg) {
    return (
      '<div class="story__visual">' +
        '<div class="story__rings" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '<div class="story__illu" aria-hidden="true">' + svg + "</div>" +
      "</div>"
    );
  }

  function domainsStorySection() {
    var ind = D.industries;
    var stories = ind.items.map(function (it, i) {
      return (
        '<article class="story reveal" data-anim="up">' +
          "<div>" +
            '<div class="story__index">Domain ' + pad2(i + 1) + " / " + pad2(ind.items.length) + "</div>" +
            "<h3>" + it.title + "</h3><p>" + it.description + "</p>" +
          "</div>" +
          storyVisual(illu(it.icon)) +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section" id="domains"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Domains</p>' +
            '<h2 class="section__title">' + ind.title + '</h2>' +
            '<p class="lead lead--center">' + ind.description + "</p></div>" +
          '<div class="stories">' + stories + "</div>" +
      "</div></section>"
    );
  }

  function caseStudiesSection() {
    var c = D.caseStudies;
    var items = c.items.map(function (it) {
      return (
        '<article class="play reveal" data-anim="up">' +
          '<div class="play__meta"><span class="play__client">' + it.client + '</span><span class="play__result">' + it.result + "</span></div>" +
          "<h3>" + it.title + "</h3><p>" + it.description + "</p>" +
          '<a class="link-arrow" href="/use-cases/' + it.useCaseSlug + '">View use case <span aria-hidden="true">&rarr;</span></a>' +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section section--white" id="case-studies"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Results</p>' +
            '<h2 class="section__title">' + c.title + '</h2>' +
            '<p class="lead lead--center">' + c.description + "</p></div>" +
          '<div class="plays" data-stagger>' + items + "</div>" +
      "</div></section>"
    );
  }

  function faqSection() {
    var f = D.faq;
    var items = f.items.map(function (it) {
      return (
        '<div class="faq__item reveal">' +
          '<button class="faq__q" aria-expanded="false">' + it.question + '<span class="ic" aria-hidden="true">+</span></button>' +
          '<div class="faq__a"><p>' + it.answer + "</p></div>" +
        "</div>"
      );
    }).join("");
    return (
      '<section class="section"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">FAQ</p>' +
            '<h2 class="section__title">' + f.title + '</h2>' +
            '<p class="lead lead--center">' + f.description + "</p></div>" +
          '<div class="faq">' + items + "</div>" +
      "</div></section>"
    );
  }

  function ctaBand(title, text) {
    return (
      '<section class="tile tile--white" style="padding:0"><div class="cta-band reveal" data-anim="scale">' +
          "<h2>" + title + "</h2><p>" + text + "</p>" +
          '<div class="hero__cta">' +
            '<a href="/contact" class="btn btn--primary">' + D.hero.primaryCta + "</a>" +
          "</div>" +
      "</div></section>"
    );
  }

  function statsRow(stats) {
    var items = stats.map(function (s) {
      return '<div class="stat reveal" data-anim="up"><div class="stat__value grad-text">' + s.value + '</div><div class="stat__label">' + s.label + "</div></div>";
    }).join("");
    return '<div class="stats" data-stagger>' + items + "</div>";
  }

  function pageHero(title, desc) {
    return (
      '<section class="page-hero">' +
        '<div class="container">' +
          brandMarkup("logo-slot--hero") +
          '<h1 class="reveal" data-anim="up">' + title + "</h1>" +
          (desc ? '<p class="reveal" data-anim="up">' + desc + "</p>" : "") +
        "</div>" +
      "</section>"
    );
  }

  /* ---------- page renderers ---------- */
  var pages = {
    home: function () {
      // Immersive hero → light highlights → sticky GAURI → light proof → FAQ → white Action
      // hero.proofPoints are quarantined and must not render here.
      return homeHeroStage() + homeHighlightTiles() + homeGauriSticky() + homeProofStage() + faqSection() + homeActionBand();
    },
    services: function () {
      return pageHero(D.services.title, D.services.description) +
        servicesSection({ hideHead: true }) +
        ctaBand("Have a use case in mind?", "Tell us about the decision or workflow you want to make intelligent.");
    },
    capabilities: function () {
      return pageHero(D.services.title, D.services.description) +
        servicesSection({ hideHead: true, spyRail: true }) +
        ctaBand("Have a use case in mind?", "Tell us about the decision or workflow you want to make intelligent.");
    },
    frameworks: function () {
      var fw = D.frameworks;
      var stories = fw.items.map(function (it) {
        return (
          '<article class="story reveal" data-anim="up">' +
            "<div>" +
              '<p class="eyebrow">' + it.name + "</p>" +
              "<h3>" + it.label + "</h3><p>" + it.description + "</p>" +
              '<div class="story__tags"><span>' + it.status + "</span></div>" +
              '<div style="margin-top:24px"><a class="btn btn--primary" href="' + it.href + '">Explore ' + it.name + " &rarr;</a></div>" +
            "</div>" +
            storyVisual(illu(it.icon)) +
          "</article>"
        );
      }).join("");
      return pageHero(fw.title, fw.description) +
        '<section class="section"><div class="container"><div class="stories">' + stories + "</div></div></section>" +
        ctaBand("Put a framework to work.", "GAURI is live, with more Soamiq frameworks on the way.");
    },
    about: function () {
      var a = D.about;
      var paras = a.paragraphs.map(function (p) { return '<p class="reveal" data-anim="up">' + p + "</p>"; }).join("");
      var strengths = a.strengths.map(function (s) {
        return '<article class="card reveal" data-anim="up"><h3>' + s.title + "</h3><p>" + s.description + "</p></article>";
      }).join("");
      var t = D.team;
      var members = t.members.map(function (m) {
        return (
          '<article class="member reveal" data-anim="up">' +
            '<div class="member__avatar" aria-hidden="true">' + initials(m.name) + "</div>" +
            "<h3>" + m.name + '</h3><p class="member__role">' + m.role + '</p><p class="member__bio">' + m.bio + "</p>" +
          "</article>"
        );
      }).join("");
      return pageHero(a.title, D.site.positioning) +
        '<section class="section"><div class="container"><div class="article">' + paras + "</div></div></section>" +
        '<section class="section section--alt"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Why Soamiq</p><h2 class="section__title">What sets us apart</h2></div>' +
          '<div class="cards" data-stagger>' + strengths + "</div>" +
          '<div style="margin-top:38px">' + statsRow(a.stats) + "</div>" +
        "</div></section>" +
        '<section class="section" id="team"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">People</p><h2 class="section__title">' + t.title + '</h2>' +
          '<p class="lead lead--center">' + t.description + "</p></div>" +
          '<div class="team" data-stagger>' + members + "</div>" +
        "</div></section>" +
        domainsStorySection() +
        ctaBand("Let's build something intelligent.", "Tell us about your data and the decisions you want to automate.");
    },
    contact: function () {
      var c = D.contact, det = c.details, ph = c.form.placeholders, fld = c.form.fields;
      var rows =
        '<div class="row"><span class="tag">' + det.email.tag + '</span><div><div class="k">' + det.email.label + '</div><a class="v" href="' + det.email.href + '">' + det.email.value + "</a></div></div>" +
        '<div class="row"><span class="tag">' + det.address.tag + '</span><div><div class="k">' + det.address.label + '</div><div class="v">' + D.location.display + "</div></div></div>" +
        '<div class="row"><span class="tag">Geo</span><div><div class="k">' + det.serviceAreas.label + '</div><div class="v">' + det.serviceAreas.value + "</div></div></div>";
      return pageHero(c.title, c.description) +
        '<section class="section" style="padding-top:20px"><div class="container"><div class="contact-grid">' +
          '<div class="contact-info reveal" data-anim="left"><h2>' + det.title + '</h2><p class="muted" style="margin-top:8px">' + det.description + "</p>" + rows + "</div>" +
          '<form class="form reveal" data-anim="right" id="contactForm" novalidate>' +
            '<div class="row2">' +
              '<div class="field"><label for="name">' + fld.name + '</label><input id="name" name="name" type="text" placeholder="' + ph.name + '" autocomplete="name" required></div>' +
              '<div class="field"><label for="email">' + fld.email + '</label><input id="email" name="email" type="email" placeholder="' + ph.email + '" autocomplete="email" required></div>' +
            "</div>" +
            '<div class="field"><label for="company">' + fld.company + '</label><input id="company" name="company" type="text" placeholder="' + ph.company + '" autocomplete="organization"></div>' +
            '<div class="field"><label for="message">' + fld.message + '</label><textarea id="message" name="message" placeholder="' + ph.message + '" required></textarea></div>' +
            '<button type="submit" class="btn btn--primary btn--block">' + c.form.submit + "</button>" +
            '<p class="form__status" id="formStatus" role="status" aria-live="polite"></p>' +
          "</form>" +
        "</div></div></section>";
    },
    gauri: function () {
      var g = D.gauri;
      var stages = g.stages || [];
      var spy = stages.map(function (s) {
        return '<a href="#stage-' + slugify(s.title) + '">' + s.title + "</a>";
      }).join("");
      var contrastHead = '<div class="contrast__row contrast__head"><div class="k">Lens</div><div class="c">Copilot</div><div class="g">Governed agent (GAURI)</div></div>';
      var contrastRows = (g.governedContrast || []).map(function (r) {
        return '<div class="contrast__row"><div class="k">' + r.label + '</div><div class="c">' + r.copilot + '</div><div class="g">' + r.gauri + "</div></div>";
      }).join("");
      var principles = (g.principles || []).map(function (p) {
        return '<article class="principle reveal" data-anim="up"><h3>' + p.title + "</h3><p>" + p.description + "</p></article>";
      }).join("");
      var outs = (g.outcomes || []).map(function (o) { return '<span class="pill reveal" data-anim="scale">' + o + "</span>"; }).join("");
      var path = g.pathChapter || {};
      var pathChapter = path.title ? (
        '<section class="tile tile--white gauri-path" aria-label="Path" id="path">' +
          '<div class="container gauri-path__inner">' +
            '<p class="eyebrow reveal">' + (path.eyebrow || "Path") + "</p>" +
            '<h2 class="section__title reveal">' + path.title + "</h2>" +
            '<p class="lede lede--center reveal">' + (path.description || "") + "</p>" +
            (path.line ? '<p class="gauri-path__line reveal">' + path.line + "</p>" : "") +
          "</div>" +
        "</section>"
      ) : "";
      return (
        '<section class="tile tile--immersive tile--lit page-hero stage--immersive" style="text-align:center">' +
          '<div class="container">' +
            brandMarkup("logo-slot--hero") +
            '<span class="chip reveal"><span class="dot"></span>' + g.eyebrow + "</span>" +
            '<h1 class="reveal" data-anim="up" style="margin-top:20px;font-size:clamp(2.25rem,4.5vw,3.25rem);letter-spacing:-0.02em">' + g.title + "</h1>" +
            '<p class="reveal" data-anim="up" style="color:var(--muted-on-dark)">' + g.description + "</p>" +
            '<div class="hero-apple__cta reveal" style="justify-content:center;margin-top:30px">' +
              '<a href="/contact" class="btn btn--primary">' + g.primaryCta + "</a>" +
              '<a href="/capabilities" class="btn btn--ghost">' + (g.secondaryCta || "See capabilities") + "</a>" +
            "</div>" +
          "</div>" +
        "</section>" +
        pathChapter +
        '<section class="tile tile--canvas" style="padding:0" aria-label="How it works" id="how-it-works">' +
          '<div class="container" style="padding-top:var(--section-y);padding-bottom:40px;text-align:center">' +
            '<p class="eyebrow reveal">Workflow</p>' +
            '<h2 class="section__title reveal">' + g.howItWorksTitle + '</h2>' +
            '<p class="lede lede--center reveal">' + g.howItWorksDescription + "</p>" +
          "</div>" +
          gauriStepsStory({ ids: true, ctaOnLast: { label: g.primaryCta || "Discuss GAURI", href: "/contact" } }) +
          '<nav class="spy-rail" id="gauriSpyRail" aria-label="GAURI stages">' + spy + "</nav>" +
        "</section>" +
        (g.governedContrast && g.governedContrast.length ? (
          '<section class="tile tile--white"><div class="container">' +
            '<div class="section__head reveal"><p class="eyebrow">Governance</p><h2 class="section__title">' + (g.governedTitle || "Governed agents vs copilots") + '</h2>' +
            '<p class="lead lead--center">' + (g.governedDescription || "") + "</p></div>" +
            '<div class="contrast reveal">' + contrastHead + contrastRows + "</div>" +
          "</div></section>"
        ) : "") +
        (g.principles && g.principles.length ? (
          '<section class="tile tile--parchment"><div class="container">' +
            '<div class="section__head reveal"><p class="eyebrow">Trust posture</p><h2 class="section__title">' + (g.principlesTitle || "") + '</h2></div>' +
            '<div class="principles" data-stagger>' + principles + "</div>" +
          "</div></section>"
        ) : "") +
        '<section class="tile tile--canvas"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Outcomes</p><h2 class="section__title">' + g.outcomesTitle + '</h2>' +
          '<p class="lead lead--center">' + g.outcomesDescription + "</p></div>" +
          '<div class="pills" data-stagger>' + outs + "</div>" +
        "</div></section>" +
        ctaBand("Discuss GAURI with Soamiq.", g.oneLiner || "Governed revenue agents you can defend.")
      );
    },
    legal: function (which) {
      var l = D.legal[which];
      var secs = l.sections.map(function (s) { return "<h2>" + s.heading + "</h2><p>" + s.body + "</p>"; }).join("");
      return pageHero(l.title, "") +
        '<section class="section" style="padding-top:10px"><div class="container"><div class="article reveal">' +
          '<p class="updated">Last updated: ' + l.updated + "</p>" + secs +
        "</div></div></section>";
    },
    usecase: function (slug) {
      var uc = (D.useCases.items || []).filter(function (i) { return i.slug === slug; })[0];
      if (!uc) return pageHero("Use case not found", "Please return to the capabilities page.");
      var outs = uc.outcomes.map(function (o) { return "<li>" + o + "</li>"; }).join("");
      return (
        '<section class="page-hero"><span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
          '<div class="container">' +
            '<span class="chip reveal"><span class="dot"></span>' + uc.category + " &middot; " + uc.status + "</span>" +
            '<h1 class="reveal" data-anim="up" style="margin-top:20px">' + uc.title + "</h1>" +
            '<p class="reveal" data-anim="up">' + uc.summary + "</p>" +
          "</div></section>" +
        '<section class="section" style="padding-top:10px"><div class="container"><div class="article reveal">' +
          "<h2>The problem</h2><p>" + uc.problem + "</p>" +
          "<h2>The Soamiq approach</h2><p>" + uc.solution + "</p>" +
          '<h2>Outcomes</h2><ul class="checklist">' + outs + "</ul>" +
        "</div></div></section>" +
        ctaBand("Explore this with Soamiq.", "We can adapt this solution play to your domain, data, and goals.")
      );
    }
  };

  /* ---------- interactions ---------- */
  function typewriter(node, phrases) {
    if (!node || !phrases || !phrases.length) return;
    if (reduceMotion) { node.textContent = phrases[0]; return; }
    var pi = 0, ci = 0, deleting = false;
    function tick() {
      var phrase = phrases[pi];
      node.textContent = phrase.slice(0, ci);
      if (!deleting && ci < phrase.length) { ci++; setTimeout(tick, 58); }
      else if (!deleting && ci === phrase.length) { deleting = true; setTimeout(tick, 1900); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 30); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 380); }
    }
    tick();
  }

  function initInteractions() {
    var nav = document.getElementById("nav");
    var progress = document.getElementById("progress");
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 8);
      if (progress) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // mobile menu
    var toggle = document.getElementById("navToggle");
    var mobile = document.getElementById("navMobile");
    if (toggle && mobile) {
      var closeMenu = function () { mobile.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
      toggle.addEventListener("click", function () {
        var open = mobile.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      mobile.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
    }

    // staggered reveal delays
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      group.querySelectorAll(":scope > .reveal").forEach(function (el, i) {
        el.style.transitionDelay = (i * 0.09) + "s";
      });
    });

    // reveal observer
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }

    // typewriter
    typewriter(document.getElementById("typewriter"), (D.site && D.site.typewriterTaglines) || []);

    // FAQ
    document.querySelectorAll(".faq__item").forEach(function (item) {
      var q = item.querySelector(".faq__q");
      var a = item.querySelector(".faq__a");
      q.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        q.setAttribute("aria-expanded", String(open));
        a.style.maxHeight = open ? a.scrollHeight + "px" : null;
      });
    });

    // Immersive hero → progressive nav chrome
    if (document.querySelector(".hero-apple, .tile--immersive.page-hero, .page-hero.tile--immersive")) {
      document.body.classList.add("has-immersive-hero");
    }

    // GAURI steps: spy-rail only — title/body live on the copy side, not the visual mark.
    var stickyRoot = document.getElementById("gauriSticky");
    if (stickyRoot && "IntersectionObserver" in window) {
      var chapters = stickyRoot.querySelectorAll(".sticky-story__chapter, .split-step, .gauri-step");
      var setStep = function (idx) {
        var rail = document.getElementById("gauriSpyRail");
        if (rail) {
          rail.querySelectorAll("a").forEach(function (a, i) {
            a.classList.toggle("is-active", i === idx);
          });
        }
        chapters.forEach(function (ch, i) {
          ch.classList.toggle("is-active", i === idx);
        });
      };
      if (reduceMotion) {
        setStep(0);
      } else {
        var sio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            var idx = parseInt(en.target.getAttribute("data-step"), 10);
            if (!isNaN(idx)) setStep(idx);
          });
        }, { threshold: 0.45, rootMargin: "-20% 0px -20% 0px" });
        chapters.forEach(function (ch) { sio.observe(ch); });
      }
    }

    // Capabilities / GAURI spy rail visibility + active
    ["capSpyRail", "gauriSpyRail"].forEach(function (id) {
      var rail = document.getElementById(id);
      if (!rail) return;
      var show = function () {
        var y = window.scrollY || window.pageYOffset;
        rail.classList.toggle("is-visible", y > (window.innerHeight * 0.4));
      };
      window.addEventListener("scroll", show, { passive: true });
      show();
      if ("IntersectionObserver" in window) {
        var targets = [];
        rail.querySelectorAll("a[href^='#']").forEach(function (a) {
          var t = document.querySelector(a.getAttribute("href"));
          if (t) targets.push({ el: t, link: a });
        });
        var rio = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (!en.isIntersecting) return;
            targets.forEach(function (t) {
              t.link.classList.toggle("is-active", t.el === en.target);
            });
          });
        }, { threshold: 0.35, rootMargin: "-30% 0px -40% 0px" });
        targets.forEach(function (t) { rio.observe(t.el); });
      }
    });

    // contact form
    var form = document.getElementById("contactForm");
    if (form) {
      var status = document.getElementById("formStatus");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        status.className = "form__status";
        var fd = new FormData(form);
        var name = (fd.get("name") || "").toString().trim();
        var email = (fd.get("email") || "").toString().trim();
        var company = (fd.get("company") || "").toString().trim();
        var message = (fd.get("message") || "").toString().trim();
        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
          status.textContent = "Please complete all required fields with a valid email.";
          status.classList.add("is-err");
          return;
        }
        var f = D.contact.form;
        var subject = encodeURIComponent("New inquiry from " + name + (company ? " (" + company + ")" : ""));
        var body = encodeURIComponent(message + "\n\n— " + name + (company ? ", " + company : "") + "\n" + email);
        window.location.href = "mailto:hello@soamiq.ai?subject=" + subject + "&body=" + body;
        form.innerHTML =
          '<div class="form__success"><div class="ic" aria-hidden="true">&#10003;</div>' +
          "<h3>" + f.successTitle + "</h3><p class=\"muted\" style=\"margin-top:8px\">" + f.successMessage + "</p></div>";
      });
    }
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var main = document.getElementById("app");
    var page = (main && main.dataset.page) || "home";
    var headerHost = document.getElementById("site-header");
    var footerHost = document.getElementById("site-footer");
    if (headerHost) headerHost.innerHTML = renderHeader(page);
    if (footerHost) footerHost.innerHTML = renderFooter();
    if (main) {
      if (page === "privacy") main.innerHTML = pages.legal("privacy");
      else if (page === "terms") main.innerHTML = pages.legal("terms");
      else if (page === "usecase") main.innerHTML = pages.usecase(main.dataset.slug);
      else if (pages[page]) main.innerHTML = pages[page]();
      // unknown pages (e.g. 404) keep their inline markup
    }
    initInteractions();
  });
})();
