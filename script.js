/* Untuk Anindita — buku 3D (vanilla JS) */

/* Ganti nama file foto/caption di sini */
const leaves = [
  {
    front: {
      kind: "cover",
      label: "A little story",
      name: "Anindita",
      note: "with all my heart",
      image: "foto1.jpg",
    },
    back: { kind: "photo", image: "foto2.jpg", number: "01", caption: "happy birthday sayangg" },
  },
  {
    front: { kind: "photo", image: "foto3.jpg", number: "02", caption: "makasi udah hadir di dunia ini" },
    back: { kind: "photo", image: "foto4.jpg", number: "03", caption: "senang bisa jatuh cinta sama manusia seindah kamu" },
  },
  {
    front: { kind: "photo", image: "foto5.jpg", number: "04", caption: "thanks for all" },
    back: {
      kind: "cover",
      label: "The end",
      name: "Anindita",
      note: "until the last page",
      image: "foto1.jpg",
    },
  },
];

/* Kata-kata ucapan tepat di atas buku, satu per lembar */
const greetings = [
  "happy birthday sayangg",
  "makasi udah hadir di dunia ini",
  "senang bisa jatuh cinta sama manusia seindah kamu",
  "thanks for all",
  "Selalu kamu, sampai halaman terakhir",
];

const total = leaves.length;
let turned = 0;

const el = (id) => document.getElementById(id);
const intro = el("intro"),
  bookSection = el("book"),
  ending = el("ending"),
  bookEl = el("bookEl"),
  caseLeft = el("caseLeft"),
  stage = el("stage"),
  floor = el("floor"),
  hint = el("hint"),
  greeting = el("greeting"),
  music = el("music");

let tilt = { x: 0, y: 0 };

/* ---------- bangun lembar ---------- */
function faceHTML(face, side) {
  if (face.kind === "photo") {
    return `
      <div class="leaf-paper side-${side}">
        <div class="leaf-photo">
          <img src="${face.image}" alt="" draggable="false" />
          <span class="leaf-photo-glaze"></span>
        </div>
        <p class="leaf-caption">${face.caption}</p>
        <span class="leaf-number">${face.number}</span>
        <span class="leaf-grain"></span>
        <span class="leaf-gutter"></span>
      </div>`;
  }
  return `
    <div class="leaf-cover side-${side}">
      <img class="leaf-cover-photo" src="${face.image}" alt="" draggable="false" />
      <span class="leaf-cover-tint"></span>
      <span class="leaf-cover-grain"></span>
      <span class="leaf-cover-sheen"></span>
      <span class="leaf-cover-frame"></span>
      <div class="leaf-cover-text">
        <span class="leaf-cover-label">${face.label}</span>
        <span class="leaf-cover-rule"><i></i>&#9825;<i></i></span>
        <span class="leaf-cover-name">${face.name}</span>
        <span class="leaf-cover-note">${face.note}</span>
      </div>
      <span class="leaf-cover-gutter"></span>
    </div>`;
}

const leafEls = leaves.map((leaf, i) => {
  const node = document.createElement("div");
  node.className = "leaf";
  node.innerHTML = `
    <div class="leaf-face leaf-front">
      ${faceHTML(leaf.front, "right")}
      <span class="leaf-shade leaf-shade-front"></span>
    </div>
    <div class="leaf-face leaf-back">
      ${faceHTML(leaf.back, "left")}
      <span class="leaf-shade leaf-shade-back"></span>
    </div>`;
  node.addEventListener("click", () => (i < turned ? prev() : next()));
  bookEl.appendChild(node);
  return node;
});

/* ---------- render ---------- */
function render() {
  const opened = turned > 0;

  bookEl.classList.toggle("is-open", opened);
  bookEl.style.transform = `translateX(${opened ? "0%" : "-25%"}) rotateX(${8 + tilt.x}deg) rotateY(${(opened ? 0 : -20) + tilt.y}deg)`;
  caseLeft.classList.toggle("is-visible", opened);
  floor.classList.toggle("is-open", opened);

  hint.textContent =
    turned === 0
      ? "sentuh buku untuk membuka"
      : turned >= total
        ? "sentuh untuk selesai"
        : `halaman ${turned} dari ${total - 1}`;

  const text = greetings[Math.min(turned, greetings.length - 1)];
  if (greeting.textContent !== text) {
    greeting.textContent = text;
    greeting.style.animation = "none";
    void greeting.offsetWidth;
    greeting.style.animation = "";
  }

  leafEls.forEach((node, i) => {
    const isTurned = i < turned;
    const topLeft = i === turned - 1;
    const topRight = i === turned;
    node.classList.toggle("is-turned", isTurned);
    node.style.zIndex = isTurned ? 20 + i : 60 - i;
    node.style.transform = `translateZ(${isTurned ? -(2 + (total - i)) : 2 + (total - i)}px) rotateY(${isTurned ? -180 : 0}deg)`;
    node.querySelector(".leaf-front").style.visibility =
      !isTurned && (topRight || i === total - 1) ? "visible" : "hidden";
    node.querySelector(".leaf-back").style.visibility =
      isTurned && topLeft ? "visible" : "hidden";
  });
}

function next() {
  if (turned >= total) return show("ending");
  turned += 1;
  render();
}
function prev() {
  turned = Math.max(0, turned - 1);
  render();
}

/* ---------- stage ---------- */
function show(which) {
  intro.hidden = which !== "intro";
  bookSection.hidden = which !== "book";
  ending.hidden = which !== "ending";
  if (which !== "intro") music.play().catch(() => {});
  if (which === "book") render();
}

el("btn-open").addEventListener("click", () => show("book"));
el("btn-again").addEventListener("click", () => {
  turned = 0;
  show("book");
});
el("btn-prev").addEventListener("click", prev);
el("btn-next").addEventListener("click", next);

stage.addEventListener("pointermove", (e) => {
  const r = stage.getBoundingClientRect();
  tilt = {
    x: -((e.clientY - r.top) / r.height - 0.5) * 7,
    y: ((e.clientX - r.left) / r.width - 0.5) * 12,
  };
  render();
});
stage.addEventListener("pointerleave", () => {
  tilt = { x: 0, y: 0 };
  render();
});

window.addEventListener("keydown", (e) => {
  if (bookSection.hidden) return;
  if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") next();
  if (e.key === "ArrowLeft") prev();
});

show("intro");
render();
    
