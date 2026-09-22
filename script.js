/* ==========================================================================
   Vidhi Khandelwal — portfolio interactions
   ========================================================================== */
(function () {
  "use strict";

  /* ==========================================================================
     ✏️  EDIT ME — proof files
     --------------------------------------------------------------------------
     Everything below is optional. Anything you leave as "" simply doesn't
     appear — nothing breaks, no empty pop-ups, no broken links. Fill them in
     one at a time as you gather the files.
     ========================================================================== */

  /* --- 1. Screenshots of the Verve Bidding Tracker -------------------------
     Save your screenshots into a folder called "shots" next to index.html,
     then add a line for each. BLUR ANY CLIENT NAMES, EMAILS OR PHONE
     NUMBERS before saving them.

     Example:
       { src: "shots/dashboard.png", title: "Pipeline dashboard — live lead data" },
  */
  var PROJECT_SHOTS = [
    // { src: "shots/dashboard.png",  title: "Pipeline dashboard" },
    // { src: "shots/lead-capture.png", title: "Lead capture form" },
    // { src: "shots/reporting.png",  title: "Automated weekly report" },
  ];

  /* --- 2. Certificates -----------------------------------------------------
     For each one you can give an "image" (a .png/.jpg saved next to
     index.html, e.g. "certs/udemy.png"), a "verify" link (the official
     credential URL), or both.

       image only  → clicking opens the certificate full-screen
       verify only → clicking opens the official page in a new tab
       both        → pop-up shows the image, with a Verify button on it
       neither     → stays as plain text, exactly as it looks now
  */
  var CERTIFICATES = {
    "udemy-b2b":        { image: "", verify: "" },
    "iitkgp-analytics": { image: "", verify: "" },
    "unilever-scm":     { image: "", verify: "" },
    "cec-spin":         { image: "", verify: "" }
  };

  /* --- 3. Enquiry form -> Google Form -------------------------------------
     Leave this exactly as it is and the form still works: it opens the
     sender's email app with everything filled in, addressed to you.

     To collect answers in a Google Sheet instead, make a Google Form with
     five questions (Name, Email, Company, What's this about, Message), then
     send me the form link and I'll fill in the six values below for you.
  */
  var GOOGLE_FORM = {
    action: "",      // .../formResponse
    name:    "",     // entry.0000000
    email:   "",
    company: "",
    reason:  "",
    message: ""
  };

  var MY_EMAIL = "vidzz200211@gmail.com";

  /* --- 4. Email delivery (used when no Google Form is set) ----------------
     FormSubmit posts the enquiry straight to the inbox above. No account,
     no dashboard — but the address has to be confirmed once, via a link
     they email you the first time someone submits.
     Set this to "" to go back to the copy-it-yourself fallback. */
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + MY_EMAIL;

  /* ========================= end of the edit-me bit ======================== */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Year ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  var loader = $("#loader");
  function hideLoader() {
    if (loader) loader.classList.add("done");
  }
  window.addEventListener("load", function () { setTimeout(hideLoader, reduced ? 0 : 450); });
  setTimeout(hideLoader, 2500); // never trap anyone behind a slow font

  /* ---------- Theme toggle ---------- */
  var themeBtn = $("#themeToggle");
  function syncThemeLabel() {
    if (!themeBtn) return;
    var dark = document.documentElement.classList.contains("dark");
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  syncThemeLabel();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = document.documentElement.classList.toggle("dark");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
      syncThemeLabel();
    });
  }

  /* ---------- Mobile nav ---------- */
  var navToggle = $("#navToggle");
  var navLinks  = $("#navLinks");
  function closeNav() {
    if (!navLinks) return;
    navLinks.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
  }

  /* ---------- Header shadow, scroll progress, back-to-top ---------- */
  var header   = $(".site-header");
  var progress = $("#progress");
  var toTop    = $("#toTop");
  var ticking  = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("stuck", y > 8);
    if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 600);

    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Back to top ----------
     The header is position:sticky, so it's always parked at the top of the
     viewport. That makes href="#top" a no-op — the browser decides it's
     already there and does nothing. Scroll it ourselves instead. */
  $$('a[href="#top"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------- Active nav link ---------- */
  var sections = $$("main section[id]");
  var navMap = {};
  $$("#navLinks a[href^='#']").forEach(function (a) {
    navMap[a.getAttribute("href").slice(1)] = a;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          $$("#navLinks a").forEach(function (a) { a.classList.remove("current"); });
          link.classList.add("current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = $$(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add("in"); }, i * 70);
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Counting metrics ---------- */
  function runCount(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    if (reduced) { el.textContent = target; return; }

    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  var counters = $$(".count");
  if (!("IntersectionObserver" in window)) {
    counters.forEach(runCount);
  } else {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* ---------- Hero typewriter ---------- */
  var typed = $("#typed");
  var PHRASES = [
    "the reporting layer.",
    "the automations.",
    "the CRM engine.",
    "the systems behind the marketing."
  ];

  if (typed) {
    if (reduced) {
      typed.textContent = PHRASES[PHRASES.length - 1];
    } else {
      var pi = 0, ci = 0, deleting = false;

      function tick() {
        var phrase = PHRASES[pi];
        ci += deleting ? -1 : 1;
        typed.textContent = phrase.slice(0, ci);

        var delay = deleting ? 34 : 62;

        if (!deleting && ci === phrase.length) {
          deleting = true;
          delay = 1900;
        } else if (deleting && ci === 0) {
          deleting = false;
          pi = (pi + 1) % PHRASES.length;
          delay = 320;
        }
        setTimeout(tick, delay);
      }
      setTimeout(tick, 900);
    }
  }

  /* ---------- Lightbox ---------- */
  var lb        = $("#lightbox");
  var lbImage   = $("#lbImage");
  var lbTitle   = $("#lbTitle");
  var lbVerify  = $("#lbVerify");
  var lbPrev    = $("#lbPrev");
  var lbNext    = $("#lbNext");
  var lbClose   = $("#lbClose");

  var gallery = [];   // current list of { src, title, verify }
  var index   = 0;
  var lastFocus = null;

  function renderSlide() {
    var item = gallery[index];
    if (!item) return;

    lbImage.src = item.src;
    lbImage.alt = item.title || "";
    lbTitle.textContent = item.title || "";

    if (item.verify) {
      lbVerify.href = item.verify;
      lbVerify.hidden = false;
    } else {
      lbVerify.hidden = true;
    }

    var many = gallery.length > 1;
    lbPrev.hidden = !many;
    lbNext.hidden = !many;
  }

  function openLightbox(items, startAt) {
    if (!lb || !items || !items.length) return;
    gallery = items;
    index = startAt || 0;
    lastFocus = document.activeElement;

    renderSlide();
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(function () { lb.classList.add("open"); });
    lbClose.focus();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () {
      lb.hidden = true;
      lbImage.src = "";
    }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (gallery.length < 2) return;
    index = (index + dir + gallery.length) % gallery.length;
    renderSlide();
  }

  if (lb) {
    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-figure")) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ---------- Project screenshots ---------- */
  var shotsWrap = $("#projectShots");
  if (shotsWrap && PROJECT_SHOTS.length) {
    PROJECT_SHOTS.forEach(function (shot, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shot";
      btn.setAttribute("aria-label", "View screenshot: " + (shot.title || "project"));

      var img = document.createElement("img");
      img.src = shot.src;
      img.alt = shot.title || "";
      img.loading = "lazy";
      btn.appendChild(img);

      /* If an image file is missing, drop the tile rather than show a broken one */
      img.addEventListener("error", function () { btn.remove(); });

      btn.addEventListener("click", function () { openLightbox(PROJECT_SHOTS, i); });
      shotsWrap.appendChild(btn);
    });
    shotsWrap.hidden = false;
  }

  /* ---------- Moments gallery ---------- */
  var galleryItems = $$("#gallery .g-item");
  if (galleryItems.length) {
    var galleryList = galleryItems.map(function (el) {
      return { src: el.dataset.src, title: el.dataset.title || "" };
    });
    galleryItems.forEach(function (el, i) {
      el.addEventListener("click", function () { openLightbox(galleryList, i); });
    });
  }

  /* ---------- Honours with a photo behind them ---------- */
  $$(".e-honours button.proof").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openLightbox([{ src: btn.dataset.src, title: btn.dataset.title || "" }], 0);
    });
  });

  /* ---------- Certificates ---------- */
  $$(".cert[data-cert]").forEach(function (cert) {
    var conf = CERTIFICATES[cert.dataset.cert];
    if (!conf || (!conf.image && !conf.verify)) return;   // no proof: leave as text

    var name = $(".c-name", cert);
    var by   = $(".c-by", cert);
    var label = (name ? name.textContent.trim() : "Certificate") +
                (by ? " — " + by.textContent.trim() : "");

    cert.classList.add("has-proof");
    cert.setAttribute("role", "button");
    cert.setAttribute("tabindex", "0");

    function activate() {
      if (conf.image) {
        openLightbox([{ src: conf.image, title: label, verify: conf.verify }], 0);
      } else {
        window.open(conf.verify, "_blank", "noopener");
      }
    }

    cert.addEventListener("click", activate);
    cert.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });

  /* ---------- Enquiry form ---------- */
  var enqForm   = $("#enquiryForm");
  var enqSubmit = $("#enqSubmit");
  var enqStatus = $("#enqStatus");

  if (enqForm) {
    var RULES = {
      name:    { msg: "Please tell me your name.",        test: function (v) { return v.length >= 2; } },
      email:   { msg: "That doesn't look like an email.", test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
      reason:  { msg: "A few words is enough.",           test: function (v) { return v.length >= 2; } },
      message: { msg: "A sentence or two is plenty.",     test: function (v) { return v.length >= 10; } }
    };

    function fieldOf(input) { return input.closest(".field"); }

    function validate(input) {
      var rule = RULES[input.name];
      if (!rule) return true;
      var ok = rule.test(input.value.trim());
      var field = fieldOf(input);
      if (field) {
        field.classList.toggle("invalid", !ok);
        var err = $("[data-err]", field);
        if (err) err.textContent = ok ? "" : rule.msg;
      }
      return ok;
    }

    /* Clear the error as soon as they fix it */
    $$("input, select, textarea", enqForm).forEach(function (el) {
      el.addEventListener("blur", function () { if (el.value.trim()) validate(el); });
      el.addEventListener("input", function () {
        var field = fieldOf(el);
        if (field && field.classList.contains("invalid")) validate(el);
      });
    });

    function composed(data) {
      return {
        subject: "Enquiry from " + data.name + (data.company ? " (" + data.company + ")" : "") +
                 " — " + data.reason,
        body: [
          data.message, "",
          "—", "From: " + data.name,
          "Email: " + data.email,
          data.company ? "Company: " + data.company : "",
          "Regarding: " + data.reason
        ].filter(Boolean).join("\n")
      };
    }

    /* No Google Form set up yet, so there is no inbox to post to. Open the
       sender's mail app AND show the message on the page — plenty of people
       have no mail app configured, and a button that silently does nothing
       is worse than no button. */
    function emailFallback(data) {
      var msg = composed(data);

      enqStatus.className = "enq-status ok";
      enqStatus.innerHTML = "";

      var line = document.createElement("p");
      line.style.marginBottom = "0.7rem";
      line.textContent = "Opening your email app… if nothing happens, send this to " + MY_EMAIL + ":";
      enqStatus.appendChild(line);

      var box = document.createElement("textarea");
      box.readOnly = true;
      box.rows = 6;
      box.value = "To: " + MY_EMAIL + "\nSubject: " + msg.subject + "\n\n" + msg.body;
      box.style.cssText =
        "width:100%;font-family:inherit;font-size:0.82rem;line-height:1.5;color:#fff;" +
        "background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);" +
        "border-radius:10px;padding:0.7rem 0.8rem;resize:vertical;";
      enqStatus.appendChild(box);

      var copy = document.createElement("button");
      copy.type = "button";
      copy.textContent = "Copy message";
      copy.style.cssText =
        "margin-top:0.6rem;font-family:inherit;font-size:0.8rem;font-weight:600;" +
        "padding:0.5rem 1.1rem;border-radius:999px;border:1px solid rgba(255,255,255,0.45);" +
        "background:transparent;color:#fff;cursor:pointer;";
      copy.addEventListener("click", function () {
        box.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (e) {}
        if (!ok && navigator.clipboard) {
          navigator.clipboard.writeText(box.value).then(function () {
            copy.textContent = "Copied";
          });
          return;
        }
        copy.textContent = ok ? "Copied" : "Select the text above and copy";
      });
      enqStatus.appendChild(copy);

      /* try the mail app too — harmless if it does nothing */
      var link = document.createElement("a");
      link.href = "mailto:" + MY_EMAIL +
        "?subject=" + encodeURIComponent(msg.subject) +
        "&body=" + encodeURIComponent(msg.body);
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(function () { link.remove(); }, 1000);
    }

    function postToGoogle(data) {
      /* Google Forms doesn't allow reading the response, so post through a
         hidden iframe: the submission lands, the page never navigates. */
      return new Promise(function (resolve) {
        var frameName = "gf_" + Date.now();
        var frame = document.createElement("iframe");
        frame.name = frameName;
        frame.style.display = "none";
        document.body.appendChild(frame);

        var form = document.createElement("form");
        form.action = GOOGLE_FORM.action;
        form.method = "POST";
        form.target = frameName;

        ["name", "email", "company", "reason", "message"].forEach(function (k) {
          if (!GOOGLE_FORM[k]) return;
          var input = document.createElement("input");
          input.type = "hidden";
          input.name = GOOGLE_FORM[k];
          input.value = data[k] || "";
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();

        setTimeout(function () {
          form.remove();
          frame.remove();
          resolve();
        }, 1200);
      });
    }

    enqForm.addEventListener("submit", function (e) {
      e.preventDefault();
      enqStatus.className = "enq-status";
      enqStatus.textContent = "";

      /* Silently drop bots that filled the hidden field */
      if (enqForm._hp && enqForm._hp.value) return;

      var fields = $$("input[name], select[name], textarea[name]", enqForm)
        .filter(function (el) { return el.name !== "_hp"; });

      var firstBad = null;
      fields.forEach(function (el) {
        if (!validate(el) && !firstBad) firstBad = el;
      });
      if (firstBad) {
        firstBad.focus();
        enqStatus.className = "enq-status bad";
        enqStatus.textContent = "Just a couple of things to fix above.";
        return;
      }

      var data = {};
      fields.forEach(function (el) { data[el.name] = el.value.trim(); });

      /* Preferred: post it straight to the inbox */
      if (!GOOGLE_FORM.action && FORM_ENDPOINT) {
        enqSubmit.disabled = true;
        enqSubmit.classList.add("busy");

        var msg = composed(data);

        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company || "—",
            "what it's about": data.reason,
            message: data.message,
            _subject: msg.subject,
            _template: "table",
            _captcha: "false"
          })
        })
          .then(function (r) { return r.json().catch(function () { return {}; }); })
          .then(function (res) {
            enqSubmit.disabled = false;
            enqSubmit.classList.remove("busy");

            if (res && String(res.success) === "true") {
              enqForm.reset();
              enqStatus.className = "enq-status ok";
              enqStatus.textContent = "Thank you — that's with me. I'll reply within a day.";
            } else {
              /* not delivered — never leave someone with a dead button */
              emailFallback(data);
            }
          })
          .catch(function () {
            enqSubmit.disabled = false;
            enqSubmit.classList.remove("busy");
            emailFallback(data);
          });
        return;
      }

      if (!GOOGLE_FORM.action) {
        emailFallback(data);
        return;
      }

      enqSubmit.disabled = true;
      enqSubmit.classList.add("busy");

      postToGoogle(data).then(function () {
        enqForm.reset();
        enqSubmit.disabled = false;
        enqSubmit.classList.remove("busy");
        enqStatus.className = "enq-status ok";
        enqStatus.textContent = "Thank you — that's with me. I'll reply within a day.";
      });
    });
  }

  /* ---------- Timeline: the line fills as you scroll past it ---------- */
  var timeline   = $(".timeline");
  var tlProgress = $("#tlProgress");
  var tlItems    = $$(".tl-item");

  if (timeline && tlProgress) {
    var tlTicking = false;

    function drawTimeline() {
      var box = timeline.getBoundingClientRect();
      var vh  = window.innerHeight;

      /* 0 when the top of the list reaches 62% down the screen,
         1 once the bottom has passed that same line */
      var mark = vh * 0.62;
      var p = (mark - box.top) / box.height;
      p = Math.max(0, Math.min(1, p));

      var track = timeline.offsetHeight - 16;      /* matches top/bottom: 8px */
      tlProgress.style.height = (track * p) + "px";
      tlProgress.classList.toggle("lit", p > 0.01 && p < 0.995);

      /* light up each milestone the line has reached */
      var reachedY = box.top + 8 + track * p;
      tlItems.forEach(function (item) {
        var dot = item.getBoundingClientRect().top + 14;
        item.classList.toggle("passed", reachedY >= dot);
      });
    }

    if (reduced) {
      tlProgress.style.height = (timeline.offsetHeight - 16) + "px";
      tlItems.forEach(function (i) { i.classList.add("passed"); });
    } else {
      window.addEventListener("scroll", function () {
        if (tlTicking) return;
        tlTicking = true;
        requestAnimationFrame(function () { drawTimeline(); tlTicking = false; });
      }, { passive: true });
      window.addEventListener("resize", drawTimeline);
      drawTimeline();
    }
  }

  /* ---------- Section eyebrow rules ---------- */
  if (reduced || !("IntersectionObserver" in window)) {
    $$(".section-head").forEach(function (el) { el.classList.add("in"); });
  } else {
    var headObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    $$(".section-head").forEach(function (el) { headObserver.observe(el); });
  }

  /* ---------- Pointer effects (fine pointers only) ---------- */
  if (!reduced && window.matchMedia("(pointer: fine)").matches) {

    /* Tilt toward the cursor, and light the card where the cursor is */
    $$(".system, .tool-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;

        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");

        card.style.transform =
          "translateY(-4px) perspective(900px) rotateY(" + ((px - 0.5) * 3.2).toFixed(2) +
          "deg) rotateX(" + (-(py - 0.5) * 3.2).toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });

    /* Buttons lean a little toward the cursor */
    $$(".btn, .c-btn, .enq-submit").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        var y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        btn.style.transform = "translate(" + (x * 4).toFixed(1) + "px, " + (y * 3 - 2).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });

    /* Hero photo drifts gently against the scroll */
    var heroPhoto = $(".hero-photo");
    if (heroPhoto) {
      var heroTicking = false;
      window.addEventListener("scroll", function () {
        if (heroTicking) return;
        heroTicking = true;
        requestAnimationFrame(function () {
          var y = window.scrollY || 0;
          if (y < 900) heroPhoto.style.transform = "translateY(" + (y * -0.045).toFixed(1) + "px)";
          heroTicking = false;
        });
      }, { passive: true });
    }
  }
})();
