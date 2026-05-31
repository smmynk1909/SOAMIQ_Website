(function renderWebsite() {
  const data = window.soamiqData;
  if (!data) {
    return;
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  };

  const renderNav = () => {
    const navList = document.getElementById("nav-list");
    if (!navList) {
      return;
    }

    data.navigation.forEach((item) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = item.href;
      link.textContent = item.label;
      li.appendChild(link);
      navList.appendChild(li);
    });
  };

  const renderHighlights = () => {
    const list = document.getElementById("hero-highlights");
    if (!list) {
      return;
    }

    data.mission.highlights.forEach((highlight) => {
      const li = document.createElement("li");
      li.textContent = highlight;
      list.appendChild(li);
    });
  };

  const renderCards = (targetId, items, mapCard) => {
    const container = document.getElementById(targetId);
    if (!container) {
      return;
    }

    items.forEach((item) => {
      container.appendChild(mapCard(item));
    });
  };

  const capabilityCard = (item) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = item.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = item.description;
    card.appendChild(description);

    return card;
  };

  const projectCard = (item) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = item.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = item.description;
    card.appendChild(description);

    if (Array.isArray(item.tags) && item.tags.length > 0) {
      const tagList = document.createElement("ul");
      tagList.className = "badge-list";
      item.tags.forEach((tag) => {
        const tagItem = document.createElement("li");
        tagItem.textContent = tag;
        tagList.appendChild(tagItem);
      });
      card.appendChild(tagList);
    }

    return card;
  };

  const teamCard = (item) => {
    const card = document.createElement("article");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = item.role;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = item.description;
    card.appendChild(description);

    return card;
  };

  document.title = data.brand.name;
  setText("brand-name", data.brand.name);
  setText("hero-eyebrow", data.brand.eyebrow);
  setText("hero-title", data.brand.heroTitle);
  setText("hero-description", data.brand.heroDescription);
  setText("mission-title", data.mission.title);
  setText("mission-body", data.mission.body);
  setText("about-text", data.about);
  setText("contact-text", data.contact.lead);
  setText("contact-location", data.contact.location);
  setText("contact-hours", data.contact.hours);

  const primaryCta = document.getElementById("hero-primary-cta");
  if (primaryCta) {
    primaryCta.textContent = data.brand.primaryCta.label;
    primaryCta.href = data.brand.primaryCta.href;
  }

  const secondaryCta = document.getElementById("hero-secondary-cta");
  if (secondaryCta) {
    secondaryCta.textContent = data.brand.secondaryCta.label;
    secondaryCta.href = data.brand.secondaryCta.href;
  }

  const emailLink = document.getElementById("contact-email-link");
  if (emailLink) {
    emailLink.textContent = data.contact.email;
    emailLink.href = `mailto:${data.contact.email}`;
  }

  const currentYear = new Date().getFullYear();
  setText("footer-copy", `© ${currentYear} ${data.brand.name}. All rights reserved.`);

  renderNav();
  renderHighlights();
  renderCards("capabilities-grid", data.capabilities, capabilityCard);
  renderCards("projects-grid", data.projects, projectCard);
  renderCards("team-grid", data.team, teamCard);
})();
