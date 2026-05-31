/* ============================================================
   SOAMIQ — shared app: renders header/footer + page content
   from window.SOAMIQ (data.js) and wires up interactions.
   ============================================================ */
(function () {
  "use strict";
  var D = window.SOAMIQ || {};

  /* ---------- helpers ---------- */
  function h(strings) { return strings; }
  function brandMarkup() {
    var bars = [16, 26, 12, 22, 18];
    var wave = bars.map(function (ht) {
      return '<span style="height:' + ht + 'px"></span>';
    }).join("");
    return (
      '<span class="brand">' +
        '<span class="brand__wave" aria-hidden="true">' + wave + "</span>" +
        '<span class="brand__word"><span class="grad-text">SOAMIQ</span><span class="brand__tld">.ai</span></span>' +
      "</span>"
    );
  }
  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  /* ---------- header ---------- */
  function renderHeader(page) {
    var nav = D.navigation || { links: [], cta: "Get Started" };
    var activeMap = { home: "/", services: "/services", frameworks: "/frameworks", about: "/about", contact: "/contact" };
    var active = activeMap[page];
    var links = nav.links.map(function (l) {
      var isActive = l.href === active || (l.href.indexOf("#") === -1 && l.href === active);
      return '<a href="' + l.href + '"' + (isActive ? ' class="is-active"' : "") + ">" + l.label + "</a>";
    }).join("");
    var mobLinks = nav.links.map(function (l) { return '<a href="' + l.href + '">' + l.label + "</a>"; }).join("");

    return (
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
      '<footer class="footer">' +
        '<div class="container">' +
          '<div class="footer__top">' +
            '<div class="footer__about">' +
              '<a href="/">' + brandMarkup() + "</a>" +
              "<p>" + (D.site.footerDescription || "") + "</p>" +
              '<div class="footer__social">' + social + "</div>" +
            "</div>" +
            cols +
          "</div>" +
          '<div class="footer__bottom">' +
            "<span>&copy; " + (D.site.copyrightYear || new Date().getFullYear()) + " " + (D.site.legalName || "Soamiq Labs Private Limited") + ". All rights reserved.</span>" +
            "<span>" + (D.location ? D.location.display : "") + "</span>" +
          "</div>" +
        "</div>" +
      "</footer>"
    );
  }

  /* ---------- reusable sections ---------- */
  function heroSection() {
    var x = D.hero;
    var layers = x.systemLayers.map(function (l, i) {
      return '<div class="layer reveal"><span class="layer__idx">0' + (i + 1) + '</span><span class="layer__name">' + l + "</span></div>";
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
            '<h1 class="hero__title reveal" style="margin-top:20px">' + x.title +
              '<span class="hero__type grad-text" id="typewriter"></span><span class="hero__caret" aria-hidden="true"></span>' +
            "</h1>" +
            '<p class="hero__desc reveal">' + x.description + "</p>" +
            '<div class="hero__cta reveal">' +
              '<a href="' + x.primaryHref + '" class="btn btn--primary">' + x.primaryCta + "</a>" +
              '<a href="' + x.secondaryHref + '" class="btn btn--ghost">' + x.secondaryCta + "</a>" +
            "</div>" +
            '<dl class="hero__proof reveal">' + proof + "</dl>" +
          "</div>" +
          '<div class="panel reveal">' +
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
    var items = p.items.map(function (it) {
      return (
        '<div class="flow__item reveal">' +
          '<div class="flow__label">' + it.label + "</div>" +
          '<div class="flow__body"><h3>' + it.title + "</h3><p>" + it.description + "</p></div>" +
        "</div>"
      );
    }).join("");
    return (
      '<section class="section section--alt">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">' + p.eyebrow + '</p>' +
            '<h2 class="section__title">' + p.title + '</h2>' +
            '<p class="lead lead--center">' + p.description + "</p></div>" +
          '<div class="flow">' + items + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function servicesSection() {
    var s = D.services;
    var cards = s.items.map(function (it) {
      var outs = it.outcomes.map(function (o) { return "<li>" + o + "</li>"; }).join("");
      return (
        '<article class="card reveal">' +
          '<span class="card__tag">' + it.tag + "</span>" +
          "<h3>" + it.title + "</h3><p>" + it.description + "</p>" +
          '<ul class="card__list">' + outs + "</ul>" +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section" id="services">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">What we do</p>' +
            '<h2 class="section__title">' + s.title + '</h2>' +
            '<p class="lead lead--center">' + s.description + "</p></div>" +
          '<div class="cards">' + cards + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function processSection() {
    var p = D.process;
    var steps = p.steps.map(function (st) {
      return '<li class="reveal"><div class="timeline__num">' + st.number + "</div><h3>" + st.title + "</h3><p>" + st.description + "</p></li>";
    }).join("");
    return (
      '<section class="section section--alt">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Method</p>' +
            '<h2 class="section__title">' + p.title + '</h2>' +
            '<p class="lead lead--center">' + p.description + "</p></div>" +
          '<ol class="timeline">' + steps + "</ol>" +
        "</div>" +
      "</section>"
    );
  }

  function industriesSection() {
    var ind = D.industries;
    var items = ind.items.map(function (it) {
      return '<article class="industry reveal"><h3>' + it.title + "</h3><p>" + it.description + "</p></article>";
    }).join("");
    return (
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Domains</p>' +
            '<h2 class="section__title">' + ind.title + '</h2>' +
            '<p class="lead lead--center">' + ind.description + "</p></div>" +
          '<div class="industries">' + items + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function caseStudiesSection() {
    var c = D.caseStudies;
    var items = c.items.map(function (it) {
      return (
        '<article class="play reveal">' +
          '<div class="play__meta"><span class="play__client">' + it.client + '</span><span class="play__result">' + it.result + "</span></div>" +
          "<h3>" + it.title + "</h3><p>" + it.description + "</p>" +
          '<a class="link-arrow" href="/use-cases/' + it.useCaseSlug + '">View use case <span aria-hidden="true">&rarr;</span></a>' +
        "</article>"
      );
    }).join("");
    return (
      '<section class="section section--alt" id="case-studies">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Results</p>' +
            '<h2 class="section__title">' + c.title + '</h2>' +
            '<p class="lead lead--center">' + c.description + "</p></div>" +
          '<div class="plays">' + items + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function faqSection() {
    var f = D.faq;
    var items = f.items.map(function (it) {
      return (
        '<div class="faq__item">' +
          '<button class="faq__q" aria-expanded="false">' + it.question + '<span class="ic" aria-hidden="true">+</span></button>' +
          '<div class="faq__a"><p>' + it.answer + "</p></div>" +
        "</div>"
      );
    }).join("");
    return (
      '<section class="section">' +
        '<div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">FAQ</p>' +
            '<h2 class="section__title">' + f.title + '</h2>' +
            '<p class="lead lead--center">' + f.description + "</p></div>" +
          '<div class="faq">' + items + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function ctaBand(title, text) {
    return (
      '<section class="section">' +
        '<div class="container"><div class="cta-band reveal">' +
          "<h2>" + title + "</h2><p>" + text + "</p>" +
          '<div class="hero__cta">' +
            '<a href="/contact" class="btn btn--primary">' + D.hero.primaryCta + "</a>" +
            '<a href="/frameworks" class="btn btn--ghost">' + D.hero.secondaryCta + "</a>" +
          "</div>" +
        "</div></div>" +
      "</section>"
    );
  }

  function statsRow(stats) {
    var items = stats.map(function (s) {
      return '<div class="stat reveal"><div class="stat__value grad-text">' + s.value + '</div><div class="stat__label">' + s.label + "</div></div>";
    }).join("");
    return '<div class="stats">' + items + "</div>";
  }

  function pageHero(title, desc) {
    return (
      '<section class="page-hero">' +
        '<span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
        '<div class="container"><h1 class="reveal">' + title + '</h1><p class="reveal">' + desc + "</p></div>" +
      "</section>"
    );
  }

  /* ---------- page renderers ---------- */
  var pages = {
    home: function () {
      return heroSection() + capabilitiesStrip() + premiumFlowSection() + servicesSection() +
        industriesSection() + processSection() + caseStudiesSection() + faqSection() +
        ctaBand("Build smarter. Build optimized.", D.site.positioning);
    },
    services: function () {
      return pageHero(D.services.title, D.services.description) +
        servicesSection() + processSection() + caseStudiesSection() +
        ctaBand("Have a use case in mind?", "Tell us about the decision or workflow you want to make intelligent.");
    },
    frameworks: function () {
      var fw = D.frameworks;
      var items = fw.items.map(function (it) {
        return (
          '<article class="card reveal" style="display:flex;flex-direction:column;gap:14px">' +
            '<div class="play__meta"><span class="card__tag">' + it.name + '</span><span class="play__result">' + it.status + "</span></div>" +
            "<h3>" + it.label + "</h3><p>" + it.description + "</p>" +
            '<a class="link-arrow" href="' + it.href + '">Explore ' + it.name + ' <span aria-hidden="true">&rarr;</span></a>' +
          "</article>"
        );
      }).join("");
      return pageHero(fw.title, fw.description) +
        '<section class="section"><div class="container"><div class="cards cards--2">' + items + "</div></div></section>" +
        ctaBand("Put a framework to work.", "GAURI is live, with more Soamiq frameworks on the way.");
    },
    about: function () {
      var a = D.about;
      var paras = a.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("");
      var strengths = a.strengths.map(function (s) {
        return '<article class="card reveal"><h3>' + s.title + "</h3><p>" + s.description + "</p></article>";
      }).join("");
      var t = D.team;
      var members = t.members.map(function (m) {
        return (
          '<article class="member reveal">' +
            '<div class="member__avatar" aria-hidden="true">' + initials(m.name) + "</div>" +
            "<h3>" + m.name + '</h3><p class="member__role">' + m.role + '</p><p class="member__bio">' + m.bio + "</p>" +
          "</article>"
        );
      }).join("");
      return pageHero(a.title, D.site.positioning) +
        '<section class="section"><div class="container"><div class="article reveal">' + paras + "</div></div></section>" +
        '<section class="section section--alt"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Why Soamiq</p><h2 class="section__title">What sets us apart</h2></div>' +
          '<div class="cards">' + strengths + "</div>" +
          '<div style="margin-top:36px">' + statsRow(a.stats) + "</div>" +
        "</div></section>" +
        '<section class="section" id="team"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">People</p><h2 class="section__title">' + t.title + '</h2>' +
          '<p class="lead lead--center">' + t.description + "</p></div>" +
          '<div class="team">' + members + "</div>" +
        "</div></section>" +
        industriesSection() +
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
          '<div class="contact-info reveal"><h2>' + det.title + '</h2><p class="muted" style="margin-top:8px">' + det.description + "</p>" + rows + "</div>" +
          '<form class="form reveal" id="contactForm" novalidate>' +
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
        return '<article class="stage reveal"><h3>' + s.title + "</h3><p>" + s.description + "</p></article>";
      }).join("");
      var outs = g.outcomes.map(function (o) { return '<span class="pill reveal">' + o + "</span>"; }).join("");
      return (
        '<section class="page-hero">' +
          '<span class="hero__orb hero__orb--1" aria-hidden="true"></span>' +
          '<span class="hero__orb hero__orb--2" aria-hidden="true"></span>' +
          '<div class="container">' +
            '<span class="chip reveal"><span class="dot"></span>' + g.eyebrow + "</span>" +
            '<h1 class="reveal" style="margin-top:18px">' + g.title + "</h1>" +
            '<p class="reveal">' + g.description + "</p>" +
            '<div class="hero__cta reveal" style="justify-content:center">' +
              '<a href="/contact" class="btn btn--primary">' + g.primaryCta + "</a>" +
              '<a href="/services#services" class="btn btn--ghost">' + g.secondaryCta + "</a>" +
            "</div>" +
          "</div>" +
        "</section>" +
        '<section class="section"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Workflow</p><h2 class="section__title">' + g.howItWorksTitle + '</h2>' +
          '<p class="lead lead--center">' + g.howItWorksDescription + "</p></div>" +
          '<div class="stages">' + stages + "</div>" +
        "</div></section>" +
        '<section class="section section--alt"><div class="container">' +
          '<div class="section__head reveal"><p class="eyebrow">Impact</p><h2 class="section__title">' + g.outcomesTitle + '</h2>' +
          '<p class="lead lead--center">' + g.outcomesDescription + "</p></div>" +
          '<div class="pills">' + outs + "</div>" +
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
            '<h1 class="reveal" style="margin-top:18px">' + uc.title + "</h1>" +
            '<p class="reveal">' + uc.summary + "</p>" +
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
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = phrases[0]; return;
    }
    var pi = 0, ci = 0, deleting = false;
    function tick() {
      var phrase = phrases[pi];
      node.textContent = phrase.slice(0, ci);
      if (!deleting && ci < phrase.length) { ci++; setTimeout(tick, 55); }
      else if (!deleting && ci === phrase.length) { deleting = true; setTimeout(tick, 1800); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 28); }
      else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); }
    }
    tick();
  }

  function initInteractions() {
    var nav = document.getElementById("nav");
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var toggle = document.getElementById("navToggle");
    var mobile = document.getElementById("navMobile");
    if (toggle && mobile) {
      var close = function () { mobile.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
      toggle.addEventListener("click", function () {
        var open = mobile.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      mobile.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    }

    // reveal
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
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
      else main.innerHTML = pages.home();
    }
    initInteractions();
  });
})();
