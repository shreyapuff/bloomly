const form = document.getElementById("mood-form");
const input = document.getElementById("mood-input");
const note = document.getElementById("note-input");
const feedback = document.getElementById("feedback");
const promptText = document.getElementById("prompt");
const mascot = document.getElementById("mascot");
const streakBadge = document.getElementById("streak");
const themeToggle = document.getElementById("theme-toggle");
const exportBtn = document.getElementById("export");

const drawer = document.getElementById("drawer");
const drawerList = document.getElementById("drawer-list");
const viewAllBtn = document.getElementById("view-all");
const closeDrawerBtn = document.getElementById("close-drawer");

const prompts = [
  "What’s something small you’re grateful for today?",
  "How can you be kind to yourself right now?",
  "What would help you feel more balanced?",
  "What emotion needs your attention?",
  "What's one soft joy from your day?"
];

const affirmations = [
  "🌸 You're doing better than you think.",
  "🌿 Growth is quiet but powerful.",
  "☀️ It’s okay to bloom slowly.",
  "💧 Even rain helps the garden grow.",
  "🕊 You showed up. That matters."
];

// 🌱 Mood Storage
function getMoods() {
  return JSON.parse(localStorage.getItem("bloomly-moods") || "[]");
}

function saveMood(mood, note) {
  const moods = getMoods();
  const today = new Date().toLocaleDateString();
  moods.unshift({ mood, note, date: today });
  localStorage.setItem("bloomly-moods", JSON.stringify(moods.slice(0, 50)));
}

function deleteMood(index) {
  const moods = getMoods();
  moods.splice(index, 1);
  localStorage.setItem("bloomly-moods", JSON.stringify(moods));
}

// 🌸 Display main streak + feedback
function displayMain() {
  const moods = getMoods();
  const uniqueDays = [...new Set(moods.map(m => m.date))];
  feedback.textContent = uniqueDays.length > 1
    ? affirmations[Math.floor(Math.random() * affirmations.length)]
    : "";
  streakBadge.textContent =
    uniqueDays.length >= 5
      ? `✨ ${uniqueDays.length}-day streak! You’re blooming beautifully!`
      : "";
}

// 📖 Drawer list
function displayDrawer() {
  const moods = getMoods();
  drawerList.innerHTML = "";

  moods.forEach((entry, index) => {
    const li = document.createElement("li");

    const moodText = `${entry.date} — ${entry.mood}${
      entry.note ? " • " + entry.note : ""
    }`;

    const span = document.createElement("span");
    span.textContent = moodText;

    const del = document.createElement("button");
    del.textContent = "🗑";
    del.className = "delete-btn";
    del.addEventListener("click", () => {
      deleteMood(index);
      displayMain();
      displayDrawer();
    });

    li.appendChild(span);
    li.appendChild(del);
    drawerList.appendChild(li);
  });
}

// 🌱 Mood Submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mood = input.value.trim();
  const moodNote = note.value.trim();
  if (!mood) return;

  saveMood(mood, moodNote);
  input.value = "";
  note.value = "";

  mascot.classList.add("bloom");
  setTimeout(() => mascot.classList.remove("bloom"), 800);

  displayMain();
  if (drawer.classList.contains("open")) {
    displayDrawer();
  }

  updatePrompt(); // ✅ Prompt only updates when mood is planted
});

// 🪴 Prompt updater (no timer)
function updatePrompt() {
  const random = prompts[Math.floor(Math.random() * prompts.length)];
  promptText.textContent = `🪴 Prompt: ${random}`;
}
updatePrompt(); // Show first prompt on load

// 🌙 Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 📄 Export moods
exportBtn.addEventListener("click", () => {
  const moods = getMoods();
  let text = "🌸 Bloomly Mood Journal\n\n";
  moods.forEach(entry => {
    text += `${entry.date}: ${entry.mood}${entry.note ? " — " + entry.note : ""}\n`;
  });

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "bloomly-checkins.txt";
  link.click();
});

// 📖 Drawer toggle
viewAllBtn.addEventListener("click", () => {
  drawer.classList.add("open");
  displayDrawer();
});

closeDrawerBtn.addEventListener("click", () => {
  drawer.classList.remove("open");
});

// 🌿 Initial load
displayMain();
