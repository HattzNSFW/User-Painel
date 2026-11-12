"use strict";

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "meuPerfil";
const DB_NAME = "MeuPainelDB";
const DB_VERSION = 1;
const STORE_NAME = "imagens";
const THEMES_STORAGE_KEY = "meuTemas";
const PROFILE_IDS = ["perfil-1", "perfil-2"];
const requestedProfileId = new URLSearchParams(window.location.search).get("profile");
const ACTIVE_PROFILE_ID = PROFILE_IDS.includes(requestedProfileId) ? requestedProfileId : "perfil-1";
const OTHER_PROFILE_ID = ACTIVE_PROFILE_ID === "perfil-1" ? "perfil-2" : "perfil-1";

function getProfileStorageKey(profileId = ACTIVE_PROFILE_ID) {
  return `${STORAGE_KEY}:${profileId}`;
}

function getThemesStorageKey(profileId = ACTIVE_PROFILE_ID) {
  return `${THEMES_STORAGE_KEY}:${profileId}`;
}

function getScopedMediaKey(key, profileId = ACTIVE_PROFILE_ID) {
  return `${profileId}:${key}`;
}

const DEFAULT_PROFILE = {
  nome: "Seu Nome",
  usuario: "seuusuario",
  bio: "Sua identidade, do seu jeito.",
  verificado: false,
  verificadoCor: "#729cff",
  cargo: "",
  insignias: [],
  rodape: "",
  bannerHeadingVisible: true,
  bannerTitulo: "",
  bannerSubtitulo: "",
  bannerHeight: 355,
  avatarCrop: { x: 50, y: 50, zoom: 100 },
  bannerCrop: { x: 50, y: 50, zoom: 100 },
  cardBackgroundCrop: { x: 50, y: 50, zoom: 100 },
  backgroundCrop: { x: 50, y: 50, zoom: 100 },
  musicBarBackgroundCrop: { x: 50, y: 50, zoom: 100 },
  dividerStyle: "ornamental",
  dividerCustomColorEnabled: false,
  dividerColor: "#a78bfa",
  statsTitle: "Em evidência",
  statsSubtitle: "",
  detailsTitle: "Um pouco sobre mim",
  detailsSubtitle: "",

  animarMidia: true,
  avatarPausado: false,
  bannerPausado: false,
  fundoPausado: false,
  cardBackgroundPausado: false,
  bannerOpacity: 100,
  cardBackgroundOpacity: 100,
  backgroundOpacity: 34,
  musicBarBackgroundOpacity: 24,
  musicPlayerWidth: 360,
  musicPlayerHeight: 64,
  musicPlayerX: null,
  musicPlayerY: null,
  moldura: "none",
  raridadeMoldura: "none",
  molduraCorPersonalizada: false,
  molduraCor: "#a78bfa",
  efeitosPerfil: true,
  fonte: "DM Sans",
  volume: 12,
  gradientIntensity: 55,
  cardRadius: 18,

  tema: "dark",

  cores: {
    background: "#0b0a10",
    gradient: "#292333",
    card: "#14121b",
    accent: "#a78bfa",
    text: "#f4f0fa",
    border: "#302a3a"
  },

  estatisticas: [
    { id: "focus", label: "EM FOCO", value: "", icon: "✦" },
    { id: "activity", label: "ATIVIDADE", value: "", icon: "◷" },
    { id: "interest", label: "INTERESSE", value: "", icon: "◇" },
  ],

  detalhes: [
    { id: "information", label: "INFORMAÇÃO", value: "", icon: "✧" },
    { id: "preference", label: "PREFERÊNCIA", value: "", icon: "◇" },
    { id: "reference", label: "REFERÊNCIA", value: "", icon: "✦" },
    { id: "link", label: "LINK", value: "", icon: "↗" },
    { id: "extra-one", label: "EXTRA", value: "", icon: "＋" },
    { id: "extra-two", label: "EXTRA", value: "", icon: "＋" }
  ]
};

const THEMES = {
  dark: { background: "#0b0a10", gradient: "#292333", card: "#14121b", accent: "#a78bfa", text: "#f4f0fa", border: "#302a3a" },
  midnight: { background: "#080e19", gradient: "#1b3150", card: "#101a29", accent: "#75b8f5", text: "#edf5ff", border: "#253b56" },
  purple: { background: "#100b18", gradient: "#49345e", card: "#1b1425", accent: "#c19bfa", text: "#f6efff", border: "#3b2a4d" },
  gold: { background: "#100d09", gradient: "#59432b", card: "#1d1811", accent: "#d6ae68", text: "#f7f0e3", border: "#453721" },
  crimson: { background: "#16090e", gradient: "#542033", card: "#21121a", accent: "#ef7899", text: "#fff0f4", border: "#512638" },
  ocean: { background: "#061217", gradient: "#164653", card: "#0d2027", accent: "#54d6d0", text: "#e9ffff", border: "#24454c" },
  forest: { background: "#09130f", gradient: "#244c39", card: "#13231b", accent: "#8bd6a4", text: "#effff3", border: "#294b39" },
  ice: { background: "#0b121b", gradient: "#2b4964", card: "#172432", accent: "#9bd8ff", text: "#f1f9ff", border: "#344d62" },
  rose: { background: "#170d14", gradient: "#593044", card: "#241722", accent: "#f0a3c7", text: "#fff2f8", border: "#56364a" },
  ember: { background: "#17100b", gradient: "#654027", card: "#251a13", accent: "#f3a45f", text: "#fff5e9", border: "#5a3c28" },
  mono: { background: "#101010", gradient: "#353535", card: "#1b1b1b", accent: "#e5e5e5", text: "#fafafa", border: "#414141" },
  cyber: { background: "#080b14", gradient: "#202c4d", card: "#12182a", accent: "#68f0d2", text: "#edfffb", border: "#2b3d55" },
  wine: { background: "#160a12", gradient: "#4d1d34", card: "#24121c", accent: "#d88ab2", text: "#fff0f7", border: "#51283d" },
  sand: { background: "#17130e", gradient: "#594a35", card: "#282116", accent: "#d9bd86", text: "#fff8e9", border: "#554831" },
  amethyst: { background: "#100b19", gradient: "#382451", card: "#1c1528", accent: "#ad8cff", text: "#f7f0ff", border: "#44335c" },
  steel: { background: "#0b1017", gradient: "#303e50", card: "#171f29", accent: "#9eb8d6", text: "#f0f5fb", border: "#354354" },
  obsidianRose: { background: "#120b10", gradient: "#432331", card: "#1c121a", accent: "#e6a0bd", text: "#fff1f6", border: "#4b2b3d" },
  silver: { background: "#101216", gradient: "#39404a", card: "#1a1e25", accent: "#c7d0dc", text: "#f3f6fa", border: "#3c4653" },
  violetNight: { background: "#0d0917", gradient: "#30204d", card: "#171126", accent: "#b79cff", text: "#f5efff", border: "#3a2c55" },
  arctic: { background: "#07131a", gradient: "#1b3b4c", card: "#10232d", accent: "#8de0ef", text: "#effcff", border: "#28505e" },
  bloodMoon: { background: "#15090b", gradient: "#4c1b22", card: "#211115", accent: "#e36d79", text: "#fff0f1", border: "#55272e" },
  sage: { background: "#0c120f", gradient: "#2d4437", card: "#17231c", accent: "#a7c7a8", text: "#f0f8f0", border: "#344d3d" },
  bronze: { background: "#15100b", gradient: "#57402b", card: "#21190f", accent: "#d5a76b", text: "#fff5e7", border: "#5a432c" },
  ultramarine: { background: "#080d1b", gradient: "#202e5a", card: "#121a32", accent: "#8daaff", text: "#f0f3ff", border: "#303f70" }
};

let profile = structuredClone(DEFAULT_PROFILE);
let db = null;

let avatarURL = null;
let bannerURL = null;
let backgroundURL = null;
let cardBackgroundURL = null;
let musicURL = null;
let currentMusicFile = null;
let musicBarBackgroundURL = null;
let musicPlayerResizeObserver = null;
let musicPlayerResizeTimer = null;
let musicCoverURL = null;
let currentMusicCoverFile = null;
let musicMediaType = "audio";
let toastTimer = null;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });
}

function saveMedia(key, file) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Banco de dados não inicializado."));
      return;
    }

    const transaction = db.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(file, getScopedMediaKey(key));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function readStoredMedia(key) {
  return new Promise((resolve, reject) => {
    if (!db) return resolve(null);
    const transaction = db.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function getMedia(key) {
  if (!db) return null;
  const scoped = await readStoredMedia(getScopedMediaKey(key));
  if (scoped) return scoped;

  // Compatibility with the original single-profile Hättz database.
  // Existing media is preserved as profile 1 when users update to this version.
  if (ACTIVE_PROFILE_ID === "perfil-1") {
    return await readStoredMedia(key);
  }

  return null;
}

function deleteMedia(key) {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.delete(getScopedMediaKey(key));

    // Remove old unscoped values only from profile 1, where they originated.
    if (ACTIVE_PROFILE_ID === "perfil-1") store.delete(key);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

function saveProfile() {
  localStorage.setItem(getProfileStorageKey(), JSON.stringify(profile));
  updateProfileSwitcher();
}

function normalizeUsername(value) {
  return value
    .trim()
    .replace(/^@+/, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function loadProfile() {
  try {
    const scopedKey = getProfileStorageKey();
    const legacySaved = ACTIVE_PROFILE_ID === "perfil-1" ? localStorage.getItem(STORAGE_KEY) : null;
    const saved = localStorage.getItem(scopedKey) || legacySaved;

    if (!saved) {
      profile = structuredClone(DEFAULT_PROFILE);
      return;
    }

    // Copy the old single-profile data into the new profile-1 slot without deleting the original.
    if (!localStorage.getItem(scopedKey) && legacySaved) {
      localStorage.setItem(scopedKey, legacySaved);
    }

    const parsed = JSON.parse(saved);

    profile = {
      ...structuredClone(DEFAULT_PROFILE),
      ...parsed,

      cores: {
        ...DEFAULT_PROFILE.cores,
        ...(parsed.cores || {})
      },

      estatisticas: Array.isArray(parsed.estatisticas)
        ? parsed.estatisticas
        : structuredClone(DEFAULT_PROFILE.estatisticas),

      detalhes: Array.isArray(parsed.detalhes)
        ? parsed.detalhes
        : Array.isArray(parsed.informacoes)
          ? parsed.informacoes
          : structuredClone(DEFAULT_PROFILE.detalhes),

      insignias: Array.isArray(parsed.insignias)
        ? parsed.insignias
        : []
    };
    profile.avatarPausado = Boolean(parsed.avatarPausado);
    profile.bannerPausado = Boolean(parsed.bannerPausado);
    profile.bannerHeight = Number.isFinite(Number(parsed.bannerHeight)) ? Math.min(620, Math.max(240, Number(parsed.bannerHeight))) : 355;
    for (const key of ["avatarCrop", "bannerCrop", "cardBackgroundCrop", "backgroundCrop", "musicBarBackgroundCrop"]) {
      const crop = parsed[key] || {};
      profile[key] = {
        x: Math.min(100, Math.max(0, Number(crop.x ?? 50))),
        y: Math.min(100, Math.max(0, Number(crop.y ?? 50))),
        zoom: Math.min(key === "musicBarBackgroundCrop" ? 300 : 250, Math.max(100, Number(crop.zoom ?? 100)))
      };
    }
    profile.dividerStyle = ["none", "minimal", "double", "dotted", "ornamental", "celestial", "gothic", "royal"].includes(parsed.dividerStyle) ? parsed.dividerStyle : "ornamental";
    profile.dividerCustomColorEnabled = Boolean(parsed.dividerCustomColorEnabled);
    profile.dividerColor = /^#[0-9a-f]{6}$/i.test(parsed.dividerColor || "") ? parsed.dividerColor : "#a78bfa";
    if (!["none", "celestial", "gothic", "royal", "floral", "ornate", "dark", "halo", "vintage"].includes(profile.moldura)) profile.moldura = "celestial";
    profile.fundoPausado = Boolean(parsed.fundoPausado);
    profile.cardBackgroundPausado = Boolean(parsed.cardBackgroundPausado);
    if (String(profile.bannerTitulo || "").trim().toUpperCase() === "PERSONAL SPACE") profile.bannerTitulo = "";
    profile.statsTitle = String(parsed.statsTitle ?? DEFAULT_PROFILE.statsTitle);
    profile.statsSubtitle = String(parsed.statsSubtitle ?? DEFAULT_PROFILE.statsSubtitle);
    profile.detailsTitle = String(parsed.detailsTitle ?? DEFAULT_PROFILE.detailsTitle);
    profile.detailsSubtitle = String(parsed.detailsSubtitle ?? DEFAULT_PROFILE.detailsSubtitle);
    profile.raridadeMoldura = parsed.raridadeMoldura || "none";
    profile.molduraCorPersonalizada = Boolean(parsed.molduraCorPersonalizada);
    profile.molduraCor = /^#[0-9a-f]{6}$/i.test(parsed.molduraCor || "") ? parsed.molduraCor : "#a78bfa";
    profile.verificadoCor = /^#[0-9a-f]{6}$/i.test(parsed.verificadoCor || "") ? parsed.verificadoCor : DEFAULT_PROFILE.verificadoCor;
    for (const key of ["bannerOpacity", "cardBackgroundOpacity", "backgroundOpacity", "musicBarBackgroundOpacity"]) {
      const fallback = Number(DEFAULT_PROFILE[key]);
      const value = Number(parsed[key]);
      profile[key] = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : fallback;
    }
    profile.musicPlayerWidth = Math.min(620, Math.max(220, Number(parsed.musicPlayerWidth) || DEFAULT_PROFILE.musicPlayerWidth));
    profile.musicPlayerHeight = Math.min(220, Math.max(56, Number(parsed.musicPlayerHeight) || DEFAULT_PROFILE.musicPlayerHeight));
    profile.musicPlayerX = parsed.musicPlayerX !== null && parsed.musicPlayerX !== undefined && Number.isFinite(Number(parsed.musicPlayerX)) ? Number(parsed.musicPlayerX) : null;
    profile.musicPlayerY = parsed.musicPlayerY !== null && parsed.musicPlayerY !== undefined && Number.isFinite(Number(parsed.musicPlayerY)) ? Number(parsed.musicPlayerY) : null;

    const reservedRoles = /\b(admin|administrator|dev|developer|staff|moderator|owner|dono)\b/i;
    if (reservedRoles.test(String(profile.cargo || "").trim())) profile.cargo = "";

    profile.insignias = [...new Set(profile.insignias.map(normalizeBadge).filter((badge) => badge && !isBlockedBadge(badge)))];

    if (typeof parsed.animarMidia !== "boolean") {
      profile.animarMidia =
        typeof parsed.animarAvatar === "boolean"
          ? parsed.animarAvatar
          : true;
    }

  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    profile = structuredClone(DEFAULT_PROFILE);
  }
}

function updateProfileSwitcher() {
  const button = $("openOtherProfile");
  const label = $("openOtherProfileLabel");
  if (!button || !label) return;

  if (ACTIVE_PROFILE_ID === "perfil-1") {
    const exists = Boolean(localStorage.getItem(getProfileStorageKey("perfil-2")));
    label.textContent = exists ? "Abrir perfil 2" : "Criar perfil 2";
    button.title = exists
      ? "Abrir o segundo perfil em uma nova aba"
      : "Criar o segundo perfil e abrir em uma nova aba";
    button.setAttribute("aria-label", button.title);
  } else {
    label.textContent = "Abrir perfil 1";
    button.title = "Abrir o primeiro perfil em uma nova aba";
    button.setAttribute("aria-label", button.title);
  }
}

function openOtherProfile() {
  const targetId = OTHER_PROFILE_ID;

  // Create the second slot on demand. Its settings and media remain isolated from profile 1.
  if (targetId === "perfil-2" && !localStorage.getItem(getProfileStorageKey("perfil-2"))) {
    localStorage.setItem(getProfileStorageKey("perfil-2"), JSON.stringify(structuredClone(DEFAULT_PROFILE)));
  }

  const targetUrl = new URL(window.location.href);
  targetUrl.searchParams.set("profile", targetId);

  const opened = window.open(targetUrl.toString(), "_blank");
  if (opened) {
    try { opened.opener = null; } catch {}
  } else {
    showToast("O navegador bloqueou a nova aba. Permita pop-ups para este site e tente novamente.");
  }

  updateProfileSwitcher();
}

function applyColors(colors) {
  const root = document.documentElement;

  const variables = {
    background: "--background",
    gradient: "--gradient",
    card: "--card",
    accent: "--accent",
    text: "--text",
    border: "--border"
  };

  Object.entries(variables).forEach(([key, variable]) => {
    if (colors[key]) {
      root.style.setProperty(variable, colors[key]);
    }
  });

  profile.cores = {
    ...profile.cores,
    ...colors
  };

  applyDesignSettings();
}

function applyTheme(name) {
  if (!THEMES[name]) return;

  profile.tema = name;

  applyColors(THEMES[name]);
  updateThemeButtons();
  fillColorInputs();
}

function updateThemeButtons() {
  document.querySelectorAll(".theme-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.theme === profile.tema);
  });
}

function fillColorInputs() {
  $("colorBackground").value = profile.cores.background;
  $("colorGradient").value = profile.cores.gradient;
  $("colorCard").value = profile.cores.card;
  $("colorAccent").value = profile.cores.accent;
  $("colorText").value = profile.cores.text;
  $("colorBorder").value = profile.cores.border;
}

function readColorInputs() {
  return {
    background: $("colorBackground").value,
    gradient: $("colorGradient").value,
    card: $("colorCard").value,
    accent: $("colorAccent").value,
    text: $("colorText").value,
    border: $("colorBorder").value
  };
}

function applyDesignSettings() {
  document.documentElement.style.setProperty(
    "--gradient-opacity",
    `${Number(profile.gradientIntensity ?? 55)}%`
  );

  document.documentElement.style.setProperty(
    "--card-radius",
    `${Number(profile.cardRadius ?? 18)}px`
  );
}

function getStatIcon(label = "") {
  const value = label.toLowerCase();

  const icons = [
    { terms: ["projeto", "project"], icon: "✦" },
    { terms: ["nível", "nivel", "level"], icon: "◇" },
    { terms: ["conquista", "achievement"], icon: "♛" },
    { terms: ["amigo", "friend"], icon: "♧" },
    { terms: ["publicação", "publicacao", "post"], icon: "▤" },
    { terms: ["vitória", "vitoria", "win"], icon: "⚔" },
    { terms: ["hora", "tempo"], icon: "◷" },
    { terms: ["favorito", "favorite"], icon: "♡" },
    { terms: ["visita", "visualização"], icon: "◉" },
    { terms: ["seguidores", "seguidor"], icon: "♙" },
    { terms: ["rank", "posição", "posicao"], icon: "♜" },
    { terms: ["coleção", "colecao"], icon: "❖" }
  ];

  const match = icons.find((item) =>
    item.terms.some((term) => value.includes(term))
  );

  return match ? match.icon : "✧";
}

function getDetailIcon(label = "") {
  const value = label.toLowerCase();

  const icons = [
    { terms: ["local", "cidade", "país", "pais"], icon: "⌖" },
    { terms: ["interesse", "hobby"], icon: "✧" },
    { terms: ["ocupação", "ocupacao", "trabalho", "profissão", "profissao"], icon: "⌘" },
    { terms: ["aniversário", "aniversario", "nascimento"], icon: "✿" },
    { terms: ["preferência", "preferencia", "favorito"], icon: "♡" },
    { terms: ["objetivo", "meta", "sonho"], icon: "☼" },
    { terms: ["jogo", "game"], icon: "⌖" },
    { terms: ["música", "musica"], icon: "♫" },
    { terms: ["rede", "social"], icon: "◎" },
    { terms: ["idioma", "língua", "lingua"], icon: "文" },
    { terms: ["estudo", "curso", "faculdade"], icon: "▤" },
    { terms: ["site", "link"], icon: "↗" }
  ];

  const match = icons.find((item) =>
    item.terms.some((term) => value.includes(term))
  );

  return match ? match.icon : "✦";
}

function svgStart(content) {
  return `
    <svg viewBox="0 0 190 190"
         xmlns="http://www.w3.org/2000/svg"
         fill="none"
         aria-hidden="true">
      ${content}
    </svg>
  `;
}

const FRAMES = {

  none: "",

  celestial: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <path class="fine-line" d="M95 8 L100 18 L95 28 L90 18Z"/>
    <path class="fine-line" d="M95 162 L100 172 L95 182 L90 172Z"/>

    <path class="fine-line" d="M8 95 L18 90 L28 95 L18 100Z"/>
    <path class="fine-line" d="M162 95 L172 90 L182 95 L172 100Z"/>

    <path class="ornament" d="M95 9 L98 16 L95 23 L92 16Z"/>
    <path class="ornament" d="M95 167 L98 174 L95 181 L92 174Z"/>

    <path class="ornament" d="M9 95 L16 92 L23 95 L16 98Z"/>
    <path class="ornament" d="M167 95 L174 92 L181 95 L174 98Z"/>

    <path class="fine-line" d="M42 42 L48 48 M148 42 L142 48 M42 148 L48 142 M148 148 L142 142"/>

    <circle class="ornament" cx="45" cy="45" r="3"/>
    <circle class="ornament" cx="145" cy="45" r="3"/>
    <circle class="ornament" cx="45" cy="145" r="3"/>
    <circle class="ornament" cx="145" cy="145" r="3"/>

    <path class="fine-line" d="M67 17 Q95 2 123 17"/>
    <path class="fine-line" d="M67 173 Q95 188 123 173"/>

    <path class="ornament" d="M95 3 L98 8 L95 13 L92 8Z"/>
    <path class="ornament" d="M95 177 L98 182 L95 187 L92 182Z"/>

    <path class="fine-line" d="M51 29 Q63 14 79 20 Q70 24 66 34 Q60 28 51 29Z"/>
    <path class="fine-line" d="M139 29 Q127 14 111 20 Q120 24 124 34 Q130 28 139 29Z"/>
    <path class="fine-line" d="M51 161 Q63 176 79 170 Q70 166 66 156 Q60 162 51 161Z"/>
    <path class="fine-line" d="M139 161 Q127 176 111 170 Q120 166 124 156 Q130 162 139 161Z"/>
    <path class="ornament" d="M64 25 L68 30 L64 35 L60 30Z M126 25 L130 30 L126 35 L122 30Z M64 155 L68 160 L64 165 L60 160Z M126 155 L130 160 L126 165 L122 160Z"/>
    <circle class="ornament" cx="95" cy="18" r="1.8"/>
    <circle class="ornament" cx="95" cy="172" r="1.8"/>
  `),

  gothic: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <path class="fine-line" d="M95 8 C87 18 86 25 95 32 C104 25 103 18 95 8Z"/>
    <path class="fine-line" d="M95 182 C87 172 86 165 95 158 C104 165 103 172 95 182Z"/>

    <path class="fine-line" d="M8 95 C18 87 25 86 32 95 C25 104 18 103 8 95Z"/>
    <path class="fine-line" d="M182 95 C172 87 165 86 158 95 C165 104 172 103 182 95Z"/>

    <path class="ornament" d="M95 8 L99 19 L95 26 L91 19Z"/>
    <path class="ornament" d="M95 182 L99 171 L95 164 L91 171Z"/>

    <path class="fine-line" d="M34 34 L49 45 L42 51 L29 42Z"/>
    <path class="fine-line" d="M156 34 L141 45 L148 51 L161 42Z"/>
    <path class="fine-line" d="M34 156 L49 145 L42 139 L29 148Z"/>
    <path class="fine-line" d="M156 156 L141 145 L148 139 L161 148Z"/>

    <path class="ornament" d="M29 36 L36 43 L29 50 L22 43Z"/>
    <path class="ornament" d="M161 36 L168 43 L161 50 L154 43Z"/>
    <path class="ornament" d="M29 140 L36 147 L29 154 L22 147Z"/>
    <path class="ornament" d="M161 140 L168 147 L161 154 L154 147Z"/>

    <path class="fine-line" d="M62 18 Q73 9 82 17 Q76 24 69 25"/>
    <path class="fine-line" d="M128 18 Q117 9 108 17 Q114 24 121 25"/>
    <path class="fine-line" d="M62 172 Q73 181 82 173 Q76 166 69 165"/>
    <path class="fine-line" d="M128 172 Q117 181 108 173 Q114 166 121 165"/>

    <circle class="ornament" cx="95" cy="28" r="3"/>
    <circle class="ornament" cx="95" cy="162" r="3"/>
  `),

  royal: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <path class="fine-line" d="M63 23 L56 10 L79 19 L95 5 L111 19 L134 10 L127 23"/>
    <path class="fine-line" d="M63 23 L95 35 L127 23"/>

    <path class="ornament" d="M95 4 L100 14 L95 23 L90 14Z"/>
    <circle class="ornament" cx="58" cy="11" r="3.5"/>
    <circle class="ornament" cx="132" cy="11" r="3.5"/>

    <path class="fine-line" d="M28 72 Q10 95 28 118"/>
    <path class="fine-line" d="M162 72 Q180 95 162 118"/>

    <path class="ornament" d="M19 95 L27 86 L34 95 L27 104Z"/>
    <path class="ornament" d="M171 95 L163 86 L156 95 L163 104Z"/>

    <path class="fine-line" d="M63 167 L95 185 L127 167"/>
    <path class="ornament" d="M95 176 L101 184 L95 190 L89 184Z"/>

    <circle class="ornament" cx="45" cy="45" r="3.5"/>
    <circle class="ornament" cx="145" cy="45" r="3.5"/>
    <circle class="ornament" cx="45" cy="145" r="3.5"/>
    <circle class="ornament" cx="145" cy="145" r="3.5"/>

    <path class="fine-line" d="M37 45 L45 34 L53 45"/>
    <path class="fine-line" d="M153 45 L145 34 L137 45"/>
    <path class="fine-line" d="M37 145 L45 156 L53 145"/>
    <path class="fine-line" d="M153 145 L145 156 L137 145"/>
  `),

  floral: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <g transform="translate(95 13)">
      <path class="fine-line" d="M0 0 Q-17 -14 -19 1 Q-12 11 0 0 Q12 11 19 1 Q17 -14 0 0Z"/>
      <circle class="ornament" cx="0" cy="0" r="4"/>
    </g>

    <g transform="translate(95 177)">
      <path class="fine-line" d="M0 0 Q-17 -14 -19 1 Q-12 11 0 0 Q12 11 19 1 Q17 -14 0 0Z"/>
      <circle class="ornament" cx="0" cy="0" r="4"/>
    </g>

    <g transform="translate(13 95) rotate(-90)">
      <path class="fine-line" d="M0 0 Q-17 -14 -19 1 Q-12 11 0 0 Q12 11 19 1 Q17 -14 0 0Z"/>
      <circle class="ornament" cx="0" cy="0" r="4"/>
    </g>

    <g transform="translate(177 95) rotate(90)">
      <path class="fine-line" d="M0 0 Q-17 -14 -19 1 Q-12 11 0 0 Q12 11 19 1 Q17 -14 0 0Z"/>
      <circle class="ornament" cx="0" cy="0" r="4"/>
    </g>

    <path class="fine-line" d="M38 42 Q24 28 29 19 Q43 23 47 37"/>
    <path class="fine-line" d="M152 42 Q166 28 161 19 Q147 23 143 37"/>
    <path class="fine-line" d="M38 148 Q24 162 29 171 Q43 167 47 153"/>
    <path class="fine-line" d="M152 148 Q166 162 161 171 Q147 167 143 153"/>

    <path class="ornament" d="M29 18 Q21 10 18 21 Q24 30 29 18Z"/>
    <path class="ornament" d="M161 18 Q169 10 172 21 Q166 30 161 18Z"/>
    <path class="ornament" d="M29 172 Q21 180 18 169 Q24 160 29 172Z"/>
    <path class="ornament" d="M161 172 Q169 180 172 169 Q166 160 161 172Z"/>

    <path class="fine-line" d="M61 18 Q72 29 81 23 M129 18 Q118 29 109 23"/>
    <path class="fine-line" d="M61 172 Q72 161 81 167 M129 172 Q118 161 109 167"/>
  `),

  ornate: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <path class="fine-line" d="M95 13 C78 3 65 13 73 25 C80 34 91 29 95 21 C99 29 110 34 117 25 C125 13 112 3 95 13Z"/>
    <path class="fine-line" d="M95 177 C78 187 65 177 73 165 C80 156 91 161 95 169 C99 161 110 156 117 165 C125 177 112 187 95 177Z"/>

    <path class="fine-line" d="M13 95 C3 78 13 65 25 73 C34 80 29 91 21 95 C29 99 34 110 25 117 C13 125 3 112 13 95Z"/>
    <path class="fine-line" d="M177 95 C187 78 177 65 165 73 C156 80 161 91 169 95 C161 99 156 110 165 117 C177 125 187 112 177 95Z"/>

    <path class="ornament" d="M95 8 L100 17 L95 25 L90 17Z"/>
    <path class="ornament" d="M95 182 L100 173 L95 165 L90 173Z"/>

    <path class="fine-line" d="M39 39 Q55 26 61 42 Q59 54 47 52 Q41 50 39 39Z"/>
    <path class="fine-line" d="M151 39 Q135 26 129 42 Q131 54 143 52 Q149 50 151 39Z"/>
    <path class="fine-line" d="M39 151 Q55 164 61 148 Q59 136 47 138 Q41 140 39 151Z"/>
    <path class="fine-line" d="M151 151 Q135 164 129 148 Q131 136 143 138 Q149 140 151 151Z"/>

    <circle class="ornament" cx="48" cy="45" r="3"/>
    <circle class="ornament" cx="142" cy="45" r="3"/>
    <circle class="ornament" cx="48" cy="145" r="3"/>
    <circle class="ornament" cx="142" cy="145" r="3"/>

    <path class="fine-line" d="M64 17 Q77 8 85 17 M126 17 Q113 8 105 17"/>
    <path class="fine-line" d="M64 173 Q77 182 85 173 M126 173 Q113 182 105 173"/>
  `),

  dark: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="79"/>

    <path class="fine-line" d="M95 10 L102 27 L95 22 L88 27Z"/>
    <path class="fine-line" d="M95 180 L102 163 L95 168 L88 163Z"/>

    <path class="fine-line" d="M10 95 L27 88 L22 95 L27 102Z"/>
    <path class="fine-line" d="M180 95 L163 88 L168 95 L163 102Z"/>

    <path class="fine-line" d="M35 35 L51 44 L43 47 L46 57"/>
    <path class="fine-line" d="M155 35 L139 44 L147 47 L144 57"/>
    <path class="fine-line" d="M35 155 L51 146 L43 143 L46 133"/>
    <path class="fine-line" d="M155 155 L139 146 L147 143 L144 133"/>

    <path class="ornament" d="M95 6 L99 17 L95 25 L91 17Z"/>
    <path class="ornament" d="M95 184 L99 173 L95 165 L91 173Z"/>

    <path class="ornament" d="M6 95 L17 91 L25 95 L17 99Z"/>
    <path class="ornament" d="M184 95 L173 91 L165 95 L173 99Z"/>

    <path class="fine-line" d="M60 18 L70 28 L66 30 L58 26"/>
    <path class="fine-line" d="M130 18 L120 28 L124 30 L132 26"/>
    <path class="fine-line" d="M60 172 L70 162 L66 160 L58 164"/>
    <path class="fine-line" d="M130 172 L120 162 L124 160 L132 164"/>

    <circle class="ornament" cx="44" cy="44" r="3"/>
    <circle class="ornament" cx="146" cy="44" r="3"/>
    <circle class="ornament" cx="44" cy="146" r="3"/>
    <circle class="ornament" cx="146" cy="146" r="3"/>
  `),

  halo: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="73"/>
    <circle class="ring-secondary" cx="95" cy="95" r="81"/>

    <circle class="ornament" cx="95" cy="14" r="3"/>
    <circle class="ornament" cx="95" cy="176" r="3"/>
    <circle class="ornament" cx="14" cy="95" r="3"/>
    <circle class="ornament" cx="176" cy="95" r="3"/>

    <path class="fine-line" d="M95 3 L95 7 M95 183 L95 187 M3 95 L7 95 M183 95 L187 95"/>

    <path class="fine-line" d="M38 38 L45 45 M152 38 L145 45 M38 152 L45 145 M152 152 L145 145"/>

    <path class="ornament" d="M95 7 L98 13 L95 19 L92 13Z"/>
    <path class="ornament" d="M95 171 L98 177 L95 183 L92 177Z"/>

    <path class="fine-line" d="M70 18 Q95 8 120 18"/>
    <path class="fine-line" d="M70 172 Q95 182 120 172"/>
    <path class="fine-line" d="M18 70 Q8 95 18 120"/>
    <path class="fine-line" d="M172 70 Q182 95 172 120"/>
  `),

  vintage: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="78"/>

    <path class="fine-line" d="M95 9 Q78 9 78 23 Q78 34 95 36 Q112 34 112 23 Q112 9 95 9Z"/>
    <path class="fine-line" d="M95 181 Q78 181 78 167 Q78 156 95 154 Q112 156 112 167 Q112 181 95 181Z"/>

    <path class="ornament" d="M95 8 L100 18 L95 28 L90 18Z"/>
    <path class="ornament" d="M95 182 L100 172 L95 162 L90 172Z"/>

    <path class="fine-line" d="M9 95 Q9 78 23 78 Q34 78 36 95 Q34 112 23 112 Q9 112 9 95Z"/>
    <path class="fine-line" d="M181 95 Q181 78 167 78 Q156 78 154 95 Q156 112 167 112 Q181 112 181 95Z"/>

    <path class="ornament" d="M8 95 L18 90 L28 95 L18 100Z"/>
    <path class="ornament" d="M182 95 L172 90 L162 95 L172 100Z"/>

    <path class="fine-line" d="M38 38 Q50 28 59 38 Q59 49 48 52 Q39 50 38 38Z"/>
    <path class="fine-line" d="M152 38 Q140 28 131 38 Q131 49 142 52 Q151 50 152 38Z"/>
    <path class="fine-line" d="M38 152 Q50 162 59 152 Q59 141 48 138 Q39 140 38 152Z"/>
    <path class="fine-line" d="M152 152 Q140 162 131 152 Q131 141 142 138 Q151 140 152 152Z"/>

    <circle class="ornament" cx="48" cy="43" r="3"/>
    <circle class="ornament" cx="142" cy="43" r="3"/>
    <circle class="ornament" cx="48" cy="147" r="3"/>
    <circle class="ornament" cx="142" cy="147" r="3"/>
  `),

  wings: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="73"/>
    <circle class="ring-secondary" cx="95" cy="95" r="82"/>
    <path class="fine-line" d="M20 76 C7 59 10 36 31 23 C29 43 43 50 57 54 C42 57 34 66 31 81 C27 78 23 77 20 76Z"/>
    <path class="fine-line" d="M170 76 C183 59 180 36 159 23 C161 43 147 50 133 54 C148 57 156 66 159 81 C163 78 167 77 170 76Z"/>
    <path class="fine-line" d="M25 65 Q37 58 49 59 M29 53 Q39 48 47 49 M35 40 Q43 39 49 43"/>
    <path class="fine-line" d="M165 65 Q153 58 141 59 M161 53 Q151 48 143 49 M155 40 Q147 39 141 43"/>
    <path class="fine-line" d="M40 143 Q23 153 26 173 Q44 166 55 151 M150 143 Q167 153 164 173 Q146 166 135 151"/>
    <path class="ornament" d="M95 5 L101 17 L95 29 L89 17Z"/>
    <path class="ornament" d="M95 161 L100 171 L95 185 L90 171Z"/>
    <circle class="ornament" cx="30" cy="82" r="3"/><circle class="ornament" cx="160" cy="82" r="3"/>
  `),

  skulls: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="81"/>
    <path class="fine-line" d="M95 9 C83 20 81 34 95 42 C109 34 107 20 95 9Z"/>
    <path class="fine-line" d="M95 181 C83 170 81 156 95 148 C109 156 107 170 95 181Z"/>
    <g class="ornament" transform="translate(95 29)"><path d="M-8 -5 Q0 -13 8 -5 L7 5 Q0 12 -7 5Z"/><circle cx="-3" cy="0" r="1.8"/><circle cx="3" cy="0" r="1.8"/></g>
    <g class="ornament" transform="translate(95 161)"><path d="M-8 -5 Q0 -13 8 -5 L7 5 Q0 12 -7 5Z"/><circle cx="-3" cy="0" r="1.8"/><circle cx="3" cy="0" r="1.8"/></g>
    <path class="fine-line" d="M27 51 L42 58 L35 72 L21 65Z M163 51 L148 58 L155 72 L169 65Z M27 139 L42 132 L35 118 L21 125Z M163 139 L148 132 L155 118 L169 125Z"/>
    <path class="ornament" d="M19 95 L28 88 L37 95 L28 102Z M171 95 L162 88 L153 95 L162 102Z"/>
  `),

  thorn: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="82"/>
    <path class="fine-line" d="M28 45 C45 49 43 64 57 68 C45 75 42 85 48 95 C35 91 25 98 22 111 C14 93 18 75 28 45Z"/>
    <path class="fine-line" d="M162 45 C145 49 147 64 133 68 C145 75 148 85 142 95 C155 91 165 98 168 111 C176 93 172 75 162 45Z"/>
    <path class="fine-line" d="M28 145 C44 138 50 126 48 111 M162 145 C146 138 140 126 142 111"/>
    <path class="ornament" d="M29 45 L20 25 L39 37Z M161 45 L170 25 L151 37Z M48 95 L28 88 L39 108Z M142 95 L162 88 L151 108Z"/>
    <path class="fine-line" d="M65 20 Q78 33 95 26 Q112 33 125 20 M65 170 Q78 157 95 164 Q112 157 125 170"/>
    <circle class="ornament" cx="95" cy="14" r="3"/><circle class="ornament" cx="95" cy="176" r="3"/>
  `),

  dragon: svgStart(`
    <circle class="ring-main" cx="95" cy="95" r="72"/>
    <circle class="ring-secondary" cx="95" cy="95" r="82"/>
    <path class="fine-line" d="M35 55 C18 40 20 20 42 13 C40 31 55 35 67 38 C54 43 49 54 51 66 C44 62 39 59 35 55Z"/>
    <path class="fine-line" d="M155 55 C172 40 170 20 148 13 C150 31 135 35 123 38 C136 43 141 54 139 66 C146 62 151 59 155 55Z"/>
    <path class="fine-line" d="M39 51 L25 32 L47 39 M151 51 L165 32 L143 39"/>
    <path class="ornament" d="M95 4 L102 18 L95 31 L88 18Z"/>
    <path class="fine-line" d="M24 95 Q10 82 18 68 Q31 73 35 87 M166 95 Q180 82 172 68 Q159 73 155 87"/>
    <path class="fine-line" d="M45 145 Q59 153 69 169 M145 145 Q131 153 121 169"/>
    <path class="ornament" d="M18 68 L9 54 L27 60Z M172 68 L181 54 L163 60Z M95 169 L103 181 L95 188 L87 181Z"/>
    <circle class="ornament" cx="45" cy="45" r="3"/><circle class="ornament" cx="145" cy="45" r="3"/>
  `)
};

function renderFrame() {
  const frame = $("avatarFrame");
  const name = profile.moldura || "none";

  const artwork = name;

  const rarity = ["none", "common", "rare", "epic", "legendary"].includes(profile.raridadeMoldura)
    ? profile.raridadeMoldura
    : "none";
  frame.className = `avatar-frame rarity-${rarity}`;

  if (profile.molduraCorPersonalizada) {
    frame.classList.add("custom-frame-color");
    frame.style.setProperty("--frame-custom-color", profile.molduraCor || "#a78bfa");
  } else {
    frame.style.removeProperty("--frame-custom-color");
  }

  if (!FRAMES[artwork]) {
    frame.innerHTML = "";
    return;
  }

  const finishingDetails = `
    <g class="frame-finishing-details">
      <circle class="frame-detail-ring" cx="95" cy="95" r="86" />
      <circle class="frame-detail-dots" cx="95" cy="95" r="66" />
      <path class="frame-detail-ticks" d="M95 2v8 M95 180v8 M2 95h8 M180 95h8 M29 29l6 6 M155 155l6 6 M161 29l-6 6 M35 155l-6 6" />
      <path class="frame-detail-star" d="M95 1l2.2 6.8L104 10l-6.8 2.2L95 19l-2.2-6.8L86 10l6.8-2.2Z M10 95l2.2 6.8L19 104l-6.8 2.2L10 113l-2.2-6.8L1 104l6.8-2.2Z M180 95l2.2 6.8L189 104l-6.8 2.2L180 113l-2.2-6.8L171 104l6.8-2.2Z" />
      <circle class="frame-detail-stone" cx="30" cy="30" r="2"/><circle class="frame-detail-stone" cx="160" cy="30" r="2"/><circle class="frame-detail-stone" cx="30" cy="160" r="2"/><circle class="frame-detail-stone" cx="160" cy="160" r="2"/>
    </g>`;
  frame.innerHTML = FRAMES[artwork].replace("</svg>", `${finishingDetails}</svg>`);

  if (name !== "none") frame.classList.add(`frame-${name}`);
}

function renderBannerHeading() {
  const heading = $("bannerHeading");
  const title = $("bannerTitle");
  const subtitle = $("bannerSubtitle");
  const visible = profile.bannerHeadingVisible !== false;
  const titleText = String(profile.bannerTitulo || "").trim();
  const subtitleText = String(profile.bannerSubtitulo || "").trim();

  title.textContent = titleText;
  subtitle.textContent = subtitleText;
  title.hidden = !titleText;
  subtitle.hidden = !subtitleText;
  heading.hidden = !visible || (!titleText && !subtitleText);
}

function renderIdentity() {
  renderBannerHeading();
  $("profileName").textContent = profile.nome || "";
  $("profileUsername").textContent = profile.usuario
    ? `@${profile.usuario}`
    : "";

  $("profileBio").textContent = profile.bio || "";
  const roleChip = $("profileRole");
  const blockedRole = /\b(admin|administrator|dev|developer|staff|moderator|owner|dono)\b/i.test(String(profile.cargo || "").trim());
  const safeRole = blockedRole ? "" : profile.cargo;
  roleChip.textContent = safeRole || "";
  roleChip.hidden = !safeRole;
  roleChip.classList.toggle("owner-role", /^(owner|dono)$/i.test(safeRole));
  roleChip.title = safeRole || "Identificação do perfil";
  roleChip.setAttribute("aria-label", roleChip.title);
  const verifiedBadge = $("verifiedBadge");
  const verifiedColor = /^#[0-9a-f]{6}$/i.test(profile.verificadoCor || "")
    ? profile.verificadoCor
    : DEFAULT_PROFILE.verificadoCor;
  verifiedBadge.hidden = !profile.verificado;
  verifiedBadge.style.setProperty("--verified-color", verifiedColor);
  document.querySelector(".profile-card")?.classList.toggle("effects-enabled", profile.efeitosPerfil !== false);
  $("footerText").textContent = profile.rodape || "";

  $("badges").innerHTML = profile.insignias
    .filter(Boolean)
    .map((badge) => `<span class="badge">${escapeHTML(badge)}</span>`)
    .join("");

  document.documentElement.style.setProperty(
    "--font",
    `"${profile.fonte || "DM Sans"}", sans-serif`
  );
}

function renderStats() {
  $("statsSectionTitle").textContent = profile.statsTitle || "Em evidência";
  $("statsSectionDescription").textContent = profile.statsSubtitle || "";
  $("statsGrid").innerHTML = profile.estatisticas.map((stat) => {
    const icon = stat.icon || getStatIcon(stat.label);

    return `
      <article class="stat-card">
        <span class="stat-icon">${escapeHTML(icon)}</span>
        <span class="stat-label">${escapeHTML(stat.label)}</span>
        <strong class="stat-value">${escapeHTML(stat.value || "")}</strong>
      </article>
    `;
  }).join("");
}

function renderDetails() {
  $("detailsSectionTitle").textContent = profile.detailsTitle || "Um pouco sobre mim";
  $("detailsSectionDescription").textContent = profile.detailsSubtitle || "";
  $("detailsGrid").innerHTML = profile.detalhes.map((detail) => {
    const icon = detail.icon || getDetailIcon(detail.label);

    return `
      <article class="detail-card">
        <span class="detail-icon">${escapeHTML(icon)}</span>
        <div class="detail-content">
          <span class="detail-label">${escapeHTML(detail.label)}</span>
          <p class="detail-value">${escapeHTML(detail.value || "")}</p>
        </div>
      </article>
    `;
  }).join("");
}

function renderProfile() {
  renderIdentity();
  renderStats();
  renderDetails();
  renderFrame();

  applyColors(profile.cores);
  applyCropSettings();
  applyDividerSettings();
  applyBannerSettings();
  applyMediaOpacitySettings();
  applyMusicPlayerSize();
  updateThemeButtons();
}

function revokeURL(url) {
  if (url) {
    URL.revokeObjectURL(url);
  }
}


const VISUAL_IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|apng|avif|svg|bmp)$/i;
const VISUAL_VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogv|m4v)$/i;
const MAX_IMAGE_SIZE = 40 * 1024 * 1024;
const MAX_VIDEO_SIZE = 120 * 1024 * 1024;

function getVisualMediaKind(file) {
  if (!file) return null;
  if (file.type?.startsWith("image/") || VISUAL_IMAGE_EXTENSIONS.test(file.name)) return "image";
  if (file.type?.startsWith("video/") || VISUAL_VIDEO_EXTENSIONS.test(file.name)) return "video";
  return null;
}

function validateVisualMedia(file) {
  const kind = getVisualMediaKind(file);
  if (!kind) return { valid: false, message: "Formato não suportado. Use uma imagem, GIF ou vídeo compatível." };
  const limit = kind === "video" ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > limit) {
    const max = kind === "video" ? "120 MB" : "40 MB";
    return { valid: false, message: `O arquivo ultrapassa o limite de ${max}.` };
  }
  return { valid: true, kind };
}


function prepareVideo(video) {
  if (!video) return;
  video.pause();
  video.removeAttribute("autoplay");
  video.autoplay = false;
  video.preload = "none";
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.disablePictureInPicture = true;
  video.disableRemotePlayback = true;

  const state = visualVideoStates.get(video);
  if (state) {
    state.generation += 1;
    state.pending = false;
    state.loadStarted = false;
    state.sourceKey = null;
    state.autoplayBlocked = false;
    state.mediaError = false;
    state.errorNotified = false;
  }
}

const visualVideoStates = new Map();
let visualVideoSyncQueued = false;
let lastVisualVideoSync = 0;

const VISUAL_VIDEO_CONFIG = [
  // The page background is the largest visual layer; keep it eligible even
  // when its element spans more than the viewport and its intersection ratio is small.
  { id: "backgroundVideo", priority: 100, alwaysVisible: true, paused: () => profile.fundoPausado },
  { id: "bannerVideo", priority: 90, paused: () => profile.bannerPausado },
  { id: "avatarVideo", priority: 80, paused: () => profile.avatarPausado },
  { id: "cardBackgroundVideo", priority: 60, paused: () => profile.cardBackgroundPausado },
  { id: "musicBarBackgroundVideo", priority: 50, paused: () => false }
];

function isVisualVideoNearViewport(video, margin = 220) {
  if (!video || video.hidden || !video.hasAttribute("src")) return false;
  const rect = video.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  return rect.bottom >= -margin && rect.top <= window.innerHeight + margin &&
    rect.right >= -margin && rect.left <= window.innerWidth + margin;
}

function getVisualVideoSlots() {
  const compactScreen = window.matchMedia?.("(max-width: 760px)").matches ||
    (Number(navigator.deviceMemory) > 0 && Number(navigator.deviceMemory) <= 4);
  return compactScreen ? 2 : 3;
}

function registerVisualVideo(element, config) {
  if (!element) return;
  let state = visualVideoStates.get(element);

  if (!state) {
    state = {
      element,
      id: config.id,
      priority: config.priority,
      alwaysVisible: Boolean(config.alwaysVisible),
      isManuallyPaused: config.paused,
      visible: Boolean(config.alwaysVisible),
      ratio: config.alwaysVisible ? 1 : 0,
      pending: false,
      loadStarted: false,
      sourceKey: null,
      generation: 0,
      autoplayBlocked: false,
      mediaError: false,
      errorNotified: false,
      eventsBound: false
    };
    visualVideoStates.set(element, state);
  } else {
    state.id = config.id;
    state.priority = config.priority;
    state.alwaysVisible = Boolean(config.alwaysVisible);
    state.isManuallyPaused = config.paused;
  }

  if (!state.eventsBound) {
    state.eventsBound = true;
    const refresh = () => {
      state.loadStarted = element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || state.loadStarted;
      queueVisualVideoSync();
    };
    ["loadedmetadata", "loadeddata", "canplay", "playing"].forEach((name) => {
      element.addEventListener(name, refresh);
    });
    element.addEventListener("emptied", () => {
      // load() also emits `emptied` while a new source is being fetched.
      // Reset only when the src was actually removed, otherwise loading can loop.
      if (!element.hasAttribute("src")) {
        state.generation += 1;
        state.pending = false;
        state.loadStarted = false;
        state.sourceKey = null;
        state.mediaError = false;
        state.autoplayBlocked = false;
      }
      queueVisualVideoSync();
    });
    element.addEventListener("error", () => {
      const code = element.error?.code;
      if (!element.hasAttribute("src") || code === 1) {
        state.pending = false;
        return;
      }
      state.generation += 1;
      state.pending = false;
      state.mediaError = true;
      const label = state.id === "backgroundVideo" ? "fundo da página" :
        state.id === "bannerVideo" ? "banner" : state.id === "avatarVideo" ? "avatar" :
        state.id === "cardBackgroundVideo" ? "fundo do cartão" : "fundo do player";
      if (!state.errorNotified) {
        state.errorNotified = true;
        const detail = code === 3 || code === 4
          ? "O codec não é compatível. Converta para MP4 H.264."
          : "O navegador não conseguiu carregar este arquivo.";
        console.warn(`Falha no vídeo de ${label}.`, element.error);
        showToast(`Vídeo do ${label}: ${detail}`);
      }
    });
  }
}

function refreshVisualVideoVisibility(states) {
  states.forEach((state) => {
    if (state.alwaysVisible) {
      state.visible = !state.element.hidden && state.element.hasAttribute("src");
      state.ratio = state.visible ? 1 : 0;
      return;
    }
    const video = state.element;
    state.visible = isVisualVideoNearViewport(video);
    state.ratio = state.visible ? 1 : 0;
  });
}

function queueVisualVideoSync() {
  if (visualVideoSyncQueued) return;
  visualVideoSyncQueued = true;
  requestAnimationFrame(() => {
    visualVideoSyncQueued = false;
    const now = performance.now();
    // Coalesce bursts of media/scroll events without creating a playback loop.
    if (now - lastVisualVideoSync < 40) {
      setTimeout(queueVisualVideoSync, 40);
      return;
    }
    lastVisualVideoSync = now;
    syncVisualVideoPlayback();
  });
}

function syncVisualVideoPlayback() {
  const pageCanAnimate = profile.animarMidia !== false && document.visibilityState !== "hidden";
  const states = [...visualVideoStates.values()];
  refreshVisualVideoVisibility(states);

  const candidates = states.filter((state) => {
    const video = state.element;
    return pageCanAnimate && state.visible && !video.hidden && video.hasAttribute("src") &&
      !state.isManuallyPaused() && !state.autoplayBlocked && !state.mediaError;
  }).sort((a, b) => {
    const scoreA = a.priority + Math.min(1, a.ratio) * 8;
    const scoreB = b.priority + Math.min(1, b.ratio) * 8;
    return scoreB - scoreA;
  });

  const musicVideo = $("profileVideo");
  const musicVideoIsPlaying = musicMediaType === "video" && musicVideo && !musicVideo.paused;
  const slots = Math.max(1, getVisualVideoSlots() - (musicVideoIsPlaying ? 1 : 0));
  const selected = new Set(candidates.slice(0, slots));

  states.forEach((state) => {
    const video = state.element;
    const shouldPlay = selected.has(state);
    const sourceKey = video.getAttribute("src") || video.currentSrc || "";

    if (sourceKey && state.sourceKey !== sourceKey) {
      state.generation += 1;
      state.pending = false;
      state.loadStarted = false;
      state.sourceKey = sourceKey;
      state.autoplayBlocked = false;
      state.mediaError = false;
      state.errorNotified = false;
    }

    if (!shouldPlay) {
      if (state.pending) {
        state.generation += 1;
        state.pending = false;
      }
      if (!video.paused) video.pause();
      video.preload = state.visible && !video.hidden ? "metadata" : "none";
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) state.loadStarted = false;
      return;
    }

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    if (state.pending || !video.paused || state.autoplayBlocked || state.mediaError) return;

    // Explicitly ask the browser to fetch and decode the first frame before play().
    // This avoids starting with an empty frame and lets loadeddata/canplay resume scheduling.
    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      if (!state.loadStarted) {
        state.loadStarted = true;
        try { video.load(); }
        catch (error) {
          state.loadStarted = false;
          console.warn(`Não foi possível carregar o vídeo ${state.id}.`, error);
        }
      }
      return;
    }

    state.pending = true;
    const generation = ++state.generation;
    Promise.resolve().then(() => video.play()).then(() => {
      const requestIsCurrent = state.generation === generation;
      if (!requestIsCurrent || !selected.has(state) || document.visibilityState === "hidden") {
        video.pause();
      }
      if (requestIsCurrent) state.pending = false;
      queueVisualVideoSync();
    }).catch((error) => {
      // A previous play() may reject with AbortError when a source is replaced.
      // Never let that stale rejection block playback of the newly selected file.
      if (state.generation !== generation) return;
      state.pending = false;
      if (error?.name === "AbortError") return;
      if (error?.name === "NotAllowedError") {
        state.autoplayBlocked = true;
        console.warn(`Autoplay bloqueado para ${state.id}.`, error);
      } else if (error?.name === "NotSupportedError") {
        state.mediaError = true;
        console.warn(`Formato de vídeo não suportado em ${state.id}.`, error);
      } else {
        console.warn(`Falha ao iniciar vídeo ${state.id}.`, error);
      }
    });
  });
}

function clearAvatar() {
  updateCropPreview("avatar", null);
  $("avatarImage").hidden = true;
  $("avatarVideo").hidden = true;
  $("avatarPlaceholder").hidden = false;

  $("avatarImage").removeAttribute("src");
  $("avatarVideo").pause();
  $("avatarVideo").removeAttribute("src");
  $("avatarVideo").load();
}

function displayAvatar(file) {
  clearAvatar();
  updateCropPreview("avatar", file);

  revokeURL(avatarURL);
  avatarURL = URL.createObjectURL(file);

  if (getVisualMediaKind(file) === "video") {
    prepareVideo($("avatarVideo"));
    $("avatarVideo").src = avatarURL;
    $("avatarVideo").hidden = false;
    $("avatarPlaceholder").hidden = true;

  } else {
    $("avatarImage").src = avatarURL;
    $("avatarImage").hidden = false;
    $("avatarPlaceholder").hidden = true;
  }
  applyMediaPlayback();
}

function clearBanner() {
  updateCropPreview("banner", null);
  $("bannerImage").hidden = true;
  $("bannerVideo").hidden = true;
  $("bannerImage").removeAttribute("src");
  $("bannerVideo").pause();
  $("bannerVideo").removeAttribute("src");
  $("bannerVideo").load();
}

function displayBanner(file) {
  clearBanner();
  updateCropPreview("banner", file);
  revokeURL(bannerURL);
  bannerURL = URL.createObjectURL(file);

  if (getVisualMediaKind(file) === "video") {
    const video = $("bannerVideo");
    prepareVideo(video);
    video.src = bannerURL;
    video.hidden = false;
  } else {
    $("bannerImage").src = bannerURL;
    $("bannerImage").hidden = false;
  }
  applyMediaPlayback();
}

function clearBackground() {
  updateCropPreview("background", null);
  const video = $("backgroundVideo");
  const image = $("backgroundImage");
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.hidden = true;
  image.hidden = true;
  image.removeAttribute("src");
  document.body.classList.remove("has-animated-background");
}

function displayBackground(file) {
  clearBackground();
  updateCropPreview("background", file);
  revokeURL(backgroundURL);
  backgroundURL = URL.createObjectURL(file);

  if (getVisualMediaKind(file) === "video") {
    const video = $("backgroundVideo");
    prepareVideo(video);
    video.src = backgroundURL;
    video.hidden = false;
  } else {
    const image = $("backgroundImage");
    image.src = backgroundURL;
    image.hidden = false;
  }
  document.body.classList.add("has-animated-background");
  applyCropSettings();
  applyMediaPlayback();
}

function clearCardBackground() {
  updateCropPreview("cardBackground", null);
  document.body.classList.remove("has-card-background");
  const image = $("cardBackgroundImage");
  const video = $("cardBackgroundVideo");
  image.hidden = true;
  image.removeAttribute("src");
  video.pause();
  video.hidden = true;
  video.removeAttribute("src");
  video.load();
}

function displayCardBackground(file) {
  clearCardBackground();
  document.body.classList.add("has-card-background");
  updateCropPreview("cardBackground", file);
  revokeURL(cardBackgroundURL);
  cardBackgroundURL = URL.createObjectURL(file);

  if (getVisualMediaKind(file) === "video") {
    const video = $("cardBackgroundVideo");
    prepareVideo(video);
    video.src = cardBackgroundURL;
    video.hidden = false;
  } else {
    const image = $("cardBackgroundImage");
    image.src = cardBackgroundURL;
    image.hidden = false;
  }
  applyCropSettings();
  applyMediaPlayback();
}

function clampPercent(value, fallback = 100) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(100, Math.max(0, number)) : fallback;
}

function applyMediaOpacitySettings() {
  const groups = [
    { key: "bannerOpacity", ids: ["bannerImage", "bannerVideo"], fallback: 100 },
    { key: "cardBackgroundOpacity", ids: ["cardBackgroundImage", "cardBackgroundVideo"], fallback: 100 },
    { key: "backgroundOpacity", ids: ["backgroundImage", "backgroundVideo"], fallback: 34 },
    { key: "musicBarBackgroundOpacity", ids: ["musicBarBackgroundImage", "musicBarBackgroundVideo"], fallback: 24 }
  ];

  groups.forEach(({ key, ids, fallback }) => {
    const opacity = clampPercent(profile[key], fallback) / 100;
    ids.forEach((id) => {
      const element = $(id);
      if (element) element.style.opacity = String(opacity);
    });
    const input = $(key);
    const output = $(`${key}Value`);
    if (input) input.value = String(Math.round(opacity * 100));
    if (output) output.textContent = `${Math.round(opacity * 100)}%`;
  });
}

function updateMediaOpacity(key, value) {
  profile[key] = clampPercent(value, DEFAULT_PROFILE[key]);
  applyMediaOpacitySettings();
  saveProfile();
}

function applyMusicPlayerSize() {
  const player = $("profileMusic");
  if (!player || player.classList.contains("is-docked")) return;
  const width = Math.min(620, Math.max(220, Number(profile.musicPlayerWidth) || DEFAULT_PROFILE.musicPlayerWidth));
  const height = Math.min(220, Math.max(56, Number(profile.musicPlayerHeight) || DEFAULT_PROFILE.musicPlayerHeight));
  player.style.width = `${width}px`;
  player.style.height = `${height}px`;
}

function applyMusicPlayerPosition() {
  const player = $("profileMusic");
  if (!player || !player.classList.contains("is-floating")) return;
  const hasPosition = Number.isFinite(profile.musicPlayerX) && Number.isFinite(profile.musicPlayerY);
  if (!hasPosition) {
    player.style.left = "";
    player.style.top = "";
    player.style.right = "max(14px, env(safe-area-inset-right))";
    player.style.bottom = "max(14px, env(safe-area-inset-bottom))";
    return;
  }
  const rect = player.getBoundingClientRect();
  const width = rect.width || profile.musicPlayerWidth || DEFAULT_PROFILE.musicPlayerWidth;
  const height = rect.height || profile.musicPlayerHeight || DEFAULT_PROFILE.musicPlayerHeight;
  const maxX = Math.max(8, window.innerWidth - width - 8);
  const maxY = Math.max(8, window.innerHeight - height - 8);
  profile.musicPlayerX = Math.min(maxX, Math.max(8, profile.musicPlayerX));
  profile.musicPlayerY = Math.min(maxY, Math.max(8, profile.musicPlayerY));
  player.style.left = `${profile.musicPlayerX}px`;
  player.style.top = `${profile.musicPlayerY}px`;
  player.style.right = "auto";
  player.style.bottom = "auto";
}

function setupMusicPlayerResize() {
  const player = $("profileMusic");
  if (!player || !("ResizeObserver" in window)) return;
  musicPlayerResizeObserver?.disconnect();
  musicPlayerResizeObserver = new ResizeObserver((entries) => {
    if (player.hidden || !player.classList.contains("is-floating")) return;
    const entry = entries[0];
    if (!entry) return;
    const bounds = player.getBoundingClientRect();
    const width = Math.round(bounds.width || entry.contentRect.width);
    const height = Math.round(bounds.height || entry.contentRect.height);
    if (width < 220 || height < 56) return;
    profile.musicPlayerWidth = Math.min(620, width);
    profile.musicPlayerHeight = Math.min(220, height);
    applyMusicPlayerPosition();
    clearTimeout(musicPlayerResizeTimer);
    musicPlayerResizeTimer = setTimeout(saveProfile, 300);
  });
  musicPlayerResizeObserver.observe(player);
}

function setupMusicPlayerDrag() {
  const player = $("profileMusic");
  const handle = player?.querySelector(".music-player-top");
  if (!player || !handle) return;

  let dragState = null;
  handle.addEventListener("pointerdown", (event) => {
    if (!player.classList.contains("is-floating") || event.button !== 0 || event.target.closest("button")) return;
    const rect = player.getBoundingClientRect();
    dragState = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left,
      top: rect.top,
      moved: false
    };
    player.style.left = `${rect.left}px`;
    player.style.top = `${rect.top}px`;
    player.style.right = "auto";
    player.style.bottom = "auto";
    try { handle.setPointerCapture(event.pointerId); } catch {}
    event.preventDefault();
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const rect = player.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - rect.width - 8);
    const maxY = Math.max(8, window.innerHeight - rect.height - 8);
    const nextX = Math.min(maxX, Math.max(8, dragState.left + event.clientX - dragState.startX));
    const nextY = Math.min(maxY, Math.max(8, dragState.top + event.clientY - dragState.startY));
    if (Math.abs(event.clientX - dragState.startX) + Math.abs(event.clientY - dragState.startY) > 3) dragState.moved = true;
    player.style.left = `${nextX}px`;
    player.style.top = `${nextY}px`;
    profile.musicPlayerX = nextX;
    profile.musicPlayerY = nextY;
  });

  const finishDrag = (event) => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const moved = dragState.moved;
    dragState = null;
    if (moved) saveProfile();
  };
  handle.addEventListener("pointerup", finishDrag);
  handle.addEventListener("pointercancel", finishDrag);
  window.addEventListener("resize", () => {
    applyMusicPlayerPosition();
    if (player.classList.contains("is-floating")) saveProfile();
  }, { passive: true });
}

function resetMusicPlayerPlacement() {
  profile.musicPlayerWidth = DEFAULT_PROFILE.musicPlayerWidth;
  profile.musicPlayerHeight = DEFAULT_PROFILE.musicPlayerHeight;
  profile.musicPlayerX = null;
  profile.musicPlayerY = null;
  $("musicPlayerWidth").value = DEFAULT_PROFILE.musicPlayerWidth;
  $("musicPlayerHeight").value = DEFAULT_PROFILE.musicPlayerHeight;
  $("musicPlayerWidthValue").textContent = `${DEFAULT_PROFILE.musicPlayerWidth} px`;
  $("musicPlayerHeightValue").textContent = `${DEFAULT_PROFILE.musicPlayerHeight} px`;
  const player = $("profileMusic");
  if (player?.classList.contains("is-floating")) {
    applyMusicPlayerSize();
    player.style.left = "";
    player.style.top = "";
    player.style.right = "max(14px, env(safe-area-inset-right))";
    player.style.bottom = "max(14px, env(safe-area-inset-bottom))";
  }
  saveProfile();
  showToast("Posição e tamanho originais restaurados.");
}

function clearMusicBarBackground() {
  const image = $("musicBarBackgroundImage");
  const video = $("musicBarBackgroundVideo");
  if (image) { image.hidden = true; image.removeAttribute("src"); }
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.hidden = true;
  }
  const name = $("musicBarBackgroundName");
  if (name) name.textContent = "Nenhum fundo personalizado selecionado.";
  applyMediaOpacitySettings();
}

function displayMusicBarBackground(file) {
  // The decorative layer is independent from the audio/video track: never pause,
  // replace or clear profileAudio/profileVideo while changing this background.
  clearMusicBarBackground();
  updateCropPreview("musicBarBackground", file);
  revokeURL(musicBarBackgroundURL);
  musicBarBackgroundURL = file ? URL.createObjectURL(file) : null;
  if (!file || !musicBarBackgroundURL) {
    const name = $("musicBarBackgroundName");
    if (name) name.textContent = "Nenhum fundo personalizado selecionado.";
    return;
  }

  if (getVisualMediaKind(file) === "video") {
    const video = $("musicBarBackgroundVideo");
    prepareVideo(video);
    video.src = musicBarBackgroundURL;
    video.hidden = false;
  } else {
    const image = $("musicBarBackgroundImage");
    image.src = musicBarBackgroundURL;
    image.hidden = false;
  }
  const name = $("musicBarBackgroundName");
  if (name) name.textContent = `Fundo atual: ${file.name || "mídia personalizada"}`;
  applyMediaOpacitySettings();
  applyCropSettings();
  applyCropPreviewStyle("musicBarBackground");
  applyMediaPlayback();
  // Reaffirm loop playback on the primary media without changing its source.
  const activeMusic = getActiveMusicElement();
  if (activeMusic && currentMusicFile) activeMusic.loop = true;
}

function applyBannerSettings() {
  const banner = document.querySelector(".banner");
  if (!banner) return;
  const rawHeight = Math.min(620, Math.max(240, Number(profile.bannerHeight) || 355));
  const heightValue = `${rawHeight}px`;
  banner.style.setProperty("--banner-height", heightValue);
  document.documentElement.style.setProperty("--profile-banner-height", heightValue);
}

function updateBannerRangeLabels() {
  $("bannerHeightValue").textContent = `${profile.bannerHeight || 355} px`;
}

function applyCropSettings() {
  const targets = {
    avatar: [ $("avatarImage"), $("avatarVideo") ],
    banner: [ $("bannerImage"), $("bannerVideo") ],
    cardBackground: [ $("cardBackgroundImage"), $("cardBackgroundVideo") ],
    background: [ $("backgroundImage"), $("backgroundVideo") ],
    musicBarBackground: [ $("musicBarBackgroundImage"), $("musicBarBackgroundVideo") ]
  };

  Object.entries(targets).forEach(([key, elements]) => {
    const crop = profile[`${key}Crop`] || { x: 50, y: 50, zoom: 100 };
    elements.forEach((element) => {
      element.style.setProperty("--crop-x", `${crop.x}%`);
      element.style.setProperty("--crop-y", `${crop.y}%`);
      element.style.setProperty("--crop-zoom", `${crop.zoom / 100}`);
    });
  });
}

function applyDividerSettings() {
  const divider = $("profileDivider");
  if (!divider) return;
  const style = ["none", "minimal", "double", "dotted", "ornamental", "celestial", "gothic", "royal"].includes(profile.dividerStyle) ? profile.dividerStyle : "ornamental";
  divider.className = `profile-divider divider-${style}`;
  divider.style.setProperty("--divider-color", profile.dividerCustomColorEnabled ? profile.dividerColor : "var(--accent)");
  divider.hidden = style === "none";
}

function updateCropLabels(key) {
  const crop = profile[`${key}Crop`] || { x: 50, y: 50, zoom: 100 };
  $(`${key}CropXValue`).textContent = `${crop.x}%`;
  $(`${key}CropYValue`).textContent = `${crop.y}%`;
  $(`${key}CropZoomValue`).textContent = `${crop.zoom}%`;
}

function updateCropPreview(key, file) {
  const image = $(`${key}CropPreview`);
  const video = $(`${key}CropPreviewVideo`);
  const empty = $(`${key}CropEmpty`);
  if (!image || !video || !empty) return;

  image.hidden = true;
  video.hidden = true;
  [image.dataset.previewUrl, video.dataset.previewUrl].filter(Boolean).forEach((url) => URL.revokeObjectURL(url));
  delete image.dataset.previewUrl;
  delete video.dataset.previewUrl;
  image.removeAttribute("src");
  video.pause();
  video.removeAttribute("src");

  const selection = document.querySelector(`[data-crop="${key}"] .crop-safe-window`);
  if (!file) {
    empty.hidden = false;
    if (selection) selection.hidden = true;
    return;
  }

  if (selection) selection.hidden = false;
  const previewURL = URL.createObjectURL(file);
  image.dataset.previewUrl = previewURL;
  video.dataset.previewUrl = previewURL;

  if (getVisualMediaKind(file) === "video") {
    video.src = previewURL;
    video.hidden = false;
    video.addEventListener("loadedmetadata", () => updateCropPreviewGeometry(key, video), { once: true });
    video.play().catch(() => {});
  } else {
    image.src = previewURL;
    image.hidden = false;
    image.addEventListener("load", () => updateCropPreviewGeometry(key, image), { once: true });
  }
  empty.hidden = true;
  applyCropPreviewStyle(key);
}

function updateCropPreviewGeometry(key, media) {
  const preview = document.querySelector(`[data-crop="${key}"] .crop-preview`);
  const windowElement = preview?.querySelector(".crop-safe-window");
  if (!preview || !windowElement) return;

  const sourceWidth = media.videoWidth || media.naturalWidth || 1;
  const sourceHeight = media.videoHeight || media.naturalHeight || 1;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatios = { avatar: 1, banner: 16 / 7, cardBackground: 16 / 9, background: 16 / 9, musicBarBackground: 16 / 5 };
  const targetRatio = targetRatios[key] || 16 / 9;
  const crop = profile[`${key}Crop`] || { x: 50, y: 50, zoom: 100 };
  const zoom = crop.zoom / 100;

  const visibleWidth = Math.min(1, targetRatio / sourceRatio) / zoom;
  const visibleHeight = Math.min(1, sourceRatio / targetRatio) / zoom;
  const left = (100 - visibleWidth * 100) * (crop.x / 100);
  const top = (100 - visibleHeight * 100) * (crop.y / 100);

  const maxWidth = Math.min(preview.parentElement.clientWidth || 520, 520, 220 * sourceRatio);
  preview.style.width = `${Math.max(100, maxWidth)}px`;
  preview.style.height = `${Math.max(90, maxWidth / sourceRatio)}px`;
  preview.style.aspectRatio = `${sourceWidth} / ${sourceHeight}`;
  preview.style.marginInline = "auto";

  windowElement.style.left = `${left}%`;
  windowElement.style.top = `${top}%`;
  windowElement.style.width = `${visibleWidth * 100}%`;
  windowElement.style.height = `${visibleHeight * 100}%`;
}

function applyCropPreviewStyle(key) {
  const crop = profile[`${key}Crop`] || { x: 50, y: 50, zoom: 100 };
  const preview = document.querySelector(`[data-crop="${key}"] .crop-preview`);
  if (!preview) return;
  preview.style.setProperty("--crop-x", `${crop.x}%`);
  preview.style.setProperty("--crop-y", `${crop.y}%`);
  preview.style.setProperty("--crop-zoom", `${crop.zoom / 100}`);
  const media = preview.querySelector("img:not([hidden]), video:not([hidden])");
  if (media && (media.naturalWidth || media.videoWidth)) updateCropPreviewGeometry(key, media);
}

function setCropValue(key, axis, value) {
  const cropKey = `${key}Crop`;
  profile[cropKey] ||= { x: 50, y: 50, zoom: 100 };
  profile[cropKey][axis] = Number(value);
  updateCropLabels(key);
  applyCropSettings();
  applyCropPreviewStyle(key);
}

function resetCrop(key) {
  profile[`${key}Crop`] = { x: 50, y: 50, zoom: 100 };
  ["X", "Y", "Zoom"].forEach((axis) => {
    $(`${key}Crop${axis}`).value = axis === "Zoom" ? 100 : 50;
  });
  updateCropLabels(key);
  applyCropSettings();
  applyCropPreviewStyle(key);
  saveProfile();
}

async function restoreMedia() {
  const keys = ["avatar", "banner", "background", "cardBackground", "music", "musicCover", "musicBarBackground"];
  const records = await Promise.all(keys.map(async (key) => {
    try {
      return await getMedia(key);
    } catch (error) {
      console.warn(`Não foi possível restaurar a mídia "${key}".`, error);
      return null;
    }
  }));
  const [avatar, banner, background, cardBackground, music, musicCover, musicBarBackground] = records;

  if (avatar) displayAvatar(avatar);
  if (banner) displayBanner(banner);
  if (background) displayBackground(background);
  if (cardBackground) displayCardBackground(cardBackground);
  if (musicCover) displayMusicCover(musicCover);
  if (musicBarBackground) displayMusicBarBackground(musicBarBackground);
  if (music) displayMusic(music);
  applyMediaPlayback();
}

function applyMediaPlayback() {
  VISUAL_VIDEO_CONFIG.forEach((config) => {
    const element = $(config.id);
    if (!element) return;
    registerVisualVideo(element, config);
  });
  syncVisualVideoPlayback();
}

function setMediaAnimation(enabled) {
  profile.animarMidia = enabled;
  if (enabled) {
    visualVideoStates.forEach((state) => {
      state.autoplayBlocked = false;
      state.mediaError = false;
      state.errorNotified = false;
      state.loadStarted = false;
    });
  }
  saveProfile();
  applyMediaPlayback();
}

function getActiveMusicElement() {
  return musicMediaType === "video" ? $("profileVideo") : $("profileAudio");
}

function formatMediaTime(value) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const total = Math.floor(value);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateMusicTimeline() {
  const media = getActiveMusicElement();
  if (!media) return;
  const duration = Number.isFinite(media.duration) ? media.duration : 0;
  const current = Number.isFinite(media.currentTime) ? media.currentTime : 0;
  const percent = duration > 0 ? Math.min(100, (current / duration) * 100) : 0;
  $("musicTime").textContent = `${formatMediaTime(current)} / ${formatMediaTime(duration)}`;
  $("musicProgressFill").style.width = `${percent}%`;
}

function updateMusicButtons() {
  const media = getActiveMusicElement();
  const playing = Boolean(media && !media.paused);
  $("musicToggle").textContent = playing ? "Ⅱ" : "▶";
  $("musicToggle").title = playing ? "Pausar" : "Reproduzir";
  $("previewMusic").textContent = playing ? "Pausar mídia" : "Reproduzir / pausar";
}

function setCaptureMode(enabled) {
  const next = Boolean(enabled);
  if (next && $("editorModal")?.classList.contains("open")) closeEditor();
  document.body.classList.toggle("capture-mode", next);
  const button = $("toggleCaptureMode");
  const exitButton = $("exitCaptureMode");
  if (button) {
    button.setAttribute("aria-pressed", String(next));
    button.setAttribute("aria-label", next ? "Modo captura ativo" : "Ativar modo captura");
    button.title = next ? "Modo captura ativo" : "Ativar modo captura";
  }
  if (exitButton) {
    exitButton.setAttribute("aria-hidden", String(!next));
    exitButton.tabIndex = next ? 0 : -1;
  }
  if (!next) showToast("Modo captura desativado.");
}

function resetThemeColor(key) {
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_PROFILE.cores, key)) return;
  profile.cores[key] = DEFAULT_PROFILE.cores[key];
  profile.tema = "custom";
  applyColors({ [key]: DEFAULT_PROFILE.cores[key] });
  fillColorInputs();
  updateThemeButtons();
  saveProfile();
  showToast("Cor original restaurada.");
}

function resetFont() {
  profile.fonte = DEFAULT_PROFILE.fonte;
  $("fontFamily").value = DEFAULT_PROFILE.fonte;
  document.documentElement.style.setProperty("--font", `"${DEFAULT_PROFILE.fonte}", sans-serif`);
  saveProfile();
  showToast("Tipografia original restaurada.");
}

function resetThemeColors() {
  profile.tema = DEFAULT_PROFILE.tema;
  profile.cores = structuredClone(DEFAULT_PROFILE.cores);
  applyColors(profile.cores);
  fillColorInputs();
  updateThemeButtons();
  saveProfile();
  showToast("Cores originais restauradas.");
}

function resetVerifiedColor() {
  profile.verificadoCor = DEFAULT_PROFILE.verificadoCor;
  $("verifiedColor").value = DEFAULT_PROFILE.verificadoCor;
  renderIdentity();
  saveProfile();
  showToast("Cor original do selo restaurada.");
}

function resetFrameAppearance() {
  profile.moldura = DEFAULT_PROFILE.moldura;
  profile.raridadeMoldura = DEFAULT_PROFILE.raridadeMoldura;
  profile.molduraCorPersonalizada = DEFAULT_PROFILE.molduraCorPersonalizada;
  profile.molduraCor = DEFAULT_PROFILE.molduraCor;
  $("avatarFrameSelect").value = profile.moldura;
  $("frameRarity").value = profile.raridadeMoldura;
  $("customFrameColorEnabled").checked = false;
  $("customFrameColor").value = profile.molduraCor;
  $("customFrameColor").disabled = true;
  renderFrame();
  saveProfile();
  showToast("Moldura original restaurada.");
}

function resetDividerAppearance() {
  profile.dividerStyle = DEFAULT_PROFILE.dividerStyle;
  profile.dividerCustomColorEnabled = DEFAULT_PROFILE.dividerCustomColorEnabled;
  profile.dividerColor = DEFAULT_PROFILE.dividerColor;
  $("dividerStyle").value = profile.dividerStyle;
  $("dividerCustomColorEnabled").checked = profile.dividerCustomColorEnabled;
  $("dividerColor").value = profile.dividerColor;
  $("dividerColor").disabled = true;
  applyDividerSettings();
  saveProfile();
  showToast("Divisória original restaurada.");
}

function resetProfileSetting(key) {
  if (!(key in DEFAULT_PROFILE)) return;
  profile[key] = DEFAULT_PROFILE[key];
  const input = $(key);
  if (input) input.value = String(DEFAULT_PROFILE[key]);
  if (key === "bannerHeight") {
    updateBannerRangeLabels();
    applyBannerSettings();
  } else if (key === "volume") {
    $("musicVolume").value = DEFAULT_PROFILE.volume;
    $("musicVolumeValue").textContent = `${DEFAULT_PROFILE.volume}%`;
    $("profileAudio").volume = DEFAULT_PROFILE.volume / 100;
    $("profileVideo").volume = DEFAULT_PROFILE.volume / 100;
  } else if (["bannerOpacity", "cardBackgroundOpacity", "backgroundOpacity", "musicBarBackgroundOpacity"].includes(key)) {
    applyMediaOpacitySettings();
  } else if (["gradientIntensity", "cardRadius"].includes(key)) {
    applyDesignSettings();
  } else if (["musicPlayerWidth", "musicPlayerHeight"].includes(key)) {
    applyMusicPlayerSize();
    $("musicPlayerWidthValue").textContent = `${profile.musicPlayerWidth} px`;
    $("musicPlayerHeightValue").textContent = `${profile.musicPlayerHeight} px`;
  }
  saveProfile();
  showToast("Valor original restaurado.");
}

function resetAppearance() {
  const keys = [
    "tema", "gradientIntensity", "cardRadius", "verificadoCor", "bannerHeight",
    "bannerOpacity", "cardBackgroundOpacity", "backgroundOpacity", "musicBarBackgroundOpacity",
    "musicPlayerWidth", "musicPlayerHeight", "musicPlayerX", "musicPlayerY", "dividerStyle",
    "dividerCustomColorEnabled", "dividerColor", "moldura", "raridadeMoldura",
    "molduraCorPersonalizada", "molduraCor", "efeitosPerfil", "fonte", "volume",
    "animarMidia", "avatarPausado", "bannerPausado", "fundoPausado", "cardBackgroundPausado"
  ];
  keys.forEach((key) => { profile[key] = structuredClone(DEFAULT_PROFILE[key]); });
  profile.cores = structuredClone(DEFAULT_PROFILE.cores);
  ["avatar", "banner", "cardBackground", "background", "musicBarBackground"].forEach((key) => {
    profile[`${key}Crop`] = structuredClone(DEFAULT_PROFILE[`${key}Crop`]);
  });
  applyColors(profile.cores);
  applyMediaOpacitySettings();
  applyCropSettings();
  applyBannerSettings();
  applyDividerSettings();
  renderFrame();
  setMediaAnimation(true);
  $("profileAudio").volume = DEFAULT_PROFILE.volume / 100;
  $("profileVideo").volume = DEFAULT_PROFILE.volume / 100;
  applyMusicPlayerSize();
  const player = $("profileMusic");
  if (player?.classList.contains("is-floating")) {
    player.style.left = "";
    player.style.top = "";
    player.style.right = "max(14px, env(safe-area-inset-right))";
    player.style.bottom = "max(14px, env(safe-area-inset-bottom))";
  }
  fillEditor();
  renderProfile();
  saveProfile();
  showToast("Personalizações visuais restauradas sem apagar suas mídias.");
}

function setMusicPlayerPosition(docked) {
  const player = $("profileMusic");
  if (docked && player.classList.contains("is-floating")) {
    const width = Math.round(player.getBoundingClientRect().width);
    const height = Math.round(player.getBoundingClientRect().height);
    if (width >= 220) profile.musicPlayerWidth = Math.min(620, width);
    if (height >= 56) profile.musicPlayerHeight = Math.min(220, height);
    saveProfile();
  }

  player.classList.toggle("is-docked", docked);
  player.classList.toggle("is-floating", !docked);
  if (docked) {
    player.style.width = "";
    player.style.height = "";
    player.style.left = "";
    player.style.top = "";
    player.style.right = "";
    player.style.bottom = "";
  } else {
    applyMusicPlayerSize();
    applyMusicPlayerPosition();
  }
  $("dockMusic").textContent = docked ? "↗" : "⌄";
  $("dockMusic").title = docked ? "Fixar player no canto" : "Mover para o fim do perfil";
  $("dockMusic").setAttribute("aria-label", docked ? "Fixar player no canto" : "Mover player para o fim do perfil");
}

function displayMusicCover(file) {
  currentMusicCoverFile = file || null;
  revokeURL(musicCoverURL);
  musicCoverURL = file ? URL.createObjectURL(file) : null;
  const image = $("musicCoverImage");
  const fallback = $("musicCoverFallback");
  const name = $("musicCoverName");
  if (image) { image.hidden = !musicCoverURL; image.src = musicCoverURL || ""; }
  if (fallback) fallback.hidden = Boolean(musicCoverURL);
  if (name) name.textContent = file ? `Capa: ${file.name || "Capa personalizada"}` : "Nenhuma capa selecionada.";
}

function displayMusic(file) {
  currentMusicFile = file;
  const isVideo = file.type?.startsWith("video/") || /\.(mp4|webm|mov|ogv|m4v)$/i.test(file.name || "");
  musicMediaType = isVideo ? "video" : "audio";
  revokeURL(musicURL);
  musicURL = URL.createObjectURL(file);

  const audio = $("profileAudio");
  const video = $("profileVideo");
  audio.pause();
  video.pause();
  audio.removeAttribute("src");
  video.removeAttribute("src");
  audio.load();
  video.load();

  if (isVideo) {
    video.preload = "auto";
    video.src = musicURL;
    video.loop = true;
    video.load();
    video.volume = profile.volume / 100;
    video.hidden = true;
    audio.removeAttribute("src");
  } else {
    audio.src = musicURL;
    audio.volume = profile.volume / 100;
    audio.loop = true;
    video.hidden = true;
    video.removeAttribute("src");
  }

  $("downloadMusic").disabled = false;
  $("downloadMusic").textContent = "Baixar arquivo original";
  $("musicTrackName").textContent = (file.name || (isVideo ? "Meu vídeo" : "Minha música")).replace(/\.[^/.]+$/, "");
  $("profileMusic").hidden = false;
  setMusicPlayerPosition(false);
  updateMusicButtons();
  updateMusicTimeline();
}

async function toggleMusic() {
  const media = getActiveMusicElement();
  if (!currentMusicFile || !media?.src) {
    showToast("Adicione uma música ou vídeo primeiro.");
    return;
  }
  try {
    if (media.paused) {
      media.loop = true;
      await media.play();
    } else {
      media.pause();
    }
    updateMusicButtons();
    syncVisualVideoPlayback();
  } catch (error) {
    console.error("Falha ao reproduzir mídia:", error);
    showToast("Não foi possível reproduzir este arquivo neste navegador.");
  }
}

async function removeMusic() {
  try {
    await Promise.all([deleteMedia("music"), deleteMedia("musicCover")]);
  } catch (error) {
    console.error("Erro ao remover mídia:", error);
    showToast("Não foi possível remover a mídia.");
    return;
  }

  const audio = $("profileAudio");
  const video = $("profileVideo");
  [audio, video].forEach((media) => {
    media.pause();
    media.removeAttribute("src");
    media.load();
  });

  currentMusicFile = null;
  musicMediaType = "audio";
  revokeURL(musicURL);
  musicURL = null;
  displayMusicCover(null);
  $("downloadMusic").disabled = true;
  $("profileMusic").hidden = true;
  $("profileMusic").classList.remove("is-floating", "is-docked");
  $("musicToggle").textContent = "▶";
  updateMusicTimeline();
  showToast("Mídia removida.");
}

async function removeMusicCover() {
  try {
    await deleteMedia("musicCover");
    displayMusicCover(null);
    showToast("Capa removida.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível remover a capa.");
  }
}

function renderStatsEditor() {
  const container = $("statsEditor");

  container.innerHTML = profile.estatisticas.map((stat) => `
    <div class="dynamic-row" data-id="${escapeHTML(stat.id)}">
      <input
        class="text-input row-label"
        type="text"
        maxlength="35"
        placeholder="Título do item"
        value="${escapeHTML(stat.label)}"
      >

      <input
        class="text-input row-value"
        type="text"
        maxlength="45"
        placeholder="Texto ou informação (opcional)"
        value="${escapeHTML(stat.value)}"
      >

      <button class="remove-row" type="button" title="Remover">×</button>
    </div>
  `).join("");
}

function addStat() {
  profile.estatisticas.push({
    id: createId(),
    label: "NOVO ITEM",
    value: "",
    icon: "✧"
  });

  renderStatsEditor();
  renderStats();
}

function handleStatsEditor(event) {
  const row = event.target.closest(".dynamic-row");

  if (!row) return;

  const item = profile.estatisticas.find(
    (stat) => stat.id === row.dataset.id
  );

  if (!item) return;

  if (event.target.classList.contains("row-label")) {
    item.label = event.target.value;
    item.icon = getStatIcon(item.label);
    renderStats();
  }

  if (event.target.classList.contains("row-value")) {
    item.value = event.target.value;
    renderStats();
  }

  if (event.target.classList.contains("remove-row")) {
    profile.estatisticas = profile.estatisticas.filter(
      (stat) => stat.id !== item.id
    );

    renderStatsEditor();
    renderStats();
  }
}

function renderDetailsEditor() {
  const container = $("detailsEditor");

  container.innerHTML = profile.detalhes.map((detail) => `
    <div class="dynamic-row" data-id="${escapeHTML(detail.id)}">
      <input
        class="text-input row-label"
        type="text"
        maxlength="35"
        placeholder="Título do detalhe"
        value="${escapeHTML(detail.label)}"
      >

      <input
        class="text-input row-value"
        type="text"
        maxlength="110"
        placeholder="Valor (opcional)"
        value="${escapeHTML(detail.value)}"
      >

      <button class="remove-row" type="button" title="Remover">×</button>
    </div>
  `).join("");
}

function addDetail() {
  profile.detalhes.push({
    id: createId(),
    label: "NOVO DETALHE",
    value: "",
    icon: "✦"
  });

  renderDetailsEditor();
  renderDetails();
}

function handleDetailsEditor(event) {
  const row = event.target.closest(".dynamic-row");

  if (!row) return;

  const item = profile.detalhes.find(
    (detail) => detail.id === row.dataset.id
  );

  if (!item) return;

  if (event.target.classList.contains("row-label")) {
    item.label = event.target.value;
    item.icon = getDetailIcon(item.label);
    renderDetails();
  }

  if (event.target.classList.contains("row-value")) {
    item.value = event.target.value;
    renderDetails();
  }

  if (event.target.classList.contains("remove-row")) {
    profile.detalhes = profile.detalhes.filter(
      (detail) => detail.id !== item.id
    );

    renderDetailsEditor();
    renderDetails();
  }
}

function getSavedThemes() {
  try {
    const raw = localStorage.getItem(getThemesStorageKey()) ||
      (ACTIVE_PROFILE_ID === "perfil-1" ? localStorage.getItem(THEMES_STORAGE_KEY) : null) || "[]";
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function renderSavedThemes() {
  const select = $("savedThemeSelect");
  if (!select) return;

  const selected = select.value;
  const themes = getSavedThemes();

  select.innerHTML = '<option value="">Selecionar tema salvo</option>' +
    themes.map((theme, index) =>
      `<option value="${index}">${escapeHTML(theme.name)}</option>`
    ).join("");

  if (selected && themes[Number(selected)]) {
    select.value = selected;
  }
}

function saveCurrentTheme() {
  const name = $("savedThemeName").value.trim();

  if (!name) {
    showToast("Digite um nome para o tema.");
    $("savedThemeName").focus();
    return;
  }

  const themes = getSavedThemes();
  if (themes.some((theme) => String(theme.name).toLocaleLowerCase() === name.toLocaleLowerCase())) {
    showToast("Já existe um tema com esse nome.");
    return;
  }
  themes.push({
    name: name.slice(0, 24),
    colors: { ...profile.cores },
    gradientIntensity: Number(profile.gradientIntensity ?? 55),
    cardRadius: Number(profile.cardRadius ?? 18)
  });

  try {
    localStorage.setItem(getThemesStorageKey(), JSON.stringify(themes));
    $("savedThemeName").value = "";
    renderSavedThemes();
    showToast("Tema salvo na biblioteca.");
  } catch (error) {
    showToast("Armazenamento cheio. Exclua temas antigos ou exporte um backup.");
  }
}

function applySavedTheme() {
  const index = Number($("savedThemeSelect").value);
  const theme = getSavedThemes()[index];

  if (!theme) {
    showToast("Selecione um tema salvo.");
    return;
  }

  profile.tema = "custom";
  profile.gradientIntensity = theme.gradientIntensity ?? 55;
  profile.cardRadius = theme.cardRadius ?? 18;
  applyColors(theme.colors || {});
  fillColorInputs();
  $("gradientIntensity").value = profile.gradientIntensity;
  $("cardRadius").value = profile.cardRadius;
  updateThemeButtons();
  showToast(`Tema "${theme.name}" aplicado.`);
}

function deleteSavedTheme() {
  const index = Number($("savedThemeSelect").value);
  const themes = getSavedThemes();

  if (!themes[index]) {
    showToast("Selecione um tema para excluir.");
    return;
  }

  themes.splice(index, 1);
  localStorage.setItem(getThemesStorageKey(), JSON.stringify(themes));
  renderSavedThemes();
  showToast("Tema excluído.");
}

const BADGE_PRESETS = ["Verified", "Gamer", "Artist", "Designer", "VIP", "Creator", "Photographer", "Music", "Technology", "Writer", "Editor", "Collector"];
const RESERVED_LABELS = /\b(admin|administrator|dev|developer|staff|moderator)\b/i;
const normalizeBadge = (value) => /^dono$/i.test(String(value).trim()) ? "Owner" : String(value).trim();
const isBlockedBadge = (value) => RESERVED_LABELS.test(String(value)) || /\b(owner|dono)\b/i.test(String(value));

function renderBadgeLibrary() {
  const container = $("badgeLibrary");
  if (!container) return;

  const selected = $("editBadges").value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && !isBlockedBadge(item));

  container.innerHTML = BADGE_PRESETS.map((badge) => `
    <button
      class="badge-preset${selected.includes(badge) ? " selected" : ""}"
      type="button"
      data-badge="${escapeHTML(badge)}"
      aria-pressed="${selected.includes(badge)}"
    >${escapeHTML(badge)}</button>
  `).join("");
}

function toggleBadgePreset(event) {
  const button = event.target.closest("[data-badge]");
  if (!button) return;

  const badge = button.dataset.badge;
  const badges = $("editBadges").value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const normalized = normalizeBadge(badge);
  const updated = badges.map(normalizeBadge).filter((item) => item !== "Dono" && !isBlockedBadge(item));
  const next = updated.includes(normalized)
    ? updated.filter((item) => item !== normalized)
    : [...updated, normalized];

  $("editBadges").value = [...new Set(next)].join(", ");
  renderBadgeLibrary();
}

function fillEditor() {
  $("editName").value = profile.nome;
  $("editUsername").value = profile.usuario;
  $("editBio").value = profile.bio;
  $("editRole").value = profile.cargo || "";
  $("editVerified").checked = profile.verificado;
  $("verifiedColor").value = profile.verificadoCor || DEFAULT_PROFILE.verificadoCor;
  $("editBadges").value = profile.insignias.join(", ");
  $("editFooter").value = profile.rodape;
  $("bannerHeadingVisible").checked = profile.bannerHeadingVisible !== false;
  $("bannerHeight").value = profile.bannerHeight || 355;
  updateBannerRangeLabels();
  applyBannerSettings();
  $("editBannerTitle").value = profile.bannerTitulo ?? "PERSONAL SPACE";
  $("editBannerSubtitle").value = profile.bannerSubtitulo || "";
  $("editStatsTitle").value = profile.statsTitle || "Em evidência";
  $("editStatsSubtitle").value = profile.statsSubtitle || "";
  $("editDetailsTitle").value = profile.detailsTitle || "Um pouco sobre mim";
  $("editDetailsSubtitle").value = profile.detailsSubtitle || "";

  $("animateMedia").checked = profile.animarMidia;
  $("pauseAvatar").checked = profile.avatarPausado;
  $("pauseBanner").checked = profile.bannerPausado;
  $("pauseBackground").checked = profile.fundoPausado;
  $("pauseCardBackground").checked = profile.cardBackgroundPausado;
  $("bannerOpacity").value = profile.bannerOpacity;
  $("cardBackgroundOpacity").value = profile.cardBackgroundOpacity;
  $("backgroundOpacity").value = profile.backgroundOpacity;
  $("musicBarBackgroundOpacity").value = profile.musicBarBackgroundOpacity;
  $("bannerOpacityValue").textContent = `${profile.bannerOpacity}%`;
  $("cardBackgroundOpacityValue").textContent = `${profile.cardBackgroundOpacity}%`;
  $("backgroundOpacityValue").textContent = `${profile.backgroundOpacity}%`;
  $("musicBarBackgroundOpacityValue").textContent = `${profile.musicBarBackgroundOpacity}%`;
  ["avatar", "banner", "cardBackground", "background", "musicBarBackground"].forEach((key) => {
    const crop = profile[`${key}Crop`] || { x: 50, y: 50, zoom: 100 };
    $(`${key}CropX`).value = crop.x;
    $(`${key}CropY`).value = crop.y;
    $(`${key}CropZoom`).value = crop.zoom;
    updateCropLabels(key);
  });
  $("dividerStyle").value = profile.dividerStyle || "ornamental";
  $("dividerCustomColorEnabled").checked = Boolean(profile.dividerCustomColorEnabled);
  $("dividerColor").value = profile.dividerColor || "#a78bfa";
  $("dividerColor").disabled = !profile.dividerCustomColorEnabled;
  $("avatarFrameSelect").value = profile.moldura;
  $("frameRarity").value = profile.raridadeMoldura || "none";
  $("customFrameColorEnabled").checked = Boolean(profile.molduraCorPersonalizada);
  $("customFrameColor").value = profile.molduraCor || "#a78bfa";
  $("customFrameColor").disabled = !profile.molduraCorPersonalizada;
  $("profileEffects").checked = profile.efeitosPerfil !== false;
  $("fontFamily").value = profile.fonte;

  $("musicVolume").value = profile.volume;
  $("musicVolumeValue").textContent = `${profile.volume}%`;
  $("musicPlayerWidth").value = profile.musicPlayerWidth;
  $("musicPlayerHeight").value = profile.musicPlayerHeight;
  $("musicPlayerWidthValue").textContent = `${profile.musicPlayerWidth} px`;
  $("musicPlayerHeightValue").textContent = `${profile.musicPlayerHeight} px`;
  $("gradientIntensity").value = profile.gradientIntensity ?? 55;
  $("cardRadius").value = profile.cardRadius ?? 18;

  fillColorInputs();
  renderBadgeLibrary();
  renderSavedThemes();
  applyDesignSettings();

  renderStatsEditor();
  renderDetailsEditor();
  ["avatar", "banner", "cardBackground", "background", "musicBarBackground"].forEach(applyCropPreviewStyle);
  applyDividerSettings();

  updateThemeButtons();
}

function readIdentityEditor() {
  profile.nome = $("editName").value.trim();
  profile.usuario = normalizeUsername($("editUsername").value);
  profile.bio = $("editBio").value.trim();
  profile.cargo = $("editRole").value;
  profile.verificado = $("editVerified").checked;
  profile.verificadoCor = $("verifiedColor").value;

  profile.insignias = [...new Set($("editBadges").value
    .split(",")
    .map(normalizeBadge)
    .filter((item) => item && !isBlockedBadge(item) && !/^dono$/i.test(item)))];

  profile.rodape = $("editFooter").value.trim();
  profile.bannerHeadingVisible = $("bannerHeadingVisible").checked;
  profile.bannerTitulo = $("editBannerTitle").value.trim();
  profile.bannerSubtitulo = $("editBannerSubtitle").value.trim();
  profile.statsTitle = $("editStatsTitle").value.trim() || "Em evidência";
  profile.statsSubtitle = $("editStatsSubtitle").value.trim();
  profile.detailsTitle = $("editDetailsTitle").value.trim() || "Um pouco sobre mim";
  profile.detailsSubtitle = $("editDetailsSubtitle").value.trim();
}

function openEditor() {
  fillEditor();

  $("editorModal").classList.add("open");
  $("editorModal").setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeEditor() {
  $("editorModal").classList.remove("open");
  $("editorModal").setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

function switchTab(name) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === name);
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `tab-${name}`);
  });
}

function saveChanges() {
  readIdentityEditor();

  profile.animarMidia = $("animateMedia").checked;
  profile.avatarPausado = $("pauseAvatar").checked;
  profile.bannerPausado = $("pauseBanner").checked;
  profile.bannerHeight = Number($("bannerHeight").value);
  applyBannerSettings();
  profile.fundoPausado = $("pauseBackground").checked;
  profile.cardBackgroundPausado = $("pauseCardBackground").checked;
  profile.bannerOpacity = Number($("bannerOpacity").value);
  profile.cardBackgroundOpacity = Number($("cardBackgroundOpacity").value);
  profile.backgroundOpacity = Number($("backgroundOpacity").value);
  profile.musicBarBackgroundOpacity = Number($("musicBarBackgroundOpacity").value);
  ["avatar", "banner", "cardBackground", "background"].forEach((key) => {
    profile[`${key}Crop`] = {
      x: Number($(`${key}CropX`).value),
      y: Number($(`${key}CropY`).value),
      zoom: Number($(`${key}CropZoom`).value)
    };
  });
  profile.dividerStyle = $("dividerStyle").value;
  profile.dividerCustomColorEnabled = $("dividerCustomColorEnabled").checked;
  profile.dividerColor = $("dividerColor").value;
  applyCropSettings();
  applyDividerSettings();
  applyMediaOpacitySettings();
  profile.moldura = $("avatarFrameSelect").value;
  profile.raridadeMoldura = $("frameRarity").value;
  profile.molduraCorPersonalizada = $("customFrameColorEnabled").checked;
  profile.molduraCor = $("customFrameColor").value;
  profile.efeitosPerfil = $("profileEffects").checked;
  profile.fonte = $("fontFamily").value;
  profile.volume = Number($("musicVolume").value);
  profile.gradientIntensity = Number($("gradientIntensity").value);
  profile.cardRadius = Number($("cardRadius").value);

  profile.estatisticas = profile.estatisticas.filter(
    (item) => item.label.trim()
  );

  profile.detalhes = profile.detalhes.filter(
    (item) => item.label.trim()
  );

  $("profileAudio").volume = profile.volume / 100;
  $("profileVideo").volume = profile.volume / 100;

  setMediaAnimation(profile.animarMidia);

  saveProfile();
  renderProfile();
  closeEditor();

  showToast("Alterações salvas com sucesso.");
}

async function resetProfile() {
  const confirmed = confirm(
    "Tem certeza que deseja restaurar o perfil padrão? Suas personalizações e mídias serão removidas."
  );

  if (!confirmed) return;

  profile = structuredClone(DEFAULT_PROFILE);

  try {
    await Promise.all([
      deleteMedia("avatar"),
      deleteMedia("banner"),
      deleteMedia("background"),
      deleteMedia("cardBackground"),
      deleteMedia("music"),
      deleteMedia("musicCover"),
      deleteMedia("musicBarBackground")
    ]);
  } catch (error) {
    console.error("Erro ao remover mídias:", error);
  }

  revokeURL(avatarURL);
  revokeURL(bannerURL);
  revokeURL(backgroundURL);
  revokeURL(cardBackgroundURL);
  revokeURL(musicURL);
  revokeURL(musicCoverURL);
  revokeURL(musicBarBackgroundURL);

  avatarURL = null;
  bannerURL = null;
  backgroundURL = null;
  cardBackgroundURL = null;
  musicURL = null;
  musicCoverURL = null;
  musicBarBackgroundURL = null;
  currentMusicFile = null;
  currentMusicCoverFile = null;
  musicMediaType = "audio";

  clearAvatar();
  clearBanner();
  clearBackground();
  clearCardBackground();

  $("profileAudio").pause();
  $("profileAudio").removeAttribute("src");
  $("profileVideo").pause();
  $("profileVideo").removeAttribute("src");
  $("profileVideo").load();
  $("musicCoverImage").src = "";
  $("musicCoverImage").hidden = true;
  $("musicCoverFallback").hidden = false;
  clearMusicBarBackground();
  updateCropPreview("musicBarBackground", null);
  $("profileMusic").classList.remove("is-floating", "is-docked");
  $("profileMusic").style.width = "";
  $("profileMusic").style.height = "";
  $("musicToggle").hidden = false;
  $("profileMusic").hidden = true;

  saveProfile();
  renderProfile();
  fillEditor();

  showToast("Perfil restaurado.");
}

async function uploadAvatar(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const validation = validateVisualMedia(file);
  if (!validation.valid) {
    showToast(validation.message);
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("avatar", file);
    displayAvatar(file);
    showToast("Avatar atualizado.");
  } catch (error) {
    console.error("Falha ao salvar avatar:", error);
    showToast("Não foi possível salvar avatar. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function removeAvatar() {
  try {
    await deleteMedia("avatar");
  } catch (error) {
    console.error("Erro ao remover avatar:", error);
    showToast("Não foi possível remover o avatar.");
    return;
  }

  revokeURL(avatarURL);
  avatarURL = null;

  clearAvatar();

  showToast("Avatar removido.");
}

async function uploadBanner(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const validation = validateVisualMedia(file);
  if (!validation.valid) {
    showToast(validation.message);
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("banner", file);
    displayBanner(file);
    showToast("Banner atualizado.");
  } catch (error) {
    console.error("Falha ao salvar banner:", error);
    showToast("Não foi possível salvar banner. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function removeBanner() {
  try {
    await deleteMedia("banner");
  } catch (error) {
    console.error("Erro ao remover banner:", error);
    showToast("Não foi possível remover o banner.");
    return;
  }

  revokeURL(bannerURL);
  bannerURL = null;

  clearBanner();

  showToast("Banner removido.");
}

async function uploadBackground(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const validation = validateVisualMedia(file);
  if (!validation.valid) {
    showToast(validation.message);
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("background", file);
    displayBackground(file);
    showToast("Fundo da página atualizado.");
  } catch (error) {
    console.error("Falha ao salvar fundo da página:", error);
    showToast("Não foi possível salvar fundo da página. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function removeBackground() {
  try {
    await deleteMedia("background");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível remover o fundo.");
    return;
  }
  clearBackground();
  revokeURL(backgroundURL);
  backgroundURL = null;
  showToast("Fundo animado removido.");
}

async function uploadCardBackground(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const validation = validateVisualMedia(file);
  if (!validation.valid) {
    showToast(validation.message);
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("cardBackground", file);
    displayCardBackground(file);
    showToast("Fundo do cartão atualizado.");
  } catch (error) {
    console.error("Falha ao salvar fundo do cartão:", error);
    showToast("Não foi possível salvar fundo do cartão. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function removeCardBackground() {
  try {
    await deleteMedia("cardBackground");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível remover o fundo do cartão.");
    return;
  }
  clearCardBackground();
  revokeURL(cardBackgroundURL);
  cardBackgroundURL = null;
  showToast("Fundo do cartão removido.");
}

async function uploadMusic(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const audioExtension = /\.(mp3|wav|ogg|m4a|aac|flac|opus)$/i.test(file.name);
  if (!file.type.startsWith("audio/") && !audioExtension) {
    showToast("Escolha um arquivo de áudio compatível.");
    event.target.value = "";
    return;
  }
  if (file.size > 150 * 1024 * 1024) {
    showToast("O áudio ultrapassa o limite de 150 MB.");
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("music", file);
    displayMusic(file);
    $("musicLocalStatus").textContent = "Áudio salvo somente neste navegador. A reprodução está configurada em loop.";
    showToast("Música adicionada ao perfil.");
  } catch (error) {
    console.error("Falha ao salvar música:", error);
    showToast("Não foi possível salvar. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function uploadMusicVideo(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const videoExtension = /\.(mp4|webm|mov|ogv|m4v)$/i.test(file.name);
  if (!file.type.startsWith("video/") && !videoExtension) {
    showToast("Escolha um vídeo MP4, WebM, MOV ou OGG compatível.");
    event.target.value = "";
    return;
  }
  if (file.size > 250 * 1024 * 1024) {
    showToast("O vídeo ultrapassa o limite de 250 MB.");
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("music", file);
    displayMusic(file);
    $("musicLocalStatus").textContent = "Vídeo salvo somente neste navegador. O player reproduz o vídeo e o áudio em loop.";
    showToast("Vídeo adicionado ao player do perfil.");
  } catch (error) {
    console.error("Falha ao salvar vídeo:", error);
    showToast("Não foi possível salvar. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function uploadMusicBarBackground(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const validation = validateVisualMedia(file);
  if (!validation.valid) {
    showToast(validation.message);
    event.target.value = "";
    return;
  }
  const activeMusic = getActiveMusicElement();
  const wasPlaying = Boolean(activeMusic && !activeMusic.paused);
  const activeMusicSource = activeMusic?.currentSrc || activeMusic?.src || "";
  const activeMusicTime = activeMusic?.currentTime || 0;
  try {
    await saveMedia("musicBarBackground", file);
    displayMusicBarBackground(file);
    // Defensive recovery for browsers that pause media while a file picker is open.
    if (activeMusic && currentMusicFile && activeMusicSource && (activeMusic.currentSrc || activeMusic.src) === activeMusicSource) {
      if (Number.isFinite(activeMusicTime) && activeMusic.duration && activeMusicTime < activeMusic.duration) activeMusic.currentTime = activeMusicTime;
      if (wasPlaying && activeMusic.paused) activeMusic.play().catch(() => {});
    }
    showToast("Fundo da faixa atualizado sem alterar a música.");
  } catch (error) {
    console.error("Falha ao salvar o fundo da faixa:", error);
    showToast("Não foi possível salvar o fundo. Verifique o espaço disponível no navegador.");
  } finally {
    event.target.value = "";
  }
}

async function removeMusicBarBackground() {
  try {
    await deleteMedia("musicBarBackground");
    revokeURL(musicBarBackgroundURL);
    musicBarBackgroundURL = null;
    clearMusicBarBackground();
    updateCropPreview("musicBarBackground", null);
    resetCrop("musicBarBackground");
    const name = $("musicBarBackgroundName");
    if (name) name.textContent = "Nenhum fundo personalizado selecionado.";
    showToast("Fundo da faixa removido.");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível remover o fundo da faixa.");
  }
}

async function uploadMusicCover(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Escolha uma imagem para a capa.");
    event.target.value = "";
    return;
  }
  if (file.size > 15 * 1024 * 1024) {
    showToast("A capa ultrapassa o limite de 15 MB.");
    event.target.value = "";
    return;
  }

  try {
    await saveMedia("musicCover", file);
    displayMusicCover(file);
    showToast("Capa adicionada.");
  } catch (error) {
    console.error("Falha ao salvar capa:", error);
    showToast("Não foi possível salvar a capa neste navegador.");
  } finally {
    event.target.value = "";
  }
}


function downloadOriginalMusic() {
  if (!currentMusicFile) { showToast("O download está disponível para arquivos enviados."); return; }
  const url = URL.createObjectURL(currentMusicFile);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = currentMusicFile.name || "musica";
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataURLToBlob(dataURL) {
  const [metadata, content] = dataURL.split(",");
  const mime = metadata.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";
  const binary = atob(content);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new Blob([bytes], { type: mime });
}

async function exportProfileBackup() {
  try {
    const media = {};
    for (const key of ["avatar", "banner", "background", "cardBackground", "music", "musicCover", "musicBarBackground"]) {
      const file = await getMedia(key);
      media[key] = file ? await blobToDataURL(file) : null;
    }

    const backup = {
      app: "Kl Personal Space",
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      media
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hattz-profile-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Backup exportado com sucesso.");
  } catch (error) {
    console.error("Falha ao exportar backup:", error);
    showToast("Não foi possível exportar o backup.");
  }
}

async function importProfileBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const backup = JSON.parse(await file.text());
    if (!backup || backup.app !== "Kl Personal Space" || !backup.profile || typeof backup.profile !== "object") {
      throw new Error("Arquivo de backup inválido.");
    }

    const confirmed = confirm("Importar este backup substituirá o perfil e as mídias atuais. Deseja continuar?");
    if (!confirmed) return;

    const imported = backup.profile;
    profile = {
      ...structuredClone(DEFAULT_PROFILE),
      ...imported,
      cores: { ...DEFAULT_PROFILE.cores, ...(imported.cores || {}) },
      insignias: Array.isArray(imported.insignias) ? imported.insignias : [],
      estatisticas: Array.isArray(imported.estatisticas) ? imported.estatisticas : structuredClone(DEFAULT_PROFILE.estatisticas),
      detalhes: Array.isArray(imported.detalhes) ? imported.detalhes : structuredClone(DEFAULT_PROFILE.detalhes)
    };

    if (/\b(owner|dono|admin|administrator|dev|developer|staff|moderator)\b/i.test(String(profile.cargo || ""))) profile.cargo = "";
    profile.insignias = [...new Set(profile.insignias.map(normalizeBadge).filter((badge) => badge && !isBlockedBadge(badge)))];

    for (const key of ["avatar", "banner", "background", "cardBackground", "music", "musicCover", "musicBarBackground"]) {
      const value = backup.media?.[key];
      if (typeof value === "string" && value.startsWith("data:")) {
        await saveMedia(key, dataURLToBlob(value));
      } else {
        await deleteMedia(key);
      }
    }

    revokeURL(avatarURL);
    revokeURL(bannerURL);
    revokeURL(backgroundURL);
    revokeURL(cardBackgroundURL);
    revokeURL(musicURL);
    revokeURL(musicCoverURL);
    revokeURL(musicBarBackgroundURL);
    avatarURL = bannerURL = backgroundURL = cardBackgroundURL = musicURL = musicCoverURL = musicBarBackgroundURL = null;
    currentMusicFile = null;
    currentMusicCoverFile = null;
    musicMediaType = "audio";
    $("profileVideo").pause();
    $("profileVideo").removeAttribute("src");
    $("profileVideo").load();
    saveProfile();
    await restoreMedia();
    $("profileAudio").volume = (profile.volume || 0) / 100;
    renderProfile();
    fillEditor();
    setMediaAnimation(profile.animarMidia !== false);
    showToast("Backup importado com sucesso.");
  } catch (error) {
    console.error("Falha ao importar backup:", error);
    showToast("Backup inválido ou incompatível.");
  } finally {
    event.target.value = "";
  }
}

function setupEvents() {
  $("openOtherProfile").addEventListener("click", openOtherProfile);
  $("toggleCaptureMode").addEventListener("click", () => setCaptureMode(true));
  $("exitCaptureMode").addEventListener("click", () => setCaptureMode(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("capture-mode")) {
      setCaptureMode(false);
      return;
    }
    if (event.altKey && event.shiftKey && event.key.toLowerCase() === "p") {
      event.preventDefault();
      setCaptureMode(!document.body.classList.contains("capture-mode"));
    }
  });
  $("openEditor").addEventListener("click", openEditor);
  $("closeEditor").addEventListener("click", closeEditor);

  $("editorModal").addEventListener("click", (event) => {
    if (event.target === $("editorModal")) {
      closeEditor();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      $("editorModal").classList.contains("open")
    ) {
      closeEditor();
    }
  });

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      switchTab(button.dataset.tab);
    });
  });

  $("verifiedColor").addEventListener("input", (event) => {
    profile.verificadoCor = event.target.value;
    renderIdentity();
    saveProfile();
  });

  $("saveProfile").addEventListener("click", saveChanges);
  $("resetProfile").addEventListener("click", resetProfile);
  $("resetAppearance").addEventListener("click", () => {
    if (confirm("Restaurar cores, transparências, enquadramentos e demais ajustes visuais? Seus arquivos e textos serão preservados.")) resetAppearance();
  });
  $("resetThemeColors").addEventListener("click", resetThemeColors);
  document.querySelectorAll("[data-reset-color]").forEach((button) => {
    button.addEventListener("click", () => resetThemeColor(button.dataset.resetColor));
  });
  $("resetFont").addEventListener("click", resetFont);
  $("resetVerifiedColor").addEventListener("click", resetVerifiedColor);
  $("resetFrameAppearance").addEventListener("click", resetFrameAppearance);
  $("resetDividerAppearance").addEventListener("click", resetDividerAppearance);
  $("resetMusicPlayerPlacement").addEventListener("click", resetMusicPlayerPlacement);
  $("musicPlayerWidth").addEventListener("input", (event) => {
    profile.musicPlayerWidth = Number(event.target.value);
    $("musicPlayerWidthValue").textContent = `${profile.musicPlayerWidth} px`;
    applyMusicPlayerSize();
    saveProfile();
  });
  $("musicPlayerHeight").addEventListener("input", (event) => {
    profile.musicPlayerHeight = Number(event.target.value);
    $("musicPlayerHeightValue").textContent = `${profile.musicPlayerHeight} px`;
    applyMusicPlayerSize();
    saveProfile();
  });
  document.querySelectorAll("[data-reset-setting]").forEach((button) => {
    button.addEventListener("click", () => resetProfileSetting(button.dataset.resetSetting));
  });
  $("exportProfile").addEventListener("click", exportProfileBackup);
  $("importProfile").addEventListener("click", () => $("importProfileFile").click());
  $("importProfileFile").addEventListener("change", importProfileBackup);

  $("statsEditor").addEventListener("input", handleStatsEditor);
  $("statsEditor").addEventListener("click", handleStatsEditor);

  $("detailsEditor").addEventListener("input", handleDetailsEditor);
  $("detailsEditor").addEventListener("click", handleDetailsEditor);

  $("addStat").addEventListener("click", addStat);
  $("addDetail").addEventListener("click", addDetail);

  $("avatarUpload").addEventListener("change", uploadAvatar);
  $("bannerUpload").addEventListener("change", uploadBanner);
  $("backgroundUpload").addEventListener("change", uploadBackground);
  $("cardBackgroundUpload").addEventListener("change", uploadCardBackground);
  $("musicUpload").addEventListener("change", uploadMusic);
  $("musicVideoUpload").addEventListener("change", uploadMusicVideo);
  $("musicBarBackgroundUpload").addEventListener("change", uploadMusicBarBackground);
  $("removeMusicBarBackground").addEventListener("click", removeMusicBarBackground);

  $("removeAvatar").addEventListener("click", removeAvatar);
  $("removeBanner").addEventListener("click", removeBanner);
  $("removeBackground").addEventListener("click", removeBackground);
  $("removeCardBackground").addEventListener("click", removeCardBackground);
  $("removeMusic").addEventListener("click", removeMusic);

  $("animateMedia").addEventListener("change", (event) => {
    setMediaAnimation(event.target.checked);
  });

  $("pauseAvatar").addEventListener("change", (event) => {
    profile.avatarPausado = event.target.checked;
    applyMediaPlayback();
  });

  $("bannerHeight").addEventListener("input", (event) => {
    profile.bannerHeight = Number(event.target.value);
    updateBannerRangeLabels();
    applyBannerSettings();
  });

  window.addEventListener("resize", applyBannerSettings, { passive: true });

  $("pauseBanner").addEventListener("change", (event) => {
    profile.bannerPausado = event.target.checked;
    applyMediaPlayback();
  });

  $("pauseBackground").addEventListener("change", (event) => {
    profile.fundoPausado = event.target.checked;
    applyMediaPlayback();
  });

  $("pauseCardBackground").addEventListener("change", (event) => {
    profile.cardBackgroundPausado = event.target.checked;
    applyMediaPlayback();
  });

  ["bannerOpacity", "cardBackgroundOpacity", "backgroundOpacity", "musicBarBackgroundOpacity"].forEach((key) => {
    $(key).addEventListener("input", (event) => updateMediaOpacity(key, event.target.value));
  });

  ["avatar", "banner", "cardBackground", "background", "musicBarBackground"].forEach((key) => {
    ["X", "Y", "Zoom"].forEach((axis) => {
      $(`${key}Crop${axis}`).addEventListener("input", (event) => {
        const property = axis.toLowerCase();
        setCropValue(key, property, event.target.value);
      });
    });
    document.querySelector(`[data-crop-reset="${key}"]`).addEventListener("click", () => resetCrop(key));
  });

  $("dividerStyle").addEventListener("change", (event) => {
    profile.dividerStyle = event.target.value;
    applyDividerSettings();
  });
  $("dividerCustomColorEnabled").addEventListener("change", (event) => {
    profile.dividerCustomColorEnabled = event.target.checked;
    $("dividerColor").disabled = !event.target.checked;
    applyDividerSettings();
  });
  $("dividerColor").addEventListener("input", (event) => {
    profile.dividerColor = event.target.value;
    applyDividerSettings();
  });

  $("avatarFrameSelect").addEventListener("change", (event) => {
    profile.moldura = event.target.value;
    renderFrame();
  });

  $("frameRarity").addEventListener("change", (event) => {
    profile.raridadeMoldura = event.target.value;
    renderFrame();
  });

  $("customFrameColorEnabled").addEventListener("change", (event) => {
    profile.molduraCorPersonalizada = event.target.checked;
    $("customFrameColor").disabled = !event.target.checked;
    renderFrame();
  });

  $("customFrameColor").addEventListener("input", (event) => {
    profile.molduraCor = event.target.value;
    renderFrame();
  });

  $("profileEffects").addEventListener("change", (event) => {
    profile.efeitosPerfil = event.target.checked;
    document.querySelector(".profile-card")?.classList.toggle("effects-enabled", profile.efeitosPerfil);
  });

  $("musicToggle").addEventListener("click", toggleMusic);
  $("previewMusic").addEventListener("click", toggleMusic);
  $("downloadMusic").addEventListener("click", downloadOriginalMusic);
  $("dockMusic").addEventListener("click", () => {
    setMusicPlayerPosition(!$("profileMusic").classList.contains("is-docked"));
  });

  [$("profileAudio"), $("profileVideo")].forEach((media) => {
    ["play", "pause", "ended", "loadedmetadata", "durationchange", "timeupdate"].forEach((eventName) => {
      media.addEventListener(eventName, () => {
        updateMusicButtons();
        updateMusicTimeline();
      });
    });
  });
  $("profileVideo").addEventListener("error", () => {
    const code = $("profileVideo").error?.code;
    const detail = code === 3 || code === 4
      ? "O codec não é compatível. Converta o vídeo para MP4 H.264."
      : "O navegador não conseguiu abrir este vídeo.";
    showToast(detail);
  });

  $("musicVolume").addEventListener("input", (event) => {
    const value = Number(event.target.value);

    $("musicVolumeValue").textContent = `${value}%`;
    profile.volume = value;
    $("profileAudio").volume = value / 100;
    $("profileVideo").volume = value / 100;
    saveProfile();
  });

  $("saveTheme").addEventListener("click", saveCurrentTheme);
  $("applySavedTheme").addEventListener("click", applySavedTheme);
  $("deleteSavedTheme").addEventListener("click", deleteSavedTheme);

  $("badgeLibrary").addEventListener("click", toggleBadgePreset);
  $("editBadges").addEventListener("input", renderBadgeLibrary);

  $("gradientIntensity").addEventListener("input", (event) => {
    profile.gradientIntensity = Number(event.target.value);
    applyDesignSettings();
  });

  $("cardRadius").addEventListener("input", (event) => {
    profile.cardRadius = Number(event.target.value);
    applyDesignSettings();
  });

  document.querySelectorAll(".theme-option").forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.theme);
    });
  });

  $("applyCustomTheme").addEventListener("click", () => {
    profile.tema = "custom";
    profile.gradientIntensity = Number($("gradientIntensity").value);
    profile.cardRadius = Number($("cardRadius").value);
    applyColors(readColorInputs());
    updateThemeButtons();

    showToast("Cores personalizadas aplicadas.");
  });

  $("fontFamily").addEventListener("change", (event) => {
    profile.fonte = event.target.value;

    document.documentElement.style.setProperty(
      "--font",
      `"${profile.fonte}", sans-serif`
    );
  });
}

async function init() {
  loadProfile();

  try {
    await openDatabase();
    await restoreMedia();
  } catch (error) {
    console.error("Não foi possível iniciar o armazenamento:", error);
  }

  $("profileAudio").volume = profile.volume / 100;
  $("profileVideo").volume = profile.volume / 100;
  $("musicVolume").value = profile.volume;
  $("musicVolumeValue").textContent = `${profile.volume}%`;

  setupEvents();
  setupMusicPlayerResize();
  setupMusicPlayerDrag();
  applyMediaOpacitySettings();
  updateProfileSwitcher();
  applyMusicPlayerSize();
  applyMusicPlayerPosition();
  document.title = ACTIVE_PROFILE_ID === "perfil-1" ? "Hättz — Perfil 1" : "Hättz — Perfil 2";
  renderProfile();
  fillEditor();

  setMediaAnimation(profile.animarMidia);
}

document.addEventListener("visibilitychange", applyMediaPlayback);
window.addEventListener("scroll", queueVisualVideoSync, { passive: true });
window.addEventListener("resize", queueVisualVideoSync, { passive: true });
document.addEventListener("pagehide", () => {
  ["avatarVideo", "bannerVideo", "backgroundVideo", "cardBackgroundVideo", "musicBarBackgroundVideo", "profileAudio", "profileVideo"].forEach((id) => $(id)?.pause());
});
document.addEventListener("pageshow", applyMediaPlayback);
document.addEventListener("DOMContentLoaded", init);
