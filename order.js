/* ==========================================================================
   LocalWire order form
   Edit CONFIG only. Everything below it reads from here.
   ========================================================================== */
const CONFIG = {
  brandName: "LocalWire.media",
  subtitle:
    "Pick the sites, add your articles, and pay with PayPal. Posts go live within 2–4 business days after payment.",
  offerText: "October special: $20 per post. Buy 5, get the 6th free",

  pricePerPost: 20,
  currency: "$",
  currencyCode: "USD",
  // Every (buy + free) posts, `free` of them cost nothing. 5 + 1 = every 6th post free.
  bulkOffer: { buy: 5, free: 1 },

  paypalEmail: "marksteven002679@gmail.com",
  paypalFeePercent: 6,

  // Same Web3Forms key as the contact form on index.html — orders land in that inbox.
  web3formsKey: "ac0034b8-6374-4c45-a278-66d264969d27",
  fallbackEmail: "hello@localwire.media",

  afterPaymentNote:
    "After paying, reply to our confirmation email with your PayPal transaction ID. Posts go live within 2–4 business days after payment.",

  redirectToPayPalMs: 1500,

  sites: [
    "ocnjdaily.com", "phillydaily.com", "northpennnow.com", "wissnow.com",
    "centralbucksnews.com", "perkvalleynow.com", "horshamnow.com", "willowgrovenow.com",
    "delconow.com", "lancasterindependence.com", "bucksindependence.com", "breakingac.com",
    "downbeach.com", "seaislenews.com", "somerspoint.com", "capemaynjdaily.com",
    "onpattison.com", "myphillytickets.com", "broadandliberty.com", "nerdbot.com",
    "ourcodeworld.com",
  ],
};

/* ========================================================================== */

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) =>
    CONFIG.currency + (Number.isInteger(n) ? n.toLocaleString("en-US") : n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  const ordinal = (n) => n + (["th", "st", "nd", "rd"][(n % 100 >> 3) ^ 1 && n % 10] || "th");

  const form = $("#orderForm");
  if (!form) return;

  const selected = new Set();
  const postData = {}; // site -> { doc, target, anchor }

  /* ---------- Static text ---------- */
  $("[data-subtitle]").textContent = CONFIG.subtitle;
  if (CONFIG.offerText) {
    const offer = $("[data-offer]");
    offer.textContent = CONFIG.offerText;
    offer.hidden = false;
  }
  const offer = CONFIG.bulkOffer;
  const bundle = offer ? offer.buy + offer.free : 0;
  $("[data-price-hint]").textContent =
    `${money(CONFIG.pricePerPost)} per post` +
    (offer ? `. Buy ${offer.buy}, get ${offer.free === 1 ? `the ${ordinal(bundle)}` : offer.free} free.` : ".");
  $("[data-pay-hint]").textContent =
    `Payment by PayPal. Total includes a ${CONFIG.paypalFeePercent}% PayPal processing fee.`;

  /* ---------- Site list ---------- */
  const sitesEl = $("[data-sites]");
  sitesEl.insertAdjacentHTML(
    "beforeend",
    CONFIG.sites
      .map((s) => `<label class="site-option"><input type="checkbox" value="${esc(s)}" /><span>${esc(s).replace(/\.(?=[^.]+$)/, "<wbr>.")}</span></label>`)
      .join("")
  );

  sitesEl.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    e.target.checked ? selected.add(e.target.value) : selected.delete(e.target.value);
    renderPosts();
  });

  $$("[data-select]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const on = btn.dataset.select === "all";
      $$("input[type=checkbox]", sitesEl).forEach((i) => {
        i.checked = on;
        on ? selected.add(i.value) : selected.delete(i.value);
      });
      renderPosts();
    })
  );

  const orderedSel = () => CONFIG.sites.filter((s) => selected.has(s));

  /* ---------- Post detail blocks ---------- */
  function saveInputs() {
    $$(".post-block").forEach((p) => {
      postData[p.dataset.site] = {
        doc: $("[data-f=doc]", p).value,
        target: $("[data-f=target]", p).value,
        anchor: $("[data-f=anchor]", p).value,
      };
    });
  }

  function renderPosts() {
    saveInputs();
    const list = orderedSel();

    $("[data-posts]").innerHTML = list.length
      ? list
          .map((s, i) => {
            const d = postData[s] || {};
            const id = `p${i}`;
            return `<div class="post-block" data-site="${esc(s)}">
              <h3>${esc(s)}</h3>
              <div class="field-grid">
                <label class="o-field"><span>Article link (Google Doc) <em>required</em></span>
                  <input type="url" id="${id}-doc" data-f="doc" inputmode="url" placeholder="https://docs.google.com/…" value="${esc(d.doc)}" /></label>
                <label class="o-field"><span>Target URL <em>required</em></span>
                  <input type="url" id="${id}-target" data-f="target" inputmode="url" placeholder="https://yoursite.com/page" value="${esc(d.target)}" /></label>
                <label class="o-field o-field-wide"><span>Anchor text</span>
                  <input type="text" id="${id}-anchor" data-f="anchor" value="${esc(d.anchor)}" /></label>
              </div>
            </div>`;
          })
          .join("")
      : `<p class="posts-empty">Choose at least one website in step 2 to add post details here.</p>`;

    $("[data-site-count]").textContent = list.length ? `${list.length} selected` : "";
    updateTotal();
  }

  /* ---------- Pricing ---------- */
  function calc() {
    const n = selected.size;
    const free = bundle ? Math.floor(n / bundle) * offer.free : 0;
    const paid = n - free;
    const subtotal = paid * CONFIG.pricePerPost;
    const fee = Math.round(subtotal * CONFIG.paypalFeePercent) / 100;
    const total = Math.round((subtotal + fee) * 100) / 100;
    return { n, free, paid, subtotal, fee, total };
  }

  function breakdownRows(c) {
    return [
      [`Posts (${c.n})`, c.n ? `${c.paid} × ${money(CONFIG.pricePerPost)}${c.free ? ` + ${c.free} free` : ""}` : "None yet"],
      ["Subtotal", money(c.subtotal)],
      [`PayPal fee (${CONFIG.paypalFeePercent}%)`, money(c.fee)],
    ];
  }

  const dl = (rows) => rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");

  function offerNudge(c) {
    if (!bundle || c.n === 0) return "";
    const toNext = bundle - (c.n % bundle);
    const freeWord = offer.free === 1 ? "it’s free" : `${offer.free} are free`;
    if (toNext === offer.free) return `Add ${offer.free === 1 ? "1 more site" : `${offer.free} more sites`}: ${freeWord}.`;
    if (c.free) return `You’ve unlocked ${c.free} free post${c.free > 1 ? "s" : ""}. ${toNext} more site${toNext > 1 ? "s" : ""} for the next one.`;
    return `Add ${toNext - offer.free} more site${toNext - offer.free > 1 ? "s" : ""} and get the next one free.`;
  }

  function updateTotal() {
    const c = calc();
    const nudge = $("[data-nudge]");
    nudge.textContent = offerNudge(c);
    nudge.hidden = !nudge.textContent;
    nudge.classList.toggle("is-unlock", bundle > 0 && c.n % bundle === bundle - 1);
    $("[data-breakdown]").innerHTML = dl(breakdownRows(c));
    $("[data-total]").textContent = money(c.total);
  }

  /* ---------- Validation ---------- */
  const isHttpUrl = (v) => {
    try {
      const u = new URL(v.trim());
      return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
    } catch {
      return false;
    }
  };

  function setInvalid(el, bad) {
    el.setAttribute("aria-invalid", bad ? "true" : "false");
  }

  function validate() {
    saveInputs();
    let firstBad = null;
    const mark = (el, bad) => {
      setInvalid(el, bad);
      if (bad && !firstBad) firstBad = el;
    };

    mark(form.elements.name, !form.elements.name.value.trim());
    mark(form.elements.email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.elements.email.value.trim()));
    if (firstBad) return { el: firstBad, msg: "Add your name and a valid email address." };

    const list = orderedSel();
    if (!list.length) return { el: $("input", sitesEl), msg: "Choose at least one website." };

    const badSites = [];
    $$(".post-block").forEach((p) => {
      const doc = $("[data-f=doc]", p);
      const target = $("[data-f=target]", p);
      const docBad = !isHttpUrl(doc.value);
      const targetBad = !isHttpUrl(target.value);
      mark(doc, docBad);
      mark(target, targetBad);
      if (docBad || targetBad) badSites.push(p.dataset.site);
    });
    if (badSites.length) {
      return {
        el: firstBad,
        msg: `Add a full article link and target URL (starting with https://) for: ${badSites.join(", ")}.`,
      };
    }
    return null;
  }

  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") setInvalid(e.target, false);
    if (!$("[aria-invalid=true]", form)) {
      errEl.className = "form-status";
      errEl.textContent = "";
    }
  });

  /* ---------- Submit ---------- */
  const errEl = $("[data-error]");
  const showError = (msg) => {
    errEl.textContent = msg;
    errEl.className = "form-status is-visible is-error";
  };

  const makeOrderId = () => {
    const d = new Date();
    const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
    return `LW-${ymd}-${rnd}`;
  };

  function paypalLink(total, id, n) {
    const p = new URLSearchParams({
      cmd: "_xclick",
      business: CONFIG.paypalEmail,
      item_name: `${CONFIG.brandName} — ${n} guest post${n > 1 ? "s" : ""} (${id})`,
      item_number: id,
      invoice: id,
      amount: total.toFixed(2),
      currency_code: CONFIG.currencyCode,
      no_shipping: "1",
    });
    return "https://www.paypal.com/cgi-bin/webscr?" + p.toString();
  }

  let submitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (submitting) return;
    errEl.className = "form-status";
    errEl.textContent = "";

    const problem = validate();
    if (problem) {
      showError(problem.msg);
      problem.el?.focus();
      return;
    }

    const list = orderedSel();
    const c = calc();
    const id = makeOrderId();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();

    const postsText = list
      .map((s, i) => {
        const d = postData[s];
        return `${i + 1}. ${s}\n   Article: ${d.doc.trim()}\n   Target: ${d.target.trim()}\n   Anchor: ${d.anchor.trim() || "-"}`;
      })
      .join("\n\n");

    const orderFields = {
      "Order ID": id,
      Name: name,
      Email: email,
      Company: form.elements.company.value.trim() || "-",
      "Phone / WhatsApp": form.elements.phone.value.trim() || "-",
      Websites: `${c.n} (${c.paid} paid${c.free ? `, ${c.free} free` : ""})`,
      Subtotal: money(c.subtotal),
      [`PayPal fee (${CONFIG.paypalFeePercent}%)`]: money(c.fee),
      Total: money(c.total),
      "Payment method": "PayPal",
      Posts: postsText,
      Notes: form.elements.notes.value.trim() || "-",
    };

    const payload = {
      access_key: CONFIG.web3formsKey,
      subject: `New order ${id} — ${name} — ${money(c.total)}`,
      from_name: "LocalWire Order Form",
      name,
      email,
      botcheck: form.elements.botcheck.checked,
      ...Object.fromEntries(Object.entries(orderFields).filter(([k]) => k !== "Name" && k !== "Email")),
    };

    const btn = $("[data-submit]");
    const btnText = btn.textContent;
    submitting = true;
    btn.disabled = true;
    btn.textContent = "Sending order…";

    let sent = false;
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await r.json().catch(() => ({}));
      sent = r.ok && result.success !== false;
    } catch {
      sent = false;
    }

    submitting = false;
    btn.disabled = false;
    btn.textContent = btnText;

    const mailBody = Object.entries(orderFields).map(([k, v]) => `${k}: ${v}`).join("\n");
    const mailLink = `mailto:${CONFIG.fallbackEmail}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(mailBody)}`;

    showDone({ id, name, email, list, c, sent, mailLink });

    if (sent && c.total > 0 && CONFIG.redirectToPayPalMs >= 0) {
      setTimeout(() => {
        window.location.href = paypalLink(c.total, id, list.length);
      }, CONFIG.redirectToPayPalMs);
    }
  });

  /* ---------- Confirmation ---------- */
  function showDone({ id, name, email, list, c, sent, mailLink }) {
    $("#orderView").hidden = true;
    $("#doneView").hidden = false;
    window.scrollTo(0, 0);

    $("[data-done-id]").textContent = id;
    $("[data-done-summary]").innerHTML = dl([
      ["Name", name],
      ["Email", email],
      ["Websites", list.join(", ")],
      ...breakdownRows(c).slice(1),
      ["Total", money(c.total)],
    ]);

    const title = $("[data-pay-title]");
    const text = $("[data-pay-text]");
    const box = $("[data-pay-box]");
    const after = $("[data-pay-after]");

    if (!sent) {
      $("[data-done-title]").textContent = "One more step to send your order";
    }

    if (c.total === 0) {
      title.textContent = "No payment needed";
      text.innerHTML = sent
        ? "No payment is due for this order. We’ll get started and email you when it’s live."
        : `We couldn’t send your order automatically. <a href="${esc(mailLink)}">Email it to us</a> and we’ll get started.`;
      box.hidden = true;
      $("[data-done-title]").focus();
      return;
    }

    text.innerHTML = sent
      ? "Taking you to PayPal now. If nothing happens, use the button below."
      : `We couldn’t send your order automatically. <a href="${esc(mailLink)}">Email it to us</a>, then pay with the button below.`;

    box.innerHTML =
      [
        ["PayPal email", CONFIG.paypalEmail],
        ["Amount", money(c.total)],
        ["Payment note", id],
      ]
        .map(
          ([k, v]) =>
            `<div class="pay-row"><span>${esc(k)}</span><span><b>${esc(v)}</b><button type="button" class="copy-btn" data-copy="${esc(v)}">Copy</button></span></div>`
        )
        .join("") +
      `<a class="button button-primary button-full" href="${esc(paypalLink(c.total, id, list.length))}">Pay ${money(c.total)} with PayPal</a>`;

    after.textContent = CONFIG.afterPaymentNote;
    $("[data-done-title]").focus();
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    navigator.clipboard?.writeText(btn.dataset.copy).then(() => {
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = "Copy"), 1200);
    });
  });

  updateTotal();
})();
