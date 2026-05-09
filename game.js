const startButton = document.querySelector("#startButton");
const startScreen = document.querySelector("#startScreen");
const gameLayer = document.querySelector("#gameLayer");
const statusText = document.querySelector("#statusText");
const resultText = document.querySelector("#resultText");
const stage = document.querySelector("#stage");
const bgm = document.querySelector("#bgm");
const hotspots = [...document.querySelectorAll(".hotspot")];
const stepDots = [...document.querySelectorAll(".step-dot")];

const answer = ["analyze", "skill", "guard"];
let progress = 0;
let solved = false;

document.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();
  },
  { passive: false }
);

startButton.addEventListener("click", async () => {
  startScreen.classList.add("is-hidden");
  gameLayer.classList.remove("is-hidden");
  statusText.textContent = "IRIS CORE";
  requestFullscreenMode();

  try {
    bgm.volume = 0.72;
    await bgm.play();
  } catch {
    statusText.textContent = "IRIS CORE";
  }
});

hotspots.forEach((button) => {
  button.addEventListener("click", () => {
    if (solved) {
      return;
    }

    const action = button.dataset.action;
    flash(button);

    if (action !== answer[progress]) {
      resetPuzzle();
      return;
    }

    progress += 1;
    updateSteps();

    if (progress === answer.length) {
      unlockCore();
    } else {
      statusText.textContent = `${progress}/3`;
    }
  });
});

function flash(button) {
  button.classList.add("is-lit");
  window.setTimeout(() => button.classList.remove("is-lit"), 180);
}

function updateSteps() {
  stepDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index < progress);
  });
}

function resetPuzzle() {
  progress = 0;
  updateSteps();
  statusText.textContent = "LOCKED";
  stage.classList.remove("is-wrong");
  void stage.offsetWidth;
  stage.classList.add("is-wrong");
}

function unlockCore() {
  solved = true;
  statusText.textContent = "UNLOCKED";
  resultText.classList.remove("is-hidden");
  hotspots.forEach((button) => {
    button.disabled = true;
  });
}

async function requestFullscreenMode() {
  const root = document.documentElement;

  if (!document.fullscreenElement && root.requestFullscreen) {
    try {
      await root.requestFullscreen();
    } catch {
      // Some mobile browsers only allow installed standalone display.
    }
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}
