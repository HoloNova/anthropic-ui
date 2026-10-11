import navigation from "../data/navigation.json";

const ORIGIN = "https://www.anthropic.com";
const SCROLL_THRESHOLD = 8;
// 原站收起页头的机制就写在 SiteHeader.css 里：html[data-explore-nav="hidden"]。
const HEADER_STATE_ATTRIBUTE = "exploreNav";

// 这些类名必须与原站样式表完全一致，导航面板的样式完全依赖它们命中。
const DESKTOP = {
  panel: "Dropdown__dropdown",
  section: "Dropdown__dropdownSection",
  sectionTitle: "Dropdown__dropdownSectionTitle",
  links: "Dropdown__dropdownLinks",
  link: "Dropdown__dropdownLink",
};
const MOBILE = {
  root: "SiteMobileNav__root",
  header: "SiteMobileNav__header",
  logo: "SiteMobileNav__logoMobile",
  close: "SiteMobileNav__closeIcon",
  categoryWrapper: "SiteMobileNav__categoryWrapper",
  category: "SiteMobileNav__category",
  categoryActive: "SiteMobileNav__active",
  icon: "SiteMobileNav__icon",
  iconOpen: "SiteMobileNav__iconOpen",
  sectionLinks: "SiteMobileNav__sectionLinks",
  section: "SiteMobileNav__section",
  sectionTitle: "SiteMobileNav__sectionTitle",
  links: "SiteMobileNav__links",
  link: "SiteMobileNav__link",
  footerGroup: "SiteMobileNav__footerButtonGroup",
  footerButton: "SiteMobileNav__footerButton",
};

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function absoluteUrl(url) {
  const resolved = new URL(url, ORIGIN);
  if (resolved.protocol !== "https:" && resolved.protocol !== "http:") {
    throw new Error(`Unsupported navigation url: ${url}`);
  }
  return resolved.href;
}

function createLink(item, className) {
  const link = element("a", className, item.title ?? item.category);
  link.href = absoluteUrl(item.url);
  return link;
}

// 桌面下拉：每个 section 是一组链接，可选小标题。
function createDesktopPanel() {
  const panel = element("div", DESKTOP.panel);
  panel.dataset.align = "center";
  return panel;
}

function fillDesktopPanel(panel, sections) {
  for (const section of sections ?? []) {
    const group = element("section", DESKTOP.section);
    if (section.title) group.append(element("h2", `${DESKTOP.sectionTitle} caption-1`, section.title));
    const list = element("ul", DESKTOP.links);
    for (const item of section.links ?? []) {
      const row = element("li");
      row.append(createLink(item, DESKTOP.link));
      list.append(row);
    }
    group.append(list);
    panel.append(group);
  }
}

function createMobileSections(sections) {
  const container = element("div");
  for (const section of sections ?? []) {
    const group = element("section", MOBILE.section);
    if (section.title) group.append(element("h2", `${MOBILE.sectionTitle} caption-1`, section.title));
    const list = element("ul", MOBILE.links);
    for (const item of section.links ?? []) {
      const row = element("li");
      row.append(createLink(item, `${MOBILE.link} body-3`));
      list.append(row);
    }
    group.append(list);
    container.append(group);
  }
  return container;
}

// 移动菜单：折叠分类 + 底部主按钮，结构对齐 SiteMobileNav 的样式假设。
function createMobileMenu(headerHtml, onClose) {
  const root = element("div", `${MOBILE.root} study-nav`);
  root.hidden = true;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Navigation menu");

  const toolbar = element("div", `${MOBILE.header} page-wrapper`);
  const logo = element("a", MOBILE.logo);
  logo.href = ORIGIN;
  logo.setAttribute("aria-label", "Home");
  const wordmark = headerHtml.querySelector(".LogoWordmark__logo-wrapper")?.cloneNode(true);
  if (wordmark) logo.append(wordmark);
  else logo.textContent = "Anthropic";
  const close = element("button", MOBILE.close, "\u2715");
  close.type = "button";
  close.setAttribute("aria-label", "Close navigation menu");
  close.addEventListener("click", onClose);
  toolbar.append(logo, close);

  const content = element("nav", "page-wrapper");
  for (const category of navigation) {
    const wrapper = element("div", MOBILE.categoryWrapper);
    if (category.displayType !== "sections") {
      wrapper.append(createLink(category, `${MOBILE.category} body-3`));
      content.append(wrapper);
      continue;
    }
    const button = element("button", `${MOBILE.category} body-3`);
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    button.append(element("span", "", category.category));
    const icon = headerHtml.querySelector(".SiteHeader__caretIcon")?.cloneNode(true) ?? null;
    if (icon) {
      icon.classList.add(MOBILE.icon);
      button.append(icon);
    }
    let body = null;
    button.addEventListener("click", () => {
      const open = !body;
      button.classList.toggle(MOBILE.categoryActive, open);
      icon?.classList.toggle(MOBILE.iconOpen, open);
      button.setAttribute("aria-expanded", String(open));
      if (body) {
        body.remove();
        body = null;
        return;
      }
      // 每次展开都重新插入，:SiteMobileNav__sectionLinks 的展开动画才会播放。
      body = element("div", MOBILE.sectionLinks);
      body.append(createMobileSections(category.sections));
      wrapper.append(body);
    });
    wrapper.append(button);
    content.append(wrapper);
  }

  const footer = element("div", MOBILE.footerGroup);
  const cta = headerHtml.querySelector(".SiteHeader__claudeCtaButton");
  if (cta) {
    const button = cta.cloneNode(true);
    button.classList.add(MOBILE.footerButton);
    footer.append(button);
  }
  root.append(toolbar, content, footer);
  return root;
}

function focusable(container) {
  return [...container.querySelectorAll("a[href], button:not([disabled])")];
}

// 页头交互是本地重写的薄封装：结构、类名、折叠机制都沿用原站，事件处理保持可读。
export function initializeSiteShell() {
  const header = document.querySelector(".SiteHeader__header");
  if (!header) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const on = (target, event, listener, options = {}) => target.addEventListener(event, listener, { ...options, signal });
  const menus = [];
  let openMenu = null;
  let leaveTimer = 0;
  let frame = 0;
  let previousY = window.scrollY;

  const closeDesktop = () => {
    if (!openMenu) return;
    openMenu.panel.remove();
    openMenu.button.setAttribute("aria-expanded", "false");
    openMenu.item.classList.remove("SiteHeader__active");
    openMenu = null;
  };
  const openDesktop = (menu) => {
    window.clearTimeout(leaveTimer);
    closeDesktop();
    // 每次展开都重新插入面板，Dropdown__dropdown 的淡入动画才会播放。
    menu.panel = createDesktopPanel();
    fillDesktopPanel(menu.panel, menu.sections);
    menu.item.append(menu.panel);
    menu.button.setAttribute("aria-expanded", "true");
    menu.item.classList.add("SiteHeader__active");
    document.documentElement.removeAttribute(HEADER_STATE_ATTRIBUTE);
    openMenu = menu;
  };
  for (const category of navigation.filter((item) => item.displayType === "sections")) {
    const item = header.querySelector(`[aria-controls="nav-dropdown-${category.category}"]`)?.closest("li");
    const button = item?.querySelector("button");
    if (!item || !button) continue;
    const menu = { item, button, sections: category.sections, panel: null };
    menus.push(menu);
    on(item, "mouseenter", () => openDesktop(menu));
    on(item, "mouseleave", () => {
      leaveTimer = window.setTimeout(closeDesktop, 140);
    });
    on(button, "click", () => (openMenu === menu ? closeDesktop() : openDesktop(menu)));
    on(button, "keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      openDesktop(menu);
      focusable(menu.panel)[0]?.focus();
    });
  }
  on(document, "pointerdown", (event) => {
    if (!header.contains(event.target)) closeDesktop();
  });
  on(document, "keydown", (event) => {
    if (event.key !== "Escape" || !openMenu) return;
    const { button } = openMenu;
    closeDesktop();
    button.focus();
  });
  on(header, "focusout", (event) => {
    if (!header.contains(event.relatedTarget)) closeDesktop();
  });

  const mobileButton = header.querySelector(".SiteHeader__mobileIcon");
  let mobileMenu = null;
  let previousOverflow = "";
  const closeMobile = () => {
    if (!mobileMenu || mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    document.body.style.overflow = previousOverflow;
    mobileButton?.setAttribute("aria-expanded", "false");
    mobileButton?.focus();
  };
  const openMobile = () => {
    if (!mobileMenu) {
      mobileMenu = createMobileMenu(header, closeMobile);
      document.body.append(mobileMenu);
    }
    closeDesktop();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenu.hidden = false;
    mobileButton?.setAttribute("aria-expanded", "true");
    mobileMenu.querySelector(".SiteMobileNav__closeIcon")?.focus();
  };
  if (mobileButton) {
    mobileButton.setAttribute("aria-expanded", "false");
    on(mobileButton, "click", openMobile);
    // Tab 焦点保持在面板内，关闭后回到触发按钮。
    on(mobileButton.ownerDocument, "keydown", (event) => {
      if (event.key !== "Tab" || !mobileMenu || mobileMenu.hidden) return;
      const stops = focusable(mobileMenu);
      if (stops.length === 0) return;
      const first = stops[0];
      const last = stops.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  on(
    window,
    "scroll",
    () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const currentY = window.scrollY;
        const held = Boolean(openMenu) || header.contains(document.activeElement) || (mobileMenu && !mobileMenu.hidden);
        if (held || currentY < header.offsetHeight) {
          document.documentElement.removeAttribute(HEADER_STATE_ATTRIBUTE);
        } else if (Math.abs(currentY - previousY) >= SCROLL_THRESHOLD) {
          if (currentY > previousY) document.documentElement.setAttribute(HEADER_STATE_ATTRIBUTE, "hidden");
          else document.documentElement.removeAttribute(HEADER_STATE_ATTRIBUTE);
        }
        previousY = currentY;
      });
    },
    { passive: true },
  );

  return () => {
    controller.abort();
    window.clearTimeout(leaveTimer);
    if (frame) cancelAnimationFrame(frame);
    closeDesktop();
    if (mobileMenu && !mobileMenu.hidden) {
      document.body.style.overflow = previousOverflow;
      mobileMenu.hidden = true;
    }
    mobileMenu?.remove();
  };
}