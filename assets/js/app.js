/* ============================================================
   SOAMIQ — shared app: renders header/footer + page content
   from window.SOAMIQ (data.js) and wires up Apple-style motion.
   ============================================================ */
(function () {
  "use strict";
  var D = window.SOAMIQ || {};
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function brandMarkup() {
    // Uses the official logo image. Drop your exact file at
    // /assets/img/soamiq_logo.png is the official brand logo.
    return '<span class="brand"><img class="brand__img" src="/assets/img/logo-wordmark.png" alt="SOAMIQ — soamiq.ai" width="321" height="207" /></span>';
  }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

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

  /* ---------- header (nav only, no banner) ---------- */
  function renderHeader(page) {
    var nav = D.navigation || { links: [], cta: "Get Started" };
    var activeMap = { home: "/", services: "/services", frameworks: "/frameworks", about: "/about", contact: "/contact" };
    var active = activeMap[page];
    var links = nav.links.map(function (l) {
      var isActive = l.href === active;
      return '<a href="' + l.href + '"' + (isActive ? ' class="is-active"' : "") + ">" + l.label + "</a>";
    }).join("");
    var mobLinks = nav.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("");
    return (
      '<div class="progress" id="progress" aria-hidden="true"></div>' +
      '<header class="nav" id="nav">' +
        '<div class="container nav__inner">' +
          '<a href="/" aria-label="' + (D.site.brand || "Soamiq") + ' home">' + brandMarkup() + "</a>" +
          '<nav class="nav__links" aria-label="Primary">' + links + "</nav>" +
          '<div class="nav__actions">' +
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
      '<footer class="footer"><div class="container">' +
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
  function heroSection() {
    var x = D.hero;
    var layers = x.systemLayers.map(function (l, i) {
      return '<div class="layer"><span class="layer__idx">0' + (i + 1) + '</span><span class="layer__name">' + l + "</span></div>";
    }).join("");
    var proof = x.proofPoints.map(function (p) {
      return "<div><dt class=\"grad-text\">" + p.value + "</dt><dd>" + p.label + "</dd></div>";
    }).join("");
    return (
      '<section class="hero">' +
        '<span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
        '<span class="hero__orb hero__orb--2" aria-hidden="true"></span>' +
        '<div class="container hero__inner">' +
          "<div>" +
            '<span class="chip reveal"><span class="dot"></span>' + x.eyebrow + "</span>" +
            '<h1 class="hero__title reveal" data-anim="up" style="margin-top:22px">' + x.title +
              '<span class="hero__type"><span id="typewriter"></span><span class="hero__caret" aria-hidden="true"></span></span>' +
            "</h1>" +
            '<p class="hero__desc reveal" data-anim="up">' + x.description + "</p>" +
            '<div class="hero__cta reveal" data-anim="up">' +
              '<a href="' + x.primaryHref + '" class="btn btn--primary">' + x.primaryCta + "</a>" +
              '<a href="' + x.secondaryHref + '" class="btn btn--ghost">' + x.secondaryCta + "</a>" +
            "</div>" +
            '<dl class="hero__proof reveal" data-anim="up">' + proof + "</dl>" +
          "</div>" +
          '<div class="panel">' +
            '<div class="panel__top"><span class="panel__eyebrow">' + x.panelEyebrow + '</span>' +
              '<span class="panel__status"><span class="dot"></span>' + x.panelStatus + "</span></div>" +
            '<h3 class="panel__title">' + x.panelTitle + "</h3>" +
            '<div class="panel__layers">' + layers + "</div>" +
            '<p class="panel__note">' + x.systemLayerNote + "</p>" +
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
    var p = D.premiumFlow;
    var items = p.items.map(function (it, i) {
      return (
        '<div class="flow__item reveal" data-anim="up">' +
          '<div class="flow__num">' + (i + 1) + "</div>" +
          '<div class="flow__body"><div class="flow__label">' + it.label + "</div>" +
            "<h3>" + it.title + "</h3><p>" + it.description + "</p></div>" +
        "</div>"
      );
    }).join("");
    return (
      '<section class="section section--white">' +
        '<div class="container"><div class="scrolly">' +
          '<div class="scrolly__aside">' +
            '<p class="eyebrow">' + p.eyebrow + '</p>' +
            '<h2 class="section__title">' + p.title + '</h2>' +
            '<p class="lead">' + p.description + "</p>" +
            '<a href="/services" class="btn btn--ghost" style="margin-top:28px">See all services</a>' +
          "</div>" +
          '<div class="scrolly__items" data-stagger>' + items + "</div>" +
        "</div></div>" +
      "</section>"
    );
  }

  function servicesSection() {
    var s = D.services;
    var cards = s.items.map(function (it) {
      var outs = it.outcomes.map(function (o) { return "<li>" + o + "</li>"; }).join("");
      return (
        '<article class="card reveal" data-anim="up">' +
          '<span class="card__tag">' + it.tag + "</span>" +
          "<h3>" + it.title + "</h3><p>" + it.description + "</p>" +
          '<ul class="card__list">' + outs + "</ul>" +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section" id="services"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">What we do</p>' +
            '<h2 class="section__title">' + s.title + '</h2>' +
            '<p class="lead lead--center">' + s.description + "</p></div>" +
          '<div class="cards" data-stagger>' + cards + "</div>" +
      "</div></section>"
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
      '<section class="section"><div class="container"><div class="cta-band reveal" data-anim="scale">' +
          "<h2>" + title + "</h2><p>" + text + "</p>" +
          '<div class="hero__cta">' +
            '<a href="/contact" class="btn btn--primary">' + D.hero.primaryCta + "</a>" +
            '<a href="/frameworks" class="btn btn--ghost">' + D.hero.secondaryCta + "</a>" +
          "</div>" +
      "</div></div></section>"
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
        '<span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
        '<div class="container"><h1 class="reveal" data-anim="up">' + title + "</h1>" +
          (desc ? '<p class="reveal" data-anim="up">' + desc + "</p>" : "") + "</div>" +
      "</section>"
    );
  }

  /* ---------- page renderers ---------- */
  var pages = {
    home: function () {
      return heroSection() + capabilitiesStrip() + premiumFlowSection() + servicesSection() +
        domainsStorySection() + processSection() + caseStudiesSection() + faqSection() +
        ctaBand("Build smarter. Build optimized.", D.site.positioning);
    },
    services: function () {
      return pageHero(D.services.title, D.services.description) +
        servicesSection() + processSection() + caseStudiesSection() +
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
      var stages = g.stages.map(function (s) {
        return '<article class="stage reveal" data-anim="up"><h3>' + s.title + "</h3><p>" + s.description + "</p></article>";
      }).join("");
      var outs = g.outcomes.map(function (o) { return '<span class="pill reveal" data-anim="scale">' + o + "</span>"; }).join("");
      return (
        '<section class="page-hero">' +
          '<span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
          '<span class="hero__orb hero__orb--2" aria-hidden="true"></span>' +
          '<div class="container">' +
            '<span class="chip reveal"><span class="dot"></span>' + g.eyebrow + "</span>" +
            '<h1 class="reveal" data-anim="up" style="margin-top:20px">' + g.title + "</h1>" +
            '<p class="reveal" data-anim="up">' + g.description + "</p>" +
            '<div class="hero__cta reveal" style="justify-content:center;margin-top:30px">' +
              '<a href="/contact" class="btn btn--primary">' + g.primaryCta + "</a>" +
              '<a href="/services#services" class="btn btn--ghost">' + g.secondaryCta + "</a>" +
            "</div>" +
          "</div>" +
        "</section>" +
        '<section class="section section--white"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Workflow</p><h2 class="section__title">' + g.howItWorksTitle + '</h2>' +
          '<p class="lead lead--center">' + g.howItWorksDescription + "</p></div>" +
          '<div class="stages" data-stagger>' + stages + "</div>" +
        "</div></section>" +
        '<section class="section section--alt"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Impact</p><h2 class="section__title">' + g.outcomesTitle + '</h2>' +
          '<p class="lead lead--center">' + g.outcomesDescription + "</p></div>" +
          '<div class="pills" data-stagger>' + outs + "</div>" +
        "</div></section>" +
        ctaBand("Accelerate revenue with GAURI.", "Growth Acceleration Using Revenue Intelligence, tailored to your sales motion.")
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
      if (!uc) return pageHero("Use case not found", "Please return to the services page.");
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
