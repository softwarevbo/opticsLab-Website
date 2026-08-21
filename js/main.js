document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initFAQ();
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
  }
}

// Theme Management (Light and Dark)
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('opticslab_theme') || 'dark';
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('opticslab_theme', targetTheme);
      updateToggleIcon(targetTheme);
    });
  }
}

function updateToggleIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  toggleBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
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

// Sample Project File Downloader (TOML project configuration)
function downloadSampleFile(sampleType) {
  const samplesData = {
    prism_setup: {
      filename: "Prism_Sample_Project.toml",
      content: `[project]
name = "Glass Prism Light Bending"
version = "1.0"

[[components]]
type = "LightSource"
rays = 25
wavelength_nm = 632.8
position = [0.0, 0.0, 0.0]

[[components]]
type = "Prism"
refractive_index = 1.517
apex_angle_deg = 60.0
position = [50.0, 0.0, 0.0]

[[components]]
type = "Screen"
width = 40.0
height = 40.0
position = [120.0, 0.0, 0.0]
`
    },
    lens_setup: {
      filename: "Lens_Focus_Sample_Project.toml",
      content: `[project]
name = "Lens Focus Setup"
version = "1.0"

[[components]]
type = "PointSource"
rays = 36
position = [0.0, 0.0, 0.0]

[[components]]
type = "ConvexLens"
radius = 50.0
thickness = 10.0
position = [40.0, 0.0, 0.0]

[[components]]
type = "DetectorScreen"
width = 30.0
height = 30.0
position = [120.0, 0.0, 0.0]
`
    },
    telescope_setup: {
      filename: "Telescope_Sample_Project.toml",
      content: `[project]
name = "Two-Mirror Telescope"
version = "1.0"

[[components]]
type = "ParabolicPrimaryMirror"
focal_length = 200.0
position = [200.0, 0.0, 0.0]

[[components]]
type = "SecondaryMirror"
focal_length = -50.0
position = [50.0, 0.0, 0.0]

[[components]]
type = "FocusScreen"
position = [220.0, 0.0, 0.0]
`
    },
    polarization_setup: {
      filename: "Polarization_Sample_Project.toml",
      content: `[project]
name = "Light Wave Polarization"
version = "1.0"

[[components]]
type = "PolarizedBeam"
stokes = [1.0, 0.0, 0.0, 1.0]

[[components]]
type = "QuarterWaveplate"
retardance_deg = 90.0
angle_deg = 45.0

[[components]]
type = "HalfWaveplate"
retardance_deg = 180.0
angle_deg = 0.0
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

// Client-side Feedback Form Handler
function handleIssueSubmit(event) {
  event.preventDefault();
  const category = document.getElementById('issueType').value;
  const title = document.getElementById('issueTitle').value;
  const responseMsg = document.getElementById('formResponse');
  const ticketId = Math.floor(100000 + Math.random() * 900000);

  responseMsg.style.display = 'block';
  responseMsg.style.color = '#2da44e';
  responseMsg.innerText = `Success! Feedback #${ticketId} ("${title}") logged under [${category}]. Thank you for helping OpticsLAB!`;
  document.getElementById('issueForm').reset();
}