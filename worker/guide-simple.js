// Mode simple du guide (ajout propre à cette copie, absent du dépôt d'origine).
// Ajouté à la fin de la page /guide sans toucher à guide.js : ne garde à l'écran que les étapes et range
// les explications (le « pourquoi ») dans des bulles « ? », visibles au survol ou au toucher.
// Seul ce mode est proposé : le guide complet n'est plus accessible.

const CSS = `
html.nvs-on .secret, html.nvs-on #reclames, html.nvs-on #r-dots, html.nvs-on .entracte,
html.nvs-on .hero > p:not(.tagline):not(.nvs-barre) { display: none !important; }
html.nvs-on .act ol > li, html.nvs-on .act ul > li { margin-bottom: .45em; }
.nvs-puces { margin: .5em 0 .2em; padding-left: 1.3em; list-style: disc; }
.nvs-puces > li { margin: .25em 0 !important; padding: 0 !important; }
.nvs-puces > li::before { content: none !important; }
.nvs-barre { display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: center; justify-content: center; margin: 14px 0 0; font-size: .95rem; color: var(--dim, #b9a59c); }
.nvs-bascule { font: inherit; font-weight: 600; color: var(--velvet, #170c12); background: var(--bulb, #ffcf6b); border: 0; border-radius: 999px; padding: 7px 16px; cursor: pointer; }
.nvs-bascule:focus-visible, .nvs-q:focus-visible { outline: 2px solid var(--cream, #f5ead8); outline-offset: 2px; }
.nvs-q { display: inline-grid; place-items: center; width: 1.35em; height: 1.35em; margin-left: .4em; padding: 0; vertical-align: .1em;
  font: 700 .8rem/1 var(--body, system-ui, sans-serif); color: var(--bulb, #ffcf6b); background: transparent;
  border: 1.5px solid currentColor; border-radius: 50%; cursor: help; opacity: .8; }
.nvs-q:hover, .nvs-q[aria-expanded="true"] { opacity: 1; background: rgba(255, 207, 107, .15); }
h2 .nvs-q, h3 .nvs-q { font-size: .75rem; vertical-align: .35em; }
.nvs-bulle { position: fixed; z-index: 96; max-width: min(360px, calc(100vw - 32px)); padding: 12px 14px; border-radius: 10px;
  background: var(--seat, #3d2230); color: var(--cream, #f5ead8); border: 1px solid rgba(255, 207, 107, .45);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .5); font: 400 .9rem/1.45 var(--body, system-ui, sans-serif); text-align: left; }
.nvs-bulle[hidden] { display: none; }
.nvs-bulle p { margin: 0 0 .5em; } .nvs-bulle p:last-child { margin-bottom: 0; }
.nvs-bulle a { color: var(--bulb, #ffcf6b); }
`;

const JS = String.raw`(() => {
  // Le mode simple est le seul proposé : plus de bascule vers le guide complet (ancien choix oublié).
  const simple = true;
  try { localStorage.removeItem("nvs-mode"); } catch (e) {}

  // Rappel sous le titre.
  const hero = document.querySelector(".hero");
  if (hero) {
    const barre = document.createElement("p");
    barre.className = "nvs-barre";
    barre.innerHTML = '<span>Survole ou touche un <b>?</b> pour savoir pourquoi.</span>';
    const tag = hero.querySelector(".tagline");
    (tag || hero.lastElementChild).after(barre);
  }
  // Addons non retenus sur cette copie (StreamFusion, Torrentio) : cartes masquées (pas supprimées, la page
  // met encore à jour leurs champs) et mentions retirées des textes, dans les deux modes.
  try {
    document.querySelectorAll("article.addon").forEach((a) => {
      const h = a.querySelector("h3");
      if (h && /^\s*(StreamFusion|Torrentio)/i.test(h.textContent)) a.style.display = "none";
    });
    const MENTIONS = [
      [/Lumio, StreamFusion, Torrentio et WAStream/g, "Lumio et WAStream"],
      [/Lumio, StreamFusion, Torrentio, WAStream/g, "Lumio, WAStream"],
      [/le guide la met tout seul dans le lien de Torrentio, et la garde sous la main pour les autres addons de sources/g, "le guide la garde sous la main pour les addons de sources"],
      [/Le guide s'en sert pour préparer le lien de Torrentio et te dire quoi cocher dans les autres addons/g, "Le guide s'en sert pour te dire quoi cocher dans les addons"],
      [/Torrentio et les autres addons donnent/g, "les addons de sources donnent"],
    ];
    // Étape 2 : pas d'installation « Avec Claude », seulement à la main (sélecteur, volets et badges masqués).
    document.querySelectorAll("#installer .modes, #installer .claude-dispo").forEach((e) => { e.style.display = "none"; });
    document.querySelectorAll('#installer .mode-pane[data-pane="claude"]').forEach((e) => { e.hidden = true; e.style.display = "none"; });
    document.querySelectorAll('#installer .mode-pane[data-pane="main"]').forEach((e) => { e.hidden = false; });

    // Seul AllDebrid est proposé : « Real-Debrid ou TorBox marchent aussi. » disparaît.
    document.querySelectorAll('a[href*="real-debrid.com"]').forEach((rd) => {
      const tb = rd.parentElement && rd.parentElement.querySelector('a[href*="torbox.app"]');
      const fin = tb && tb.nextSibling;
      if (!fin || fin.nodeType !== 3 || !/^\s*marchent aussi\.?/.test(fin.nodeValue)) return;
      let n = rd;
      while (n && n !== tb) { const s = n.nextSibling; n.remove(); n = s; }
      tb.remove();
      fin.nodeValue = fin.nodeValue.replace(/^\s*marchent aussi\.?/, "");
      const avant = fin.previousSibling;
      if (avant && avant.nodeType === 3) avant.nodeValue = avant.nodeValue.replace(/\s+$/, "");
    });
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode()); ) {
      if (!/StreamFusion|Torrentio/.test(n.nodeValue) || n.parentElement.closest("script,style")) continue;
      let v = n.nodeValue;
      MENTIONS.forEach(([re, par]) => { v = v.replace(re, par); });
      if (v !== n.nodeValue) n.nodeValue = v;
    }
  } catch (e) { console.warn("Mode simple du guide :", e); }

  // La liste à puces des réglages TMDB vaut pour les deux modes ; le reste seulement pour le mode simple.
  if (simple) document.documentElement.classList.add("nvs-on");

  // Ce qui ne doit jamais bouger : éléments interactifs ou mis à jour par la page.
  const ACTION = "button,input,select,textarea,code,.copy,.path,.pick,[id],[data-copy],[hidden],[data-consigne],form,canvas,svg";
  const HORS = "li,details,summary,header,.nv,.pupitre,.photo-diag,.trousseau,.reclames,.entracte,.copy,.cle-ad,.modes,.salle2,.qr-modal,.nvs-bulle,.addon-perso,.seance";
  const VERBES = /^(?:puis |ensuite |enfin )?(?:[^,:.]{1,45}, )?(?:puis |ensuite )?(ouvre|choisis|copie|colle|active|désactive|appuie|tape|installe|va|mets|règle|clique|coche|décoche|vérifie|exclus|scanne|note|autorise|accepte|garde|laisse|fais|déplace|supprime|retire|remets|ajoute|sélectionne|prends|passe|crée|confirme|renseigne|maintiens|dicte|lance|relance|force|regarde|réinstalle|entre|saisis|valide|connecte|associe|télécharge|glisse|double-clic|réponds|envoie|suis|recopie|limite|baisse|évite|utilise|cherche|ferme|redémarre|reviens|attends|change|mets-la|colle-la|copie-la|active-le|ouvre-la|ouvre-le)\b/i;

  const estAction = (el) => el.matches(ACTION) || !!el.querySelector(ACTION);
  const texte = (s) => (s || "").replace(/\s+/g, " ").trim();
  const imperatif = (s) => VERBES.test(texte(s));

  // Bulle partagée.
  const bulle = document.createElement("div");
  bulle.className = "nvs-bulle"; bulle.setAttribute("role", "tooltip"); bulle.id = "nvs-bulle"; bulle.hidden = true;
  document.body.appendChild(bulle);
  let ouvert = null, epingle = false;
  const placer = (btn) => {
    const r = btn.getBoundingClientRect();
    bulle.style.left = "0px"; bulle.style.top = "0px";
    const b = bulle.getBoundingClientRect();
    let x = r.left + r.width / 2 - b.width / 2;
    x = Math.max(16, Math.min(x, innerWidth - b.width - 16));
    let y = r.bottom + 8;
    if (y + b.height > innerHeight - 8 && r.top - b.height - 8 > 8) y = r.top - b.height - 8;
    bulle.style.left = x + "px"; bulle.style.top = y + "px";
  };
  const montrer = (btn) => {
    if (ouvert && ouvert !== btn) ouvert.setAttribute("aria-expanded", "false");
    ouvert = btn; btn.setAttribute("aria-expanded", "true");
    bulle.innerHTML = btn._nvs.join("");
    bulle.hidden = false; placer(btn);
  };
  const cacher = () => {
    if (ouvert) ouvert.setAttribute("aria-expanded", "false");
    ouvert = null; epingle = false; bulle.hidden = true;
  };
  bulle.addEventListener("mouseenter", () => { clearTimeout(bulle._t); });
  bulle.addEventListener("mouseleave", () => { if (!epingle) cacher(); });
  document.addEventListener("click", (e) => { if (ouvert && !e.target.closest(".nvs-q,.nvs-bulle")) cacher(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cacher(); });
  addEventListener("scroll", () => { if (ouvert) placer(ouvert); }, { passive: true });
  addEventListener("resize", () => { if (ouvert) placer(ouvert); });

  const bouton = () => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "nvs-q"; b.textContent = "?";
    b.setAttribute("aria-label", "Pourquoi ?"); b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-describedby", "nvs-bulle");
    b._nvs = [];
    b.addEventListener("mouseenter", () => { if (!epingle) montrer(b); });
    b.addEventListener("mouseleave", () => { if (!epingle) bulle._t = setTimeout(() => { if (!epingle && !bulle.matches(":hover")) cacher(); }, 150); });
    b.addEventListener("focus", () => { if (!epingle) montrer(b); });
    b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      if (ouvert === b && epingle) cacher(); else { montrer(b); epingle = true; }
    });
    return b;
  };
  const ajouter = (cible, html) => {
    let b = cible.querySelector(":scope > .nvs-q");
    if (!b) { b = bouton(); cible.appendChild(b); }
    b._nvs.push(html);
  };

  // Titre auquel rattacher une explication : le titre précédent le plus proche, sinon celui de la carte ou de l'étape.
  const titreDe = (el) => {
    let n = el;
    while (n && !n.matches("section.act")) {
      let s = n.previousElementSibling;
      while (s) {
        if (s.matches("h2,h3,h4")) return s;
        if (s.matches("header")) { const h = s.querySelector("h2,h3,h4"); if (h) return h; }
        s = s.previousElementSibling;
      }
      n = n.parentElement;
    }
    return n ? n.querySelector("header h2") : null;
  };

  try {
    // 0. Étape 3, réglages TMDB : les cases à décocher en liste à puces, chacune avec son « pourquoi ».
    // Seulement si l'étape contient toujours les quatre réglages (sinon l'original reste tel quel).
    document.querySelectorAll("#francais li").forEach((li) => {
      const t = texte(li.textContent);
      if (!/Intégrations\s*→\s*TMDB/.test(t) || !["Bandes-annonces", "Informations de base", "Détails", "Illustrations"].every((m) => t.includes(m))) return;
      const chemin = li.querySelector(".path");
      li.textContent = "";
      if (chemin) li.appendChild(chemin);
      li.appendChild(document.createTextNode(" : "));
      const b = document.createElement("b"); b.textContent = "Langue → Français"; li.appendChild(b);
      li.appendChild(document.createTextNode(", puis désactive :"));
      const ul = document.createElement("ul");
      ul.className = "nvs-puces";
      [
        ["Bandes-annonces", "Activé, Nuvio prend celles de TMDB, souvent en anglais, à la place de celles du Catalogue FR, qui sont en VF dès qu'une VF existe."],
        ["Informations de base", "Pour voir quand arrivent les films à venir (« 📅 Dispo le 17 nov. » en tête du résumé)."],
        ["Détails", "Pour garder « Entre deux saisons » sur les séries en pause (sinon Nuvio met « En cours »)."],
        ["Illustrations", "Pour garder les fonds en pleine définition et les logos en français du Catalogue FR."],
      ].forEach(([nom, pourquoi]) => {
        const item = document.createElement("li");
        const g = document.createElement("b"); g.textContent = nom; item.appendChild(g);
        const q = bouton(); q._nvs.push("<p>" + pourquoi + "</p>"); item.appendChild(q);
        ul.appendChild(item);
      });
      li.appendChild(ul);
    });

    // Étape 6, carte Catalogue FR : seulement « Personnaliser mon catalogue », puis « Tout envoyer dans Nuvio »
    // sur le billet de la salle 2 (addon, collections et affiches d'un coup). Le reste est masqué, pas supprimé :
    // la page met encore à jour le lien, la séance…
    document.querySelectorAll("#addons article.addon").forEach((a) => {
      const h = a.querySelector("h3");
      const btn = a.querySelector(".perso-actions");
      if (!h || !/^\s*Catalogue FR/.test(h.textContent) || !btn) return;
      [...a.children].forEach((c) => { if (c !== btn && !c.matches("header")) c.style.display = "none"; });
      const consigne = document.createElement("ol");
      consigne.className = "nvs-cat";
      consigne.innerHTML = "<li>Appuie sur <b>Personnaliser mon catalogue</b> et choisis tes rangées, tes plateformes et tes filtres.</li>"
        + "<li>Sur ton billet, appuie sur <b>Tout envoyer dans Nuvio</b> : l'addon, les collections et les affiches arrivent tout seuls.</li>";
      btn.before(consigne);
    });

    if (!simple) return;

    // 1. Paragraphes d'explication : rangés dans le « ? » du titre.
    document.querySelectorAll("section.act p, section.act small, section.act .note").forEach((p) => {
      if (!p.isConnected || p.closest(HORS) || p.parentElement.closest("p")) return;
      if (p.matches(".warn,.consigne,.tagline,.nvs-barre") || p.hasAttribute("id")) return;
      if ([...p.attributes].some((a) => a.name.startsWith("data-"))) return;
      if (estAction(p) || imperatif(p.textContent)) return;
      if (p.matches(".small") && p.nextElementSibling && p.nextElementSibling.matches(".copy")) return;
      if (texte(p.textContent).length < 25) return;
      const h = titreDe(p);
      if (!h) return;
      ajouter(h, "<p>" + p.innerHTML + "</p>");
      p.remove();
    });

    // 2. Dans chaque étape numérotée : on garde la consigne, les phrases d'explication passent dans un « ? ».
    const COUPE = /([.!?…])\s+(?=[A-ZÀÂÉÈÊÎÔÛÇ«(])/;
    document.querySelectorAll("section.act li").forEach((li) => {
      if (li.closest("details,.nv,.pupitre,.photo-diag,.trousseau,.reclames,.modes")) return;
      if (li.querySelector("button,input,select,textarea,code,.copy,[id],[data-copy],[hidden],ol,ul")) return;
      // Découpe en phrases sans casser les éléments (liens, gras, chemins).
      const phrases = [[]];
      [...li.childNodes].forEach((n) => {
        if (n.nodeType !== 3) { phrases[phrases.length - 1].push(n); return; }
        let reste = n.textContent, m;
        while ((m = COUPE.exec(reste))) {
          const fin = m.index + m[1].length;
          phrases[phrases.length - 1].push(document.createTextNode(reste.slice(0, fin)));
          phrases.push([]);
          reste = reste.slice(fin).replace(/^\s+/, "");
        }
        if (reste) phrases[phrases.length - 1].push(document.createTextNode(reste));
      });
      if (phrases.length < 2) return;
      const garde = [], range = [];
      phrases.forEach((ph, i) => {
        const tmp = document.createElement("span");
        ph.forEach((n) => tmp.appendChild(n.nodeType === 3 ? n : n.cloneNode(true)));
        const t = texte(tmp.textContent);
        if (!t) return;
        const action = i === 0 || imperatif(t) || !!tmp.querySelector(".path,a,.pick");
        (action ? garde : range).push(ph);
      });
      // « Fais ceci : parce que… » : la justification après les deux-points part aussi dans la bulle.
      const RAISON = /\s:\s+((?:sinon|sans |activé|désactivé|il |elle |ils |elles |ça |c'est |le guide |nuvio |on |pas besoin )[\s\S]+)$/i;
      garde.forEach((ph) => {
        const der = ph[ph.length - 1];
        if (!der || der.nodeType !== 3) return;
        const m = RAISON.exec(der.textContent);
        if (!m) return;
        der.textContent = der.textContent.slice(0, m.index) + ".";
        const r = m[1].charAt(0).toUpperCase() + m[1].slice(1);
        range.unshift([document.createTextNode(r)]);
      });
      if (!range.length) return;
      li.textContent = "";
      garde.forEach((ph, i) => { if (i) li.appendChild(document.createTextNode(" ")); ph.forEach((n) => li.appendChild(n)); });
      const b = bouton(); li.appendChild(b);
      range.forEach((ph) => { const s = document.createElement("span"); ph.forEach((n) => s.appendChild(n)); b._nvs.push("<p>" + s.innerHTML + "</p>"); });
    });
  } catch (e) {
    console.warn("Mode simple du guide :", e);
  }
})();`;

export const GUIDE_SIMPLE = `<style>${CSS}</style><script>${JS}</script>`;

// Étapes retirées sur cette copie : « Tout envoyer dans Nuvio » (billet de la salle 2) s'en charge.
const ETAPES_RETIREES = ["collections", "affiches"];

/**
 * Retire des étapes avant que la page ne démarre : elles restent dans la page (cachées, hors de « section.act »)
 * pour que ses scripts trouvent encore leurs champs, mais la bobine, le sommaire et le diplôme ne les comptent
 * plus. Les numéros des étapes et les renvois « étape N » sont recalculés.
 */
function retirerEtapes(page) {
  const retires = [];
  for (const id of ETAPES_RETIREES) {
    const ouv = `<section class="act" id="${id}">`;
    const i = page.indexOf(ouv);
    if (i < 0) continue;
    const n = /<span class="num">(\d+)<\/span>/.exec(page.slice(i, i + 400));
    if (n) retires.push(Number(n[1]));
    page = page.slice(0, i) + `<section class="nvs-cache" id="${id}" hidden>` + page.slice(i + ouv.length);
    page = page.replace(new RegExp(`<a href="#${id}">[^<]*</a>`), "");
  }
  if (!retires.length) return page;
  // Ancien numéro → nouveau ; une étape retirée renvoie à la précédente encore visible.
  const nouveau = (n) => {
    if (retires.includes(n)) { let p = n - 1; while (retires.includes(p)) p--; return nouveau(p); }
    return n - retires.filter((r) => r < n).length;
  };
  page = page.replace(/<section class="act[^"]*" id="[^"]+">\s*<header><span class="num">(\d+)<\/span>/g,
    (m, n) => m.replace(`>${n}<`, ">" + String(nouveau(Number(n))).padStart(n.length, "0") + "<"));
  page = page.replace(/([ée]tapes? )(\d{1,2})\b/g, (m, mot, n) => mot + nouveau(Number(n)));
  page = page.replace('<span id="reel-total">12</span>', `<span id="reel-total">${String(12 - retires.length).padStart(2, "0")}</span>`);
  return page;
}

/** Ajoute le mode simple à la page du guide, juste avant </body>. */
export function avecModeSimple(page) {
  page = retirerEtapes(page);
  const i = page.lastIndexOf("</body>");
  return i < 0 ? page + GUIDE_SIMPLE : page.slice(0, i) + GUIDE_SIMPLE + page.slice(i);
}
