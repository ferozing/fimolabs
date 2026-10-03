/* ===== Settings: edit these ===== */
// Your WhatsApp number with country code, digits only. Example: "919845012345"
const FOUNDER_WHATSAPP = "919629381945";
const FOUNDER_NAME = "Feroz";
// Invite codes that unlock the early access form (not case sensitive).
// Note: anyone can see these in the page source, so treat them as a gentle gate, not security.
const INVITE_CODES = ["FAMILY2026", "AMURA", "FIRST50"];
// Optional: paste a Formspree form URL here (free at formspree.io), e.g. "https://formspree.io/f/abcdwxyz".
// Leave it empty and each early access request opens WhatsApp with the details filled in, sent to you.
const FORM_ENDPOINT = "";
const WHATSAPP_MESSAGE ="Hi " + FOUNDER_NAME + ", I'd love to try Parent Check In for my parent. I don't have an invite code yet.";
/* ================================= */

// WhatsApp links
const waUrl = "https://wa.me/" + FOUNDER_WHATSAPP + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
document.querySelectorAll(".founder-link").forEach((a) => { a.href = waUrl; });
document.querySelectorAll(".founder-name").forEach((el) => { el.textContent = FOUNDER_NAME; });

// Access dialog
const dialog = document.getElementById("access");
const steps = dialog.querySelectorAll(".step");
function showStep(name) {
  steps.forEach((s) => { s.hidden = s.dataset.step !== name; });
  const first = dialog.querySelector('.step[data-step="' + name + '"] input:not([type=hidden]), .step[data-step="' + name + '"] .btn');
  if (first) setTimeout(() => first.focus(), 30);
}
document.querySelectorAll("[data-open-access]").forEach((b) => b.addEventListener("click", () => {
  showStep("code");
  document.getElementById("codeError").hidden = true;
  if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
}));
document.querySelectorAll("[data-close-access]").forEach((b) => b.addEventListener("click", () => dialog.close()));
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });

document.getElementById("codeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("code").value.trim().toUpperCase();
  const ok = INVITE_CODES.map((c) => c.toUpperCase()).includes(code);
  document.getElementById("codeError").hidden = ok;
  if (ok) {
    document.getElementById("inviteCodeField").value = code;
    showStep("form");
  }
});

// Early access form: sends to Formspree if FORM_ENDPOINT is set, otherwise to your WhatsApp.
document.getElementById("accessForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.reportValidity()) return;
  const err = document.getElementById("formError");
  err.hidden = true;
  const data = new FormData(form);
  if (!FORM_ENDPOINT) {
    const text = "Hi " + FOUNDER_NAME + ", I'd like early access to Parent Check In.\n" +
      "Name: " + data.get("name") + "\n" +
      "WhatsApp: " + data.get("whatsapp") + "\n" +
      "Parent's city: " + data.get("parent-city") + "\n" +
      "Language: " + data.get("parent-language") + "\n" +
      "Invite code: " + data.get("invite-code");
    window.open("https://wa.me/" + FOUNDER_WHATSAPP + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    form.reset();
    showStep("done");
    return;
  }
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: data
    });
    if (!res.ok) throw new Error("Form not saved");
    form.reset();
    showStep("done");
  } catch (_) {
    err.hidden = false;
  }
});

// Hero demo animation
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const el = (id) => document.getElementById(id);
const keypad = el("keypad"), kpScreen = el("kpScreen"), kpTop = el("kpTop"), kpBottom = el("kpBottom");
const leftCap = el("leftCap"), rightCap = el("rightCap"), lock = el("lock"), notif = el("notif"), chat = el("chat");
const dots = document.querySelectorAll(".dot");
const topics = ["Talking about breakfast...", "Asking about the BP tablet...", "Hearing about the wedding sweets..."];

function render(t) {
  const ringing = t < 9, talking = t >= 9 && t < 25;
  const secs = Math.min(372, Math.max(0, t - 9) * 23 + 3);
  const clock = Math.floor(secs / 60) + ":" + String(secs % 60).padStart(2, "0");
  const showNotif = t >= 28 && t < 34, showChat = t >= 34;

  keypad.style.transform = ringing ? (t % 2 ? "rotate(-3deg)" : "rotate(3deg)") : "rotate(0deg)";
  kpScreen.style.background = ringing ? "#CFE8D6" : talking ? "#DDE8DF" : "#C9CFCB";
  kpTop.textContent = ringing ? "Incoming call" : talking ? "On call" : "Call ended";
  kpBottom.textContent = ringing ? "ringing..." : clock;
  leftCap.textContent = ringing ? "Mom's phone rings at her usual time. She just picks up."
    : talking ? topics[Math.floor((t - 9) / 6) % 3] : "A warm 6 minute chat, in Hindi.";
  rightCap.textContent = showChat ? "Your note, with something to ask her."
    : showNotif ? "Minutes later, on your WhatsApp." : "Meanwhile, you're in a meeting.";
  lock.style.opacity = showChat ? "0" : "1";
  notif.style.opacity = showNotif ? "1" : "0";
  notif.style.transform = showNotif ? "translateY(0)" : (showChat ? "translateY(-8px) scale(0.96)" : "translateY(-24px)");
  chat.style.opacity = showChat ? "1" : "0";
  chat.style.transform = showChat ? "translateY(0)" : "translateY(16px)";
  const prog = ringing ? 0 : talking ? 1 : t < 28 ? 2 : showChat ? 4 : 3;
  dots.forEach((d, i) => d.classList.toggle("on", i <= prog));
}

if (reduceMotion) {
  render(40);
} else {
  let t = 0;
  render(t);
  setInterval(() => { t = t >= 59 ? 0 : t + 1; render(t); }, 350);
}
