(() => {
  "use strict";
  // Everything here runs locally in the browser.
  // No network requests, cookies, or storage of any kind.

  const $ = (s) => document.querySelector(s);

  // ---------- Toast message ----------
  let toastTimer;
  function toast(msg, ms = 3500) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast";
      t.setAttribute("role", "status");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  }

  // ---------- Multi-click helper ----------
  function multiClick(el, n, ms, fn) {
    if (!el) return;
    let count = 0, timer;
    el.addEventListener("click", () => {
      count++;
      clearTimeout(timer);
      timer = setTimeout(() => (count = 0), ms);
      if (count >= n) { count = 0; fn(); }
    });
  }

  // ---------- Egg: channel static (Konami code) ----------
  function staticBurst() {
    const s = document.createElement("div");
    s.id = "static";
    document.body.appendChild(s);
    toast("CHANNEL CHANGED. NOTHING IS ON.");
    setTimeout(() => s.remove(), 1500);
  }

  const konami = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kPos = 0;

  // ---------- Egg: typed words ----------
  const words = {
    jay: "that's me.",
    rose: "by any other name, still a backend.",
    sudo: "nice try. permission denied.",
    backend: "you're standing in it.",
    youtube: "the big red button is right there."
  };
  let buffer = "";

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    // Konami tracking
    kPos = k === konami[kPos] ? kPos + 1 : (k === konami[0] ? 1 : 0);
    if (kPos === konami.length) { kPos = 0; staticBurst(); }

    // Typed-word tracking
    if (e.key.length === 1) {
      buffer = (buffer + k).slice(-10);
      for (const w in words) {
        if (buffer.endsWith(w)) { toast(words[w]); buffer = ""; break; }
      }
    }
  });

  // ---------- Egg: white mode (click title 5x) ----------
  multiClick($("h1"), 5, 2000, () => {
    const on = document.documentElement.classList.toggle("inverted");
    toast(on ? "WHITE MODE. WHY WOULD YOU DO THIS." : "back to the dark. good choice.");
  });

  // ---------- Egg: changing subtitle (click h2 3x) ----------
  const h2 = $("h2");
  if (h2) {
    const lines = [
      h2.textContent,
      "...seriously, how?",
      "...did someone send you?",
      "...are you lost or just nosy?",
      "...there's really nothing here.",
      "...okay, there's a little something here."
    ];
    let i = 0;
    multiClick(h2, 3, 1500, () => {
      i = (i + 1) % lines.length;
      h2.textContent = lines[i];
    });
  }

  // ---------- Egg: secret page (click © 3x) ----------
  multiClick($("#key"), 3, 1500, () => {
    window.location.href = "secret.html";
  });

  // ---------- Egg: idle message ----------
  let idle;
  const resetIdle = () => {
    clearTimeout(idle);
    idle = setTimeout(
      () => toast("still there? the backend is watching. (it isn't. nothing is collected.)", 6000),
      45000
    );
  };
  ["mousemove", "keydown", "touchstart", "scroll"].forEach((ev) =>
    document.addEventListener(ev, resetIdle, { passive: true })
  );
  resetIdle();

  // ---------- Egg: console message ----------
  console.log(
    "%c[soul stealer jay]%c\nOh, you opened DevTools. Respect.\nThere's a secret page. Try clicking the © in the footer three times.",
    "color:#ff1a1a;font-size:20px;font-weight:bold;",
    "color:#aaa;font-size:12px;"
  );
})();
