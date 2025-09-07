// Consolidated JavaScript for $DIP site

document.addEventListener('DOMContentLoaded', () => {
  // ----- Footer year -----
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----- Audio player toggle -----
  const audioToggle = document.querySelector('.audio-toggle');
  const audioEl = document.getElementById('dip-audio');
  const toPause = document.getElementById('toPause');
  const toPlay = document.getElementById('toPlay');
  const iconPath = document.getElementById('iconPath');

  if (audioToggle && audioEl && toPause && toPlay && iconPath) {
    const sync = () => {
      const playing = !audioEl.paused;
      audioToggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
      audioToggle.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    };

    audioToggle.addEventListener('click', async () => {
      const willPlay = audioEl.paused;
      try {
        (willPlay ? toPause : toPlay).beginElement();
        if (willPlay) {
          await audioEl.play();
        } else {
          audioEl.pause();
        }
      } catch (e) {
        // Fallback: instantly swap the path if SMIL animation isn’t supported
        const anim = willPlay ? toPause : toPlay;
        iconPath.setAttribute('d', anim.getAttribute('to'));
        if (willPlay) audioEl.play(); else audioEl.pause();
      } finally {
        sync();
      }
    });

    audioEl.addEventListener('ended', () => {
      toPlay.beginElement();
      sync();
    });
    audioEl.addEventListener('play', sync);
    audioEl.addEventListener('pause', sync);
    sync();
  }

  // ----- Parallax background -----
  const bg = document.querySelector('.parallax-bg');
  const strength = 0.25;
  if (bg) {
    const parallax2 = () => {
      const rect = bg.parentElement.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const scrolled = (window.innerHeight / 2 - rect.top) * strength;
        bg.style.setProperty('--shift', `${scrolled}px`);
      }
    };
    window.addEventListener('scroll', parallax2, { passive: true });
    window.addEventListener('resize', parallax2);
    parallax2();
  }

  // ----- Mobile navigation toggle -----
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  if (navToggle && primaryNav) {
    const setOpen = (open) => {
      primaryNav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    navToggle.addEventListener('click', () => {
      const open = !primaryNav.classList.contains('open');
      setOpen(open);
    });
    primaryNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!primaryNav.classList.contains('open')) return;
      const clickedInside = e.target.closest('.nav-links, .nav-toggle');
      if (!clickedInside) setOpen(false);
    });
  }

  // ----- Click to copy -----
  document.querySelectorAll('[data-copy]').forEach((el) => {
    const popup = el.nextElementSibling && el.nextElementSibling.classList?.contains('copy-popup')
      ? el.nextElementSibling
      : null;
    const copyIt = async (e) => {
      e?.preventDefault?.();
      const text = (el.dataset.copy || el.textContent || '').trim();
      try {
        await navigator.clipboard.writeText(text);
        if (popup) {
          popup.classList.add('show');
          setTimeout(() => popup.classList.remove('show'), 1200);
        }
        el.classList.add('copied');
        setTimeout(() => el.classList.remove('copied'), 600);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    };
    el.addEventListener('click', copyIt);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') copyIt(e);
    });
    // ensure accessibility roles
    el.setAttribute('role', el.getAttribute('role') || 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Copy to clipboard');
  });

  // ----- Coming soon toast -----
  const soonLinks = document.querySelectorAll(
    'a[href="#NFTs"], a[href="#Staking"], a[href="#RadioDIP"]'
  );
  if (soonLinks.length) {
    const toast = document.createElement('div');
    toast.className = 'soon-toast';
    toast.innerHTML =
      '<div class="soon-toast__panel" role="status" aria-live="polite">COMING SOON!</div>';
    document.body.appendChild(toast);
    let hideTimer;
    const SHOW_MS = 2500;
    const showToast = () => {
      clearTimeout(hideTimer);
      toast.classList.add('show');
      hideTimer = setTimeout(hideToast, SHOW_MS);
    };
    const hideToast = () => {
      toast.classList.remove('show');
    };
    soonLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        showToast();
      });
      a.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showToast();
        }
      });
    });
    toast.addEventListener('click', (e) => {
      if (e.target === toast) hideToast();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hideToast();
    });
  }
});