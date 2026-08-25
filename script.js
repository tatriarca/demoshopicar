/* ==========================================================================
   SHOPICAR — script.js (vanilla, sin dependencias, ~3kb)
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONFIGURACIÓN — número de WhatsApp
     Cambia este número (con código de país, sin +, sin espacios) y TODOS
     los botones de "Acción" del sitio (los que tienen la clase "wa-cta")
     apuntarán automáticamente al número correcto.
     Formato México: 52 + 10 dígitos. Ej. 55 7795 0703 -> 525577950703
     ------------------------------------------------------------------ */
  var CONFIG = {
    whatsappNumber: "525577950703" // <-- EDITA AQUÍ TU NÚMERO DE WHATSAPP
  };

  function buildWhatsAppLink(message) {
    var base = "https://wa.me/" + CONFIG.whatsappNumber;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  document.addEventListener("DOMContentLoaded", function () {

    /* -- Construir todos los enlaces de WhatsApp (botones CTA + flotante) -- */
    var waLinks = document.querySelectorAll(".wa-cta");
    waLinks.forEach(function (el) {
      var msg = el.getAttribute("data-wa-msg") || "Hola Shopicar, quiero más información.";
      el.setAttribute("href", buildWhatsAppLink(msg));
    });

    /* -- Menú móvil -- */
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var isOpen = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    /* -- Header con sombra al hacer scroll -- */
    var header = document.getElementById("siteHeader");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* -- Revelado al hacer scroll --
       Nota: algunos navegadores móviles retrasan el primer cálculo de
       IntersectionObserver hasta el primer scroll/touch, lo que dejaba
       elementos "invisibles" hasta que el usuario tocaba la pantalla.
       Por eso, aquí primero revelamos de inmediato cualquier elemento
       que ya esté visible en el viewport al cargar, y solo dejamos el
       observer para lo que está más abajo en la página. */
    var revealEls = document.querySelectorAll(".reveal");

    function isInViewport(el) {
      var rect = el.getBoundingClientRect();
      return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    }

    function revealNow(el) { el.classList.add("is-visible"); }

    var pending = [];
    revealEls.forEach(function (el) {
      if (isInViewport(el)) { revealNow(el); } else { pending.push(el); }
    });

    if ("IntersectionObserver" in window && pending.length) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              revealNow(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      pending.forEach(function (el) { io.observe(el); });
    } else {
      pending.forEach(revealNow);
    }

    /* Al restaurar la página desde el caché de retroceso (bfcache) en
       iOS/Safari, algunos elementos pueden quedar marcados como no
       visibles: forzamos que todo se muestre de nuevo. */
    window.addEventListener("pageshow", function (event) {
      if (event.persisted) { revealEls.forEach(revealNow); }
    });

    /* -- Año dinámico en el footer -- */
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* -- Validación simple del formulario de cotización antes de enviar -- */
    var form = document.getElementById("quoteForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        var nombre = form.querySelector("#nombre");
        var correo = form.querySelector("#correo");
        var telefono = form.querySelector("#telefono");
        var valid = nombre.value.trim() && correo.value.trim() && telefono.value.trim();
        if (!valid) {
          e.preventDefault();
          alert("Por favor completa nombre, correo y teléfono para enviarte tu cotización.");
        }
      });
    }

    /* -- Si venimos de un envío exitoso del formulario (?enviado=true) -- */
    if (window.location.search.indexOf("enviado=true") > -1) {
      var contactSection = document.getElementById("contacto");
      if (contactSection) {
        var banner = document.createElement("div");
        banner.textContent = "¡Gracias! Tu cotización fue enviada, en breve un asesor te contactará.";
        banner.style.cssText =
          "background:#25d366;color:#fff;padding:14px 18px;border-radius:8px;margin-bottom:24px;font-weight:600;text-align:center;";
        contactSection.querySelector(".wrap").prepend(banner);
      }
    }
  });
})();
