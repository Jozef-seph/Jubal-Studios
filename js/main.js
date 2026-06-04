(function () {
  "use strict";

  /**
   * Studio WhatsApp (digits only, country code, no +).
   * Used for manual `wa.me` links, `JubalStudios.openWhatsApp()`, the contact page composer, and booking forms (submit opens WhatsApp with details).
   */
  var WHATSAPP_NUMBER = "254798392626";

  var STUDIO_EMAIL = "jubalstudios20@gmail.com";
  var STUDIO_PHONE = "+254 798 392 626";

  /** Encoded URL length safety (WhatsApp / browsers vary; stay conservative). */
  var WA_MAX_ENCODED_LENGTH = 2800;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function showToast(title, message, durationMs) {
    var existing = qs("#site-toast");
    if (existing) existing.remove();

    var el = document.createElement("div");
    el.id = "site-toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.innerHTML =
      "<strong>" +
      escapeHtml(title) +
      "</strong>" +
      "<span>" +
      escapeHtml(message) +
      "</span>";

    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("is-visible");
    });

    var ms = typeof durationMs === "number" && durationMs > 0 ? durationMs : 6500;
    window.setTimeout(function () {
      el.classList.remove("is-visible");
      window.setTimeout(function () {
        el.remove();
      }, 400);
    }, ms);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Strip WhatsApp formatting chars from user-supplied values so layout stays readable. */
  function waSanitizeValue(s) {
    return String(s || "")
      .replace(/\r\n/g, "\n")
      .replace(/\*/g, "·")
      .replace(/_/g, "·")
      .replace(/~/g, "·")
      .trim();
  }

  function humanizeFieldName(name) {
    if (!name) return "Field";
    return String(name)
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, function (c) {
        return c.toUpperCase();
      });
  }

  function getControlLabel(el, form) {
    var custom = el.getAttribute("data-wa-label");
    if (custom && custom.trim()) return custom.trim();

    if (el.id) {
      var lab = form.querySelector('label[for="' + el.id + '"]');
      if (lab && lab.textContent) {
        return lab.textContent.replace(/\s+/g, " ").replace(/:$/, "").trim();
      }
    }

    if (el.getAttribute("aria-label")) {
      return el.getAttribute("aria-label").trim();
    }

    return humanizeFieldName(el.name);
  }

  function formatFieldValue(el) {
    var raw = (el.value || "").trim();
    if (!raw) return "—";

    if (el.type === "date") {
      try {
        var d = new Date(raw + "T12:00:00");
        if (!isNaN(d.getTime())) {
          var human = d.toLocaleDateString("en-KE", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return raw + " (" + human + ")";
        }
      } catch (e) {
        /* ignore */
      }
    }

    if (el.type === "time") {
      return raw;
    }

    return waSanitizeValue(raw);
  }

  /**
   * Full booking message for WhatsApp: title, every field with label, footer.
   */
  function buildBookingWhatsAppMessage(form) {
    var title = form.getAttribute("data-booking-title") || "Studio booking request";
    var lines = [];

    lines.push("*Jubal Studios*");
    lines.push("*" + title + "*");
    lines.push("");

    qsa("input, select, textarea", form).forEach(function (el) {
      if (!el.name) return;
      if (el.type === "submit" || el.type === "button" || el.type === "hidden") return;

      var label = getControlLabel(el, form);
      var value = formatFieldValue(el);
      lines.push("*" + label + ":* " + value);
    });

    lines.push("");
    lines.push("_Sent from the Jubal Studios website booking form._");

    return lines.join("\n");
  }

  function buildContactWhatsAppMessage(nameEl, messageEl) {
    var name = nameEl && String(nameEl.value || "").trim();
    var msg = messageEl && String(messageEl.value || "").trim();
    var lines = [];
    lines.push("*Jubal Studios — contact enquiry*");
    lines.push("");
    lines.push("*Name:* " + (name ? waSanitizeValue(name) : "—"));
    lines.push("*Message:*");
    lines.push(waSanitizeValue(msg));
    lines.push("");
    lines.push("_Sent from the Jubal Studios contact page._");
    return lines.join("\n");
  }

  function openWhatsAppWithText(text) {
    var encoded = encodeURIComponent(text);
    if (encoded.length > WA_MAX_ENCODED_LENGTH) {
      showToast(
        "Message too long for WhatsApp",
        "Please shorten your notes and try again, or call the studio."
      );
      return false;
    }

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encoded;
    var win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win || typeof win.closed === "undefined" || win.closed) {
      window.location.href = url;
    }
    return true;
  }

  function initFooterYear() {
    var y = qs("#y");
    if (y) {
      y.textContent = String(new Date().getFullYear());
    }
  }

  function initNav() {
    var toggle = qs("[data-nav-toggle]");
    var nav = qs("[data-site-nav]");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    qsa("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    var page = document.body.getAttribute("data-page");
    /** Pages without their own nav tab highlight the closest hub. */
    var navKey = page;
    if (page === "recording" || page === "rehearsal") {
      navKey = "services";
    }
    if (navKey) {
      qsa('a[data-nav="' + navKey + '"]', nav).forEach(function (a) {
        a.setAttribute("aria-current", "page");
      });
    }
  }

  function validateRequired(form) {
    var ok = true;
    qsa("[data-required]", form).forEach(function (field) {
      var err = form.querySelector('[data-error-for="' + field.name + '"]');
      var empty =
        field.type === "checkbox"
          ? !field.checked
          : String(field.value || "").trim() === "";

      if (err) {
        err.classList.toggle("is-visible", empty);
        err.textContent = empty ? "This field is required." : "";
      }
      if (empty) ok = false;
    });

    var email = qs('input[type="email"]', form);
    if (email && String(email.value).trim()) {
      var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value)) {
        ok = false;
        var emsg = form.querySelector('[data-error-for="' + email.name + '"]');
        if (emsg) {
          emsg.classList.add("is-visible");
          emsg.textContent = "Enter a valid email address.";
        }
      }
    }

    return ok;
  }

  function initContactWhatsApp() {
    qsa("[data-wa-contact-card]").forEach(function (card) {
      var nameEl = qs("#wa-c-name", card);
      var messageEl = qs("#wa-c-message", card);
      var err = qs('[data-error-for="contact_message"]', card);
      var btn = qs("[data-wa-contact-send]", card);

      if (messageEl && err) {
        messageEl.addEventListener("input", function () {
          if (String(messageEl.value || "").trim()) {
            err.classList.remove("is-visible");
            err.textContent = "";
          }
        });
      }

      if (!btn) return;

      btn.addEventListener("click", function () {
        var msg = messageEl ? String(messageEl.value || "").trim() : "";
        if (!msg) {
          if (err) {
            err.classList.add("is-visible");
            err.textContent = "Please add a short message before opening WhatsApp.";
          }
          if (messageEl) messageEl.focus();
          showToast("Add a message", "Tell us what you need so we can help when you chat.");
          return;
        }

        if (err) {
          err.classList.remove("is-visible");
          err.textContent = "";
        }

        var text = buildContactWhatsAppMessage(nameEl, messageEl);
        openWhatsAppWithText(text);
      });
    });
  }

  function initForms() {
    qsa("[data-booking-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateRequired(form)) {
          showToast("Check the form", "Please fill in all required fields.");
          return;
        }

        qsa(".field-error", form).forEach(function (err) {
          err.classList.remove("is-visible");
          err.textContent = "";
        });

        var text = buildBookingWhatsAppMessage(form);
        if (!openWhatsAppWithText(text)) {
          return;
        }

        showToast(
          "WhatsApp",
          "Send the prefilled message in WhatsApp to complete your booking request.",
          8000
        );

        window.setTimeout(function () {
          form.reset();
        }, 1500);
      });
    });
  }

  function readRootCssVar(name) {
    return String(
      getComputedStyle(document.documentElement).getPropertyValue(name) || ""
    ).trim();
  }

  function initWaPrefill() {
    var fontVarNames = [
      "--font-serif",
      "--font-sans",
      "--font-display",
      "--font-weight-normal",
      "--font-weight-regular",
      "--font-weight-medium",
      "--font-weight-semibold",
      "--font-weight-bold",
    ];
    var cssVariables = {};
    fontVarNames.forEach(function (name) {
      cssVariables[name] = readRootCssVar(name);
    });

    var data = {
      cssVariables: cssVariables,
    };

    window.JubalStudios = {
      whatsappNumber: WHATSAPP_NUMBER,
      email: STUDIO_EMAIL,
      phone: STUDIO_PHONE,
      /** Resolved font tokens from `:root` (for embeds, canvas, or external scripts). */
      data: data,
      openWhatsApp: function (presetText) {
        var text = presetText || "Hi Jubal Studios, I'd like to book a session.";
        openWhatsAppWithText(text);
      },
      /** Build the same message the booking form would send (for debugging). */
      previewBookingMessage: function (formEl) {
        if (!formEl || !formEl.getAttribute) return "";
        return buildBookingWhatsAppMessage(formEl);
      },
    };
  }

  function initHeroMotionPause() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var img = qs(".hero-bg img");
    if (!img || typeof IntersectionObserver === "undefined") return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var on = e.isIntersecting;
          img.style.animationPlayState = on ? "running" : "paused";
          img.style.willChange = on ? "transform" : "auto";
        });
      },
      { root: null, rootMargin: "48px 0px 48px 0px", threshold: 0 }
    );

    var hero = img.closest(".hero");
    io.observe(hero || img);
  }

  initNav();
  initFooterYear();
  initContactWhatsApp();
  initForms();
  initWaPrefill();
  initHeroMotionPause();
})();
