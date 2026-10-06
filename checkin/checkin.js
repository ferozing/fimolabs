// Checkin landing page behaviour: the morning loop, the week picker, Sona's languages
// and the invite code box. One 60ms tick drives everything, as in the design.
(function () {
  "use strict";

  /* ---------------- data ---------------- */

  var scenes = [
    { lang: "Hindi", home: "Bareilly", childCity: "Pune", off: 0, name: "Papa", he: "he", his: "his", him: "him",
      banner: "Papa is doing well today. Tap to read your note.",
      meds: "sugar tablet taken after breakfast", mood: "chatty, slept well", food: "poha and chai",
      askLabel: "Ask him tonight", ask: "who won carrom with Sharma uncle?",
      convo: [
        { who: "sona", text: "Good morning Papa! Nashta ho gaya?", tr: "Good morning Papa! Had breakfast?" },
        { who: "p", text: "Haan, poha khaya. Sugar ki goli bhi le li.", tr: "Yes, had poha. Took my sugar tablet too." },
        { who: "sona", text: "Badhiya! Kal carrom mein kaun jeeta?", tr: "Nice! Who won carrom yesterday?" },
        { who: "p", text: "Sharma ji kehte hain woh, par main jeeta tha!", tr: "Sharma ji says he did, but I won!" }
      ] },
    { lang: "Telugu", home: "Tenali", childCity: "Bengaluru", off: 0, name: "Amma", he: "she", his: "her", him: "her",
      banner: "Amma is doing well today. Tap to read your note.",
      meds: "BP tablet taken after breakfast", mood: "cheerful, slept well", food: "upma and filter coffee",
      askLabel: "Ask her tonight", ask: "did the tomato plants finally flower?",
      convo: [
        { who: "sona", text: "Good morning Amma! Tiffin ayyinda?", tr: "Good morning Amma! Had breakfast?" },
        { who: "p", text: "Ayyindi, upma chesanu. BP tablet kooda vesukunna.", tr: "Yes, made upma. Took my BP tablet too." },
        { who: "sona", text: "Super! Mee tomato mokkalu ela unnayi?", tr: "Lovely! How are your tomato plants?" },
        { who: "p", text: "Inka poovulu raaledu. Repu choodali!", tr: "No flowers yet. Let us see tomorrow!" }
      ] },
    { lang: "Tamil", home: "Karaikudi", childCity: "Dubai", off: -90, name: "Amma", he: "she", his: "her", him: "her",
      banner: "Amma is doing well today. Tap to read your note.",
      meds: "thyroid tablet taken on time", mood: "happy, a little busy", food: "idli and sambar",
      askLabel: "Ask her tonight", ask: "how did the neighbour kid’s birthday go?",
      convo: [
        { who: "sona", text: "Good morning Amma! Saapteengala?", tr: "Good morning Amma! Have you eaten?" },
        { who: "p", text: "Saapten, idli. Maathirai pottachu.", tr: "Yes, idli. Took my tablet." },
        { who: "sona", text: "Nalladhu! Inniku enna plan?", tr: "Good! What is the plan today?" },
        { who: "p", text: "Pakkathu veetu paapa birthday. Kesari panren!", tr: "Neighbour kid’s birthday. Making kesari!" }
      ] },
    { lang: "Bengali", home: "Bardhaman", childCity: "Gurugram", off: 0, name: "Ma", he: "she", his: "her", him: "her",
      banner: "Ma is doing well today. Tap to read your note.",
      meds: "all morning tablets taken", mood: "relaxed, slept well", food: "luchi and tea",
      askLabel: "Ask her tonight", ask: "which old songs did she listen to today?",
      convo: [
        { who: "sona", text: "Good morning Ma! Kheyecho?", tr: "Good morning Ma! Have you eaten?" },
        { who: "p", text: "Haan, luchi kheyechi. Oshudh o kheyechi.", tr: "Yes, had luchi. Took my medicines too." },
        { who: "sona", text: "Darun! Aaj ki korbe?", tr: "Lovely! What will you do today?" },
        { who: "p", text: "Puron gaan shunbo, aar ektu ghumabo!", tr: "Listen to old songs, and nap a little!" }
      ] },
    { lang: "English", home: "Kottayam", childCity: "Mumbai", off: 0, name: "Dad", he: "he", his: "his", him: "him",
      banner: "Dad is doing well today. Tap to read your note.",
      meds: "BP and sugar tablets taken", mood: "upbeat, walked 30 minutes", food: "puttu and banana",
      askLabel: "Ask him tonight", ask: "did the new reading glasses help?",
      convo: [
        { who: "sona", text: "Morning Dad! How did you sleep?", tr: "In plain English, at his pace." },
        { who: "p", text: "Very well. Already had my tablets.", tr: "All on time today." },
        { who: "sona", text: "Wonderful. Did the new glasses arrive?", tr: "Sona remembers yesterday." },
        { who: "p", text: "Yes! I can read the paper again.", tr: "Something to talk about tonight." }
      ] }
  ];

  var week = [
    { short: "Mon", full: "Monday", type: "good", time: "9:07 am",
      headline: "Amma went for her walk with Lakshmi aunty and came back hungry.",
      rows: [["Medicines", "All taken, morning and night"], ["Mood", "Chatty, in good spirits"], ["Sleep", "Slept well, up at 6"]],
      ask: "Did Lakshmi aunty’s grandson get his results?" },
    { short: "Tue", full: "Tuesday", type: "good", time: "9:06 am",
      headline: "A quiet day. She watched her serial and called your cousin.",
      rows: [["Medicines", "All taken"], ["Mood", "Calm"], ["Food", "Pesarattu for breakfast"]],
      ask: "What happened in her serial yesterday?" },
    { short: "Wed", full: "Wednesday", type: "amber", time: "9:09 am",
      headline: "Her knee is hurting again, and she skipped last night’s tablet.",
      rows: [["Medicines", "Missed the evening BP tablet"], ["Mood", "A little low"], ["Sleep", "Woke up twice from knee pain"]],
      ask: "Call her today. Ask about the knee and remind her gently about the tablet." },
    { short: "Thu", full: "Thursday", type: "good", time: "9:08 am",
      headline: "Back to herself. Knee is better after the warm oil.",
      rows: [["Medicines", "BP tablet taken after breakfast"], ["Mood", "Cheerful, slept well"], ["Food", "Upma and filter coffee"]],
      ask: "Did the tomato plants finally flower?" },
    { short: "Fri", full: "Friday", type: "good", time: "9:07 am",
      headline: "Excited about the wedding in the family next month.",
      rows: [["Medicines", "All taken"], ["Mood", "Happy, a bit busy"], ["Plans", "Tailor visit on Saturday"]],
      ask: "Which saree did she finally choose for the wedding?" },
    { short: "Sat", full: "Saturday", type: "missed", time: "9:30 am",
      headline: "No answer at 9:00, 9:15 and 9:30.",
      rows: [["What we did", "Tried three times, 15 minutes apart"], ["Likely", "She mentioned the tailor visit yesterday"], ["Next", "Sona calls again tomorrow"]],
      ask: "You may want to give her a quick call yourself." },
    { short: "Sun", full: "Sunday", type: "good", time: "9:08 am",
      headline: "Showed Sona the new blouse. Very proud of the tailor.",
      rows: [["Medicines", "All taken"], ["Mood", "Bright"], ["Food", "Biryani at your uncle’s"]],
      ask: "Ask her to send you a photo of the blouse." }
  ];

  var typeStyle = {
    good:   { status: "All good today",   suffix: "",          askLabel: "Ask her tonight" },
    amber:  { status: "Worth a call today", suffix: "is-amber",  askLabel: "What to do" },
    missed: { status: "Didn’t pick up",  suffix: "is-missed", askLabel: "What to do" }
  };

  var greets = [
    { name: "Telugu",  line: "Good morning Amma! Tiffin ayyinda?", tr: "Good morning Amma! Had your breakfast?" },
    { name: "Hindi",   line: "Good morning Papa! Nashta ho gaya?", tr: "Good morning Papa! Had breakfast?" },
    { name: "Tamil",   line: "Amma, saapteengala? Thookam nalla irundhucha?", tr: "Amma, have you eaten? Did you sleep well?" },
    { name: "Kannada", line: "Appa, oota aayta? Walk ge hogidra?", tr: "Appa, had your meal? Did you go for your walk?" },
    { name: "Bengali", line: "Ma, kheyecho? Aaj sharir kemon?", tr: "Ma, have you eaten? How are you feeling today?" },
    { name: "English", line: "Morning Dad! Did you take your sugar tablet?", tr: "Plain English, at their pace." }
  ];

  /* ---------------- helpers ---------------- */

  var $ = function (id) { return document.getElementById(id); };
  var cap = function (w) { return w.charAt(0).toUpperCase() + w.slice(1); };
  var pad2 = function (n) { return String(n).padStart(2, "0"); };

  /* ---------------- hero: the two mornings ---------------- */

  var heroLangsEl = $("heroLangs");
  var chatEl = $("chatLines");
  var stepsEl = $("steps");
  var keypadEl = $("keypad");
  var screenEl = $("phoneScreen");

  scenes.forEach(function (s) {
    var el = document.createElement("span");
    el.className = "langchip";
    el.textContent = s.lang;
    heroLangsEl.appendChild(el);
  });
  var heroChips = heroLangsEl.children;

  var stepNodes = [];
  for (var i = 0; i < 4; i++) {
    var step = document.createElement("div");
    step.className = "step";
    step.innerHTML = '<span class="step-track"><span class="step-fill"></span></span><span class="step-label"></span>';
    stepsEl.appendChild(step);
    stepNodes.push({ root: step, fill: step.querySelector(".step-fill"), label: step.querySelector(".step-label") });
  }

  var lastSceneIndex = -1;
  var lastChatKey = "";

  function renderHero(t) {
    var c = t % 220;
    var ringing = c < 45, talking = c >= 45 && c < 120;
    var banner = c >= 128 && c < 160, note = c >= 160;

    var si = Math.floor(t / 220) % scenes.length;
    var sc = scenes[si];

    var secs = talking ? Math.round(((c - 45) / 75) * 372) : 372;
    var callClock = Math.floor(secs / 60) + ":" + pad2(secs % 60);
    var leftMin = ringing ? 0 : talking ? Math.floor(((c - 45) / 75) * 6) : 6;
    var rightMin = c < 128 ? 1 + Math.floor((c / 128) * 6) : c < 160 ? 7 : 8;

    function fmt(min) {
      var total = 9 * 60 + min + sc.off;
      return Math.floor(total / 60) + ":" + pad2(((total % 60) + 60) % 60);
    }

    if (si !== lastSceneIndex) {
      lastSceneIndex = si;
      for (var i = 0; i < heroChips.length; i++) heroChips[i].classList.toggle("on", i === si);
      $("homeCity").textContent = sc.home;
      $("childCity").textContent = sc.childCity;
      $("bannerText").textContent = sc.banner;
      $("noteMeds").textContent = sc.meds;
      $("noteMood").textContent = sc.mood;
      $("noteFood").textContent = sc.food;
      $("noteAskLabel").textContent = sc.askLabel;
      $("noteAsk").textContent = sc.ask;
      var labels = [cap(sc.his) + " phone rings", "A warm 6 minute chat", "Your note is written", "You know " + sc.he + "’s okay"];
      stepNodes.forEach(function (n, i) { n.label.textContent = labels[i]; });
    }

    $("leftClock").textContent = "9:" + pad2(leftMin);
    $("rightClock").textContent = fmt(rightMin);
    $("lockClock").textContent = fmt(rightMin);
    $("noteTime").textContent = fmt(8) + " am";

    keypadEl.classList.toggle("ring", ringing);
    var kp = $("kpScreen");
    kp.style.background = ringing ? "#CFE8D6" : talking ? "#DDE8DF" : "#C9CFCB";
    $("kpTop").textContent = ringing ? "Incoming call" : talking ? "On call" : "Call ended";
    $("kpBottom").textContent = ringing ? "ringing..." : callClock;

    // the chat, two bubbles at a time
    var shown = [];
    if (talking) {
      var n = Math.min(4, 1 + Math.floor((c - 45) / 19));
      shown = sc.convo.slice(Math.max(0, n - 2), n);
    } else if (!ringing) {
      shown = sc.convo.slice(2, 4);
    }
    var key = si + "|" + shown.map(function (l) { return l.text; }).join("|");
    if (key !== lastChatKey) {
      lastChatKey = key;
      chatEl.textContent = "";
      shown.forEach(function (l) {
        var b = document.createElement("div");
        b.className = "bubble " + (l.who === "sona" ? "from-sona" : "from-them");
        b.innerHTML = '<span class="bubble-text"></span><span class="bubble-tr"></span>';
        b.firstChild.textContent = l.text;
        b.lastChild.textContent = l.tr;
        chatEl.appendChild(b);
      });
    }

    screenEl.classList.toggle("show-banner", banner);
    screenEl.classList.toggle("show-note", note);

    var stepIdx = ringing ? 0 : talking ? 1 : c < 160 ? 2 : 3;
    var fills = [
      ringing ? (c / 45) * 100 : 100,
      ringing ? 0 : talking ? ((c - 45) / 75) * 100 : 100,
      c < 120 ? 0 : c < 160 ? ((c - 120) / 40) * 100 : 100,
      c < 160 ? 0 : Math.min(100, ((c - 160) / 40) * 100)
    ];
    stepNodes.forEach(function (n, i) {
      n.fill.style.width = Math.round(fills[i]) + "%";
      n.root.classList.toggle("on", i <= stepIdx);
    });

    $("leftCap").textContent = ringing
      ? sc.name + "’s phone rings at the usual time. " + cap(sc.he) + " just picks up."
      : talking ? "Sona chats with " + sc.him + " in " + sc.lang + ", like family would."
      : "Six minutes later, " + sc.he + "’s smiling.";
    $("rightCap").textContent = c < 128 ? "You’re getting ready for work."
      : c < 160 ? "A WhatsApp note arrives."
      : "You know exactly how " + sc.he + " is.";
  }

  /* ---------------- the week picker ---------------- */

  var dayPicker = $("dayPicker");
  var dayButtons = week.map(function (d, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "day";
    b.setAttribute("aria-label", d.full);
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = '<span class="day-short"></span><span class="day-dot ' + d.type + '"></span>';
    b.firstChild.textContent = d.short;
    b.addEventListener("click", function () { selectDay(i); });
    dayPicker.appendChild(b);
    return b;
  });

  function selectDay(i) {
    var d = week[i], ts = typeStyle[d.type];
    dayButtons.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    $("dayStatus").className = "status " + ts.suffix;
    $("dayStatus").textContent = ts.status;
    $("dayWhen").textContent = d.full + " · " + d.time;
    $("dayHeadline").textContent = d.headline;
    var rows = $("dayRows");
    rows.textContent = "";
    d.rows.forEach(function (r) {
      var row = document.createElement("div");
      row.className = "row";
      row.innerHTML = '<span class="row-k"></span><span class="row-v"></span>';
      row.firstChild.textContent = r[0];
      row.lastChild.textContent = r[1];
      rows.appendChild(row);
    });
    $("dayAskBox").className = "askbox " + ts.suffix;
    $("dayAskLabel").textContent = ts.askLabel;
    $("dayAsk").textContent = d.ask;
  }
  selectDay(3);

  /* ---------------- Sona's languages ---------------- */

  var sonaLangsEl = $("sonaLangs");
  greets.forEach(function (g) {
    var el = document.createElement("span");
    el.className = "sonalang";
    el.textContent = g.name;
    sonaLangsEl.appendChild(el);
  });
  var sonaChips = sonaLangsEl.children;

  var barsEl = $("bars");
  for (var b = 0; b < 12; b++) barsEl.appendChild(document.createElement("span"));
  var barNodes = barsEl.children;

  var lastGreet = -1;
  function renderSona(t, animate) {
    var gi = Math.floor(t / 55) % greets.length;
    var gp = t % 55;
    if (gi !== lastGreet) {
      lastGreet = gi;
      var g = greets[gi];
      $("sonaLangName").textContent = g.name;
      $("sonaLine").textContent = "“" + g.line + "”";
      $("sonaTr").textContent = g.tr;
      for (var i = 0; i < sonaChips.length; i++) sonaChips[i].classList.toggle("on", i === gi);
    }
    if (!animate) return;
    var op = gp < 6 ? gp / 6 : gp > 50 ? (55 - gp) / 5 : 1;
    $("sonaLine").style.opacity = op;
    $("sonaTr").style.opacity = op;
    for (var j = 0; j < barNodes.length; j++) {
      barNodes[j].style.height = Math.round(6 + 20 * Math.abs(Math.sin(t * 0.35 + j * 0.9))) + "px";
    }
  }

  /* ---------------- the invite code box ---------------- */

  var form = $("codeForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("code");
    if (!input.value.trim()) { input.focus(); return; }
    form.hidden = true;
    $("codeOk").hidden = false;
  });

  /* ---------------- the tick ---------------- */

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    renderHero(170);   // a frame with the note already delivered
    renderSona(0, false);
    for (var k = 0; k < barNodes.length; k++) barNodes[k].style.height = (8 + (k % 4) * 5) + "px";
    return;
  }

  var t = 0;
  renderHero(t);
  renderSona(t, true);
  setInterval(function () {
    t += 1;
    renderHero(t);
    renderSona(t, true);
  }, 60);
})();
