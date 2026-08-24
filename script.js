const tariffRules = [
  {
    code: "8501",
    label: "Moteurs et génératrices électriques",
    keywords: ["moteur electrique", "moteur électrique", "generatrice", "génératrice", "alternateur"],
    checks: ["Puissance nominale", "Type AC/DC", "Usage industriel ou véhicule"],
  },
  {
    code: "8413",
    label: "Pompes pour liquides",
    keywords: ["pompe", "pompe hydraulique", "pompe eau", "pompe carburant"],
    checks: ["Liquide pompé", "Débit", "Présence d'un dispositif de mesure"],
  },
  {
    code: "6205",
    label: "Chemises pour hommes ou garçons",
    keywords: ["chemise", "shirt", "chemise coton"],
    checks: ["Matière textile", "Genre", "Tissé ou maille"],
  },
  {
    code: "6109",
    label: "T-shirts et maillots de corps, en bonneterie",
    keywords: ["t-shirt", "tee shirt", "maillot", "polo maille"],
    checks: ["Composition", "Bonneterie", "Manches et col"],
  },
  {
    code: "8471",
    label: "Machines automatiques de traitement de l'information",
    keywords: ["ordinateur", "pc", "laptop", "serveur", "unité centrale", "unite centrale"],
    checks: ["Configuration", "Unité de stockage", "Accessoires inclus"],
  },
  {
    code: "8517",
    label: "Téléphones et appareils de communication",
    keywords: ["telephone", "téléphone", "smartphone", "routeur", "modem", "switch reseau", "switch réseau"],
    checks: ["Fonction radio", "Normes réseau", "Usage voix/données"],
  },
  {
    code: "8708",
    label: "Parties et accessoires de véhicules automobiles",
    keywords: ["piece auto", "pièce auto", "pare choc", "frein", "embrayage", "amortisseur"],
    checks: ["Véhicule concerné", "Fonction de la pièce", "Matière"],
  },
  {
    code: "3926",
    label: "Autres ouvrages en matières plastiques",
    keywords: ["plastique", "polypropylene", "polypropylène", "pvc", "boite plastique", "boîte plastique"],
    checks: ["Matière exacte", "Fonction", "Produit fini ou partie"],
  },
];

const fallback = {
  code: "À confirmer",
  label: "Aucune correspondance fiable dans la base locale",
  checks: ["Composition complète", "Fonction principale", "Fiche technique et photos", "Pays/nomenclature applicable"],
};

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function classifyProduct(query) {
  const normalizedQuery = normalize(query);
  const scoredRules = tariffRules.map((rule) => {
    const score = rule.keywords.reduce((total, keyword) => {
      return normalizedQuery.includes(normalize(keyword)) ? total + keyword.length : total;
    }, 0);
    return { ...rule, score };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = scoredRules[0];
  if (!bestMatch || bestMatch.score === 0) {
    return { ...fallback, confidence: "Faible", questions: fallback.checks };
  }

  return {
    ...bestMatch,
    confidence: bestMatch.score > 12 ? "Élevée" : "Moyenne",
    questions: bestMatch.checks,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderResult(result, query) {
  const safeQuery = escapeHtml(query);
  const safeLabel = escapeHtml(result.label);
  const safeCode = escapeHtml(result.code);
  const safeQuestions = result.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("");

  document.querySelector("#result").className = "result";
  document.querySelector("#result").innerHTML = `
    <div class="result-header">
      <div>
        <p class="confidence">Recherche : ${safeQuery}</p>
        <h2>${safeLabel}</h2>
      </div>
      <span class="code">Position ${safeCode}</span>
    </div>
    <div class="grid">
      <article class="panel">
        <h3>Niveau de confiance</h3>
        <p>${result.confidence}</p>
      </article>
      <article class="panel">
        <h3>Contrôles à effectuer</h3>
        <ul>${safeQuestions}</ul>
      </article>
      <article class="panel">
        <h3>Documents utiles</h3>
        <ul>
          <li>Facture commerciale</li>
          <li>Fiche technique</li>
          <li>Photo ou catalogue</li>
        </ul>
      </article>
    </div>
  `;
}

const form = document.querySelector("#classification-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = new FormData(form).get("designation").trim();
  if (!query) return;
  renderResult(classifyProduct(query), query);
});

const examples = ["moteur électrique 220V", "chemise coton homme", "pompe hydraulique", "smartphone 5G", "pare choc voiture"];
document.querySelector("#examples-list").innerHTML = examples
  .map((example) => `<button class="chip" type="button" data-example="${example}">${example}</button>`)
  .join("");

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("#product-input").value = button.dataset.example;
    renderResult(classifyProduct(button.dataset.example), button.dataset.example);
  });
});
