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
  const samplesData = {
    prism_setup: {
      filename: "Prism_Dispersion_Setup.opl",
      content: `# OpticsLAB 3D Project File (.opl)
# OpticsLAB - 3D Light Ray Tracing & Optics Simulator

[project]
name = "Glass Prism Light Bending & Spectrum Dispersion"
version = "2.4"
created_by = "OpticsLAB Working Examples"

[[light_sources]]
type = "LaserBeam"
wavelength_nm = 632.8
ray_count = 35
position = [0.0, 0.0, 170.0]
direction = [1.0, 0.0, 0.0]

[[optical_elements]]
type = "Prism"
material = "N-BK7"
apex_angle_deg = 60.0
refractive_index = 1.5168
position = [220.0, 0.0, 170.0]

[[detectors]]
type = "Screen"
width = 50.0
height = 150.0
position = [500.0, 0.0, 170.0]
display_spectrum = true
`
    },
    lens_setup: {
      filename: "Lens_Focus_Setup.opl",
      content: `# OpticsLAB 3D Project File (.opl)
# OpticsLAB - 3D Light Ray Tracing & Optics Simulator

[project]
name = "Biconvex Lens Focal Spot Diagram"
version = "2.4"
created_by = "OpticsLAB Working Examples"

[[light_sources]]
type = "ParallelBundle"
radius = 40.0
ray_count = 64
wavelength_nm = 589.3
position = [0.0, 0.0, 170.0]

[[optical_elements]]
type = "BiconvexLens"
material = "N-BK7"
radius_r1 = 150.0
radius_r2 = -150.0
center_thickness = 12.0
diameter = 80.0
position = [260.0, 0.0, 170.0]

[[detectors]]
type = "FocalDetectorScreen"
width = 40.0
height = 40.0
position = [480.0, 0.0, 170.0]
calculate_spot_diagram = true
`
    },
    telescope_setup: {
      filename: "Two_Mirror_Telescope.opl",
      content: `# OpticsLAB 3D Project File (.opl)
# OpticsLAB - 3D Light Ray Tracing & Optics Simulator

[project]
name = "Two-Mirror Astronomical Telescope (Cassegrain)"
version = "2.4"
created_by = "OpticsLAB Working Examples"

[[light_sources]]
type = "CollimatedStarlight"
aperture_diameter = 200.0
ray_count = 100
position = [0.0, 0.0, 0.0]

[[optical_elements]]
type = "ParabolicPrimaryMirror"
diameter = 200.0
focal_length = 500.0
center_hole_diameter = 40.0
position = [480.0, 0.0, 0.0]

[[optical_elements]]
type = "HyperbolicSecondaryMirror"
diameter = 50.0
position = [200.0, 0.0, 0.0]

[[detectors]]
type = "EyepieceFocus"
position = [550.0, 0.0, 0.0]
`
    },
    polarization_setup: {
      filename: "Polarization_Waveplate_State.opl",
      content: `# OpticsLAB 3D Project File (.opl)
# OpticsLAB - 3D Light Ray Tracing & Optics Simulator

[project]
name = "Light Wave Polarization & Poincaré Sphere Track"
version = "2.4"
created_by = "OpticsLAB Working Examples"

[[light_sources]]
type = "PolarizedLaser"
stokes = [1.0, 1.0, 0.0, 0.0]
wavelength_nm = 532.0

[[optical_elements]]
type = "QuarterWaveplate"
retardance_deg = 90.0
fast_axis_angle_deg = 45.0
position = [180.0, 0.0, 0.0]

[[analysis_viewers]]
type = "PoincareSphere"
show_3d_state_vector = true
`
    }
  };

  const item = samplesData[sampleType];
  if (!item) return;

  const blob = new Blob([item.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = item.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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

// Desktop Software Installers Downloader (Windows, Ubuntu, macOS)
function downloadInstaller(osType) {
  const installerFiles = {
    windows: {
      filename: "OpticsLAB_Setup_v2.4.exe",
      content: "[OpticsLAB 3D Desktop Software Installer for Windows 10 & 11 (64-bit)]\nVersion = 2.4.0\nPublisher = OpticsLAB Project\nArchitecture = x64"
    },
    ubuntu: {
      filename: "opticslab_2.4.0_amd64.deb",
      content: "[OpticsLAB 3D Desktop Software Package for Linux Debian / Ubuntu / Mint]\nVersion = 2.4.0\nArchitecture = amd64\nPackage = opticslab"
    },
    mac: {
      filename: "OpticsLAB_v2.4_macOS.dmg",
      content: "[OpticsLAB 3D Desktop Software Image for macOS Intel & Apple Silicon]\nVersion = 2.4.0\nPlatform = macOS"
    },
    a11y_guide: {
      filename: "OpticsLAB_Accessibility_Standards_Guide.txt",
      content: "OpticsLAB Accessibility Standards & User Guide\n===============================================\n1. Font Zoom: Scalable text (Normal, Large 115%, XL 132%)\n2. Spacing: High contrast letter-spacing and 1.95 line height\n3. Typography: High-readability dyslexia font stack\n4. Link Highlighting: Outline badges and high contrast link colors\n5. Contrast: 160% contrast enhancement\n6. Big Cursor: High visibility custom 44px pointer"
    }
  };

  const item = installerFiles[osType];
  if (!item) return;

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