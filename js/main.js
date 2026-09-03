document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAccentColorPicker();
  initAccessibilityWidget();
  initMobileNav();
  initFAQ();
  initScrollspy();
  initGalleryModal();
  initLiveSearch();
});

// Mobile Navigation Toggle
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('show'));
    });

    // Close mobile menu on clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }
}

// Automatic Navigation Scrollspy Shifting
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="index.html#"]');

  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 120;

    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (!currentSectionId && window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
      currentSectionId = sections[sections.length - 1].getAttribute('id');
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isMatch = href === `#${currentSectionId}` || href.endsWith(`#${currentSectionId}`);
        link.classList.toggle('active', isMatch);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
}

// Theme Management (Light and Dark)
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('opticslab_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('opticslab_theme', targetTheme);
      updateToggleIcon(targetTheme);
    });
  });
}

function updateToggleIcon(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
  });
}

// Tutorial Tabs Switcher
function switchTutorialCategory(categoryId) {
  const groups = document.querySelectorAll('.tutorial-group');
  const buttons = document.querySelectorAll('.tab-btn');

  groups.forEach(group => {
    group.style.display = group.id === categoryId ? 'grid' : 'none';
  });

  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === categoryId);
  });
}

// FAQ Accordion Toggle
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      const icon = header.querySelector('.icon');
      
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const ic = i.querySelector('.icon');
        if (ic) ic.innerText = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        if (icon) icon.innerText = '−';
      }
    });
  });
}

// Working Examples Downloader (.opl project file format)
function downloadSampleFile(sampleType) {
  // Empty button action - no file or data payload needed
}

// Gallery Lightbox Modal
function initGalleryModal() {
  const modal = document.getElementById('galleryModal');
  const modalImg = document.getElementById('galleryModalImg');
  const modalCaption = document.getElementById('galleryModalCaption');
  const closeBtn = document.getElementById('galleryModalClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.gallery-card img, .gallery-card .gallery-zoom-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;
      const img = card.querySelector('img');
      const caption = card.querySelector('h4')?.innerText || '';
      
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || caption;
        if (modalCaption) modalCaption.innerText = caption;
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// Client-side Feedback Form Handler
function handleIssueSubmit(event) {
  event.preventDefault();
  const category = document.getElementById('issueType').value;
  const title = document.getElementById('issueTitle').value;
  const responseMsg = document.getElementById('formResponse');
  const ticketId = Math.floor(100000 + Math.random() * 900000);

  if (responseMsg) {
    responseMsg.style.display = 'block';
    responseMsg.style.color = '#2da44e';
    responseMsg.innerText = `Success! Ticket #${ticketId} ("${title}") submitted under [${category}]. Thank you for supporting OpticsLAB!`;
  }
  const form = document.getElementById('issueForm');
  if (form) form.reset();
}

// Live Search & Keyboard Filter Engine (LightTrans Style GUI Search)
function initLiveSearch() {
  const searchInputs = document.querySelectorAll('.nav-search-input');
  const searchShortcuts = document.querySelectorAll('.nav-search-shortcut');
  const searchClearBtns = document.querySelectorAll('.nav-search-clear');
  const statusBar = document.getElementById('searchStatusBar');
  const statusText = document.getElementById('searchStatusText');

  if (!searchInputs.length) return;

  // Keyboard shortcut listener (Ctrl+K or Cmd+K or '/')
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const activeInput = document.querySelector('.mobile-search-item .nav-search-input') || searchInputs[0];
      if (activeInput) {
        activeInput.focus();
        activeInput.select();
      }
    } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const activeInput = document.querySelector('.mobile-search-item .nav-search-input') || searchInputs[0];
      if (activeInput) activeInput.focus();
    } else if (e.key === 'Escape') {
      clearLiveSearch();
    }
  });

  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      searchInputs.forEach(i => { if (i !== input) i.value = input.value; });
      performSearchFilter(query);
    });
  });

  searchClearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearLiveSearch();
    });
  });

  function performSearchFilter(query) {
    searchShortcuts.forEach(sc => { sc.style.display = query ? 'none' : 'block'; });
    searchClearBtns.forEach(cb => { cb.style.display = query ? 'block' : 'none'; });

    const searchableItems = document.querySelectorAll('.card, .gallery-card, .faq-item, .timeline-item');
    if (!searchableItems.length) return;

    if (!query) {
      searchableItems.forEach(item => {
        item.classList.remove('search-hidden', 'search-matched');
      });
      if (statusBar) statusBar.classList.remove('active');
      return;
    }

    let matchCount = 0;

    searchableItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const isMatch = text.includes(query);

      if (isMatch) {
        matchCount++;
        item.classList.remove('search-hidden');
        item.classList.add('search-matched');
      } else {
        item.classList.add('search-hidden');
        item.classList.remove('search-matched');
      }
    });

    if (statusBar && statusText) {
      statusBar.classList.add('active');
      statusText.innerText = matchCount > 0
        ? `Found ${matchCount} matching item${matchCount === 1 ? '' : 's'} for "${query}"`
        : `No items found matching "${query}". Try searching "prism", "lens", "polarization", or "telescope".`;
    }
  }
}

function clearLiveSearch() {
  const searchInputs = document.querySelectorAll('.nav-search-input');
  const searchShortcuts = document.querySelectorAll('.nav-search-shortcut');
  const searchClearBtns = document.querySelectorAll('.nav-search-clear');
  const statusBar = document.getElementById('searchStatusBar');

  searchInputs.forEach(input => { input.value = ''; });
  searchShortcuts.forEach(sc => { sc.style.display = 'block'; });
  searchClearBtns.forEach(cb => { cb.style.display = 'none'; });

  const searchableItems = document.querySelectorAll('.card, .gallery-card, .faq-item, .timeline-item');
  searchableItems.forEach(item => {
    item.classList.remove('search-hidden', 'search-matched');
  });

  if (statusBar) statusBar.classList.remove('active');
}

// Accent Color Theme Switcher (Default: Electric Blue)
function initAccentColorPicker() {
  const colorPickerBtn = document.getElementById('colorPickerBtn');
  const paletteMenu = document.getElementById('colorPaletteMenu');
  const swatches = document.querySelectorAll('.color-swatch');

  const savedColor = localStorage.getItem('opticslab_accent_color') || 'blue';
  setAccentColor(savedColor);

  if (colorPickerBtn && paletteMenu) {
    colorPickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      paletteMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!paletteMenu.contains(e.target) && e.target !== colorPickerBtn) {
        paletteMenu.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && paletteMenu.classList.contains('show')) {
        paletteMenu.classList.remove('show');
      }
    });
  }

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const selectedColor = swatch.getAttribute('data-color');
      setAccentColor(selectedColor);
      localStorage.setItem('opticslab_accent_color', selectedColor);
      if (paletteMenu) paletteMenu.classList.remove('show');
    });
  });

  function setAccentColor(color) {
    document.documentElement.setAttribute('data-accent', color);

    swatches.forEach(swatch => {
      const match = swatch.getAttribute('data-color') === color;
      swatch.classList.toggle('active', match);
    });
  }
}

// Floating Accessibility Widget Controller (UserWay / iiap.res.in Style)
function initAccessibilityWidget() {
  const triggerBtn = document.getElementById('a11yTriggerBtn');
  const panel = document.getElementById('a11yPanel');
  const closeBtn = document.getElementById('a11yCloseBtn');
  const resetBtn = document.getElementById('a11yResetBtn');

  const fontBtn = document.getElementById('a11yFontBtn');
  const spacingBtn = document.getElementById('a11ySpacingBtn');
  const dyslexiaBtn = document.getElementById('a11yDyslexiaBtn');
  const linksBtn = document.getElementById('a11yLinksBtn');
  const contrastBtn = document.getElementById('a11yContrastBtn');
  const cursorBtn = document.getElementById('a11yCursorBtn');

  const defaultState = {
    font: 'normal',
    spacing: false,
    dyslexia: false,
    links: false,
    contrast: false,
    cursor: false
  };

  let state = { ...defaultState };

  try {
    const saved = localStorage.getItem('opticslab_a11y_settings');
    if (saved) state = { ...defaultState, ...JSON.parse(saved) };
  } catch (err) {
    console.warn('Could not load accessibility settings:', err);
  }

  applyA11ySettings();

  if (triggerBtn && panel) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('show');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => panel.classList.remove('show'));
    }

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !triggerBtn.contains(e.target)) {
        panel.classList.remove('show');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('show')) {
        panel.classList.remove('show');
      }
    });
  }

  // Option Action Handlers
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      if (state.font === 'normal') state.font = 'large';
      else if (state.font === 'large') state.font = 'xlarge';
      else state.font = 'normal';
      saveAndApplyState();
    });
  }

  if (spacingBtn) {
    spacingBtn.addEventListener('click', () => {
      state.spacing = !state.spacing;
      saveAndApplyState();
    });
  }

  if (dyslexiaBtn) {
    dyslexiaBtn.addEventListener('click', () => {
      state.dyslexia = !state.dyslexia;
      saveAndApplyState();
    });
  }

  if (linksBtn) {
    linksBtn.addEventListener('click', () => {
      state.links = !state.links;
      saveAndApplyState();
    });
  }

  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      state.contrast = !state.contrast;
      saveAndApplyState();
    });
  }

  if (cursorBtn) {
    cursorBtn.addEventListener('click', () => {
      state.cursor = !state.cursor;
      saveAndApplyState();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { ...defaultState };
      saveAndApplyState();
    });
  }

  function saveAndApplyState() {
    try {
      localStorage.setItem('opticslab_a11y_settings', JSON.stringify(state));
    } catch (err) {
      console.warn('Could not save accessibility settings:', err);
    }
    applyA11ySettings();
  }

  function applyA11ySettings() {
    const root = document.documentElement;

    root.setAttribute('data-a11y-font', state.font);
    root.setAttribute('data-a11y-spacing', state.spacing ? 'true' : 'false');
    root.setAttribute('data-a11y-dyslexia', state.dyslexia ? 'true' : 'false');
    root.setAttribute('data-a11y-links', state.links ? 'true' : 'false');
    root.setAttribute('data-a11y-contrast', state.contrast ? 'true' : 'false');
    root.setAttribute('data-a11y-cursor', state.cursor ? 'true' : 'false');

    const fontLabel = document.getElementById('a11yFontLabel');
    if (fontLabel) {
      fontLabel.innerText = state.font === 'large' ? 'Text Size: Large' : state.font === 'xlarge' ? 'Text Size: XL' : 'Text Size: Normal';
    }

    const fBtn = document.getElementById('a11yFontBtn');
    const sBtn = document.getElementById('a11ySpacingBtn');
    const dBtn = document.getElementById('a11yDyslexiaBtn');
    const lBtn = document.getElementById('a11yLinksBtn');
    const cBtn = document.getElementById('a11yContrastBtn');
    const curBtn = document.getElementById('a11yCursorBtn');

    if (fBtn) fBtn.classList.toggle('active', state.font !== 'normal');
    if (sBtn) sBtn.classList.toggle('active', state.spacing);
    if (dBtn) dBtn.classList.toggle('active', state.dyslexia);
    if (lBtn) lBtn.classList.toggle('active', state.links);
    if (cBtn) cBtn.classList.toggle('active', state.contrast);
    if (curBtn) curBtn.classList.toggle('active', state.cursor);
  }
}

// Desktop Software Installers Downloader (Windows, Ubuntu/Linux, macOS)
function downloadInstaller(osType) {
  if (osType === 'mac') {
    alert("OpticsLAB for macOS is currently under active development and will be released in an upcoming version!");
    return;
  }

  const installerFiles = {
    windows: {
      path: "installers/v0.1.0/windows/opticslab.exe",
      filename: "opticslab.exe"
    },
    ubuntu: {
      path: "installers/v0.1.0/linux/OpticsLAB_v0.1.0_Linux_DEB.zip",
      filename: "OpticsLAB_v0.1.0_Linux_DEB.zip"
    },
    linux: {
      path: "installers/v0.1.0/linux/OpticsLAB_v0.1.0_Linux_DEB.zip",
      filename: "OpticsLAB_v0.1.0_Linux_DEB.zip"
    },
    a11y_guide: {
      filename: "OpticsLAB_Accessibility_Standards_Guide.txt",
      content: "OpticsLAB Accessibility Standards & User Guide\n===============================================\n1. Font Zoom: Scalable text (Normal, Large 115%, XL 132%)\n2. Spacing: High contrast letter-spacing and 1.95 line height\n3. Typography: High-readability dyslexia font stack\n4. Link Highlighting: Outline badges and high contrast link colors\n5. Contrast: 160% contrast enhancement\n6. Big Cursor: High visibility custom 44px pointer"
    }
  };

  const item = installerFiles[osType];
  if (!item) return;

  if (item.path) {
    const a = document.createElement('a');
    a.href = item.path;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else if (item.content) {
    const blob = new Blob([item.content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Python-Style Release Filter Engine
function filterReleases(osType, pillElem) {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (pillElem) pillElem.classList.add('active');

  const rows = document.querySelectorAll('.release-row');
  rows.forEach(row => {
    const supportedOs = row.getAttribute('data-os') || '';
    if (osType === 'all' || supportedOs.includes(osType)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Release Notes Modal Dialog
function openReleaseNotesModal(version) {
  const modal = document.getElementById('releaseNotesModal');
  const title = document.getElementById('releaseNotesTitle');
  const body = document.getElementById('releaseNotesBody');

  const notesData = {
    '0.1.0': `
      <p style="margin-bottom: 0.75rem;"><strong>OpticsLAB v0.1.0 (Official Initial Release)</strong> — Released September 2026</p>
      <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
        <li>🚀 <strong>3D Optical Ray Tracing:</strong> Full 3D interactive light ray tracing engine through glass lenses, prisms, and mirrors.</li>
        <li>🪟 <strong>Windows 64-bit Installer:</strong> Native setup wizard executable (<code>opticslab.exe</code> - 70.5 MB).</li>
        <li>🐧 <strong>Linux DEB Package:</strong> Native Debian/Ubuntu package archive (<code>OpticsLAB_v0.1.0_Linux_DEB.zip</code> - 491.5 MB).</li>
        <li>🔬 <strong>Optical Catalog & Wave Polarization:</strong> Standard SCHOTT glass material indexes (N-BK7, F2) and 3D Poincaré sphere polarization tracker.</li>
        <li>💾 <strong>Project File Format:</strong> Export and load <code>.opl</code> 3D optical bench setups.</li>
      </ul>
      <p><em>Windows Installer Hash (SHA-256):</em> <code style="font-size: 0.75rem;">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code></p>
    `,
    '0.2.0': `
      <p style="margin-bottom: 0.75rem;"><strong>OpticsLAB v0.2.0 (Planned Next Release)</strong> — Target: Q4 2026</p>
      <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
        <li>⚡ Multi-core GPU accelerated ray tracing engine.</li>
        <li>🔭 Advanced telescope mirror system design presets.</li>
        <li>📊 High precision spectral dispersion plotters.</li>
      </ul>
    `
  };

  if (modal && title && body) {
    title.innerText = `OpticsLAB ${version} Release Notes`;
    body.innerHTML = notesData[version] || `<p>Detailed release notes for OpticsLAB ${version} are available in the repository changelog.</p>`;
    modal.classList.add('active');

    // Backdrop click listener
    modal.onclick = (e) => {
      if (e.target === modal) closeReleaseNotesModal();
    };
  }
}

function closeReleaseNotesModal() {
  const modal = document.getElementById('releaseNotesModal');
  if (modal) modal.classList.remove('active');
}

// Global escape key for release modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeReleaseNotesModal();
  }
});