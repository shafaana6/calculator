const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".buttons button");
const historyList = document.querySelector(".history-list");
const themeToggle = document.getElementById("theme-toggle");

let output = "";
let memory = 0;

// AUTO DARK MODE BY TIME

const hour = new Date().getHours();
if (hour >= 18 || hour < 6) {
  document.body.classList.add("dark");
}


// LOAD SAVED DATA

window.addEventListener("load", () => {
  loadHistory();
  const last = localStorage.getItem("lastExp");
  if (last) {
    output = last;
    display.value = output;
  }
});

// BUTTON CLICKS

buttons.forEach(btn => {
  btn.addEventListener("click", () => handle(btn.dataset.value));
});


// KEYBOARD SUPPORT

document.addEventListener("keydown", e => {
  if ("0123456789+-*/.%".includes(e.key)) handle(e.key);
  if (e.key === "Enter") handle("=");
  if (e.key === "Backspace") handle("DEL");
});


// MAIN HANDLER

function handle(value) {
  if (!value) return;

  if (value === "AC") {
    output = "";
    display.value = "";
    return;
  }

  if (value === "DEL") {
    output = output.slice(0, -1);
    display.value = output;
    return;
  }

  if (value === "=") {
    try {
      const exp = output;
      const result = eval(output.replace("%","/100"));
      output = result.toString();
      display.value = output;
      saveHistory(exp, result);
      localStorage.setItem("lastExp", output);
    } catch {
      error();
    }
    return;
  }

  // MEMORY
  if (value === "M+") memory += Number(output || 0);
  if (value === "M-") memory -= Number(output || 0);
  if (value === "MR") display.value = output = memory.toString();
  if (value === "MC") memory = 0;

  if (!["M+","M-","MR","MC"].includes(value)) {
    output += value;
    display.value = output;
  }
}

// HISTORY
function saveHistory(exp, res) {
  const h = JSON.parse(localStorage.getItem("calcHistory")) || [];
  h.unshift({ exp, res });
  localStorage.setItem("calcHistory", JSON.stringify(h.slice(0,10)));
  renderHistory(h);
}

function loadHistory() {
  const h = JSON.parse(localStorage.getItem("calcHistory")) || [];
  renderHistory(h);
}

function renderHistory(history) {
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.exp} = ${item.res}`;
    li.onclick = () => {
      output = item.exp;
      display.value = output;
    };
    historyList.appendChild(li);
  });
}


// ERROR EFFECT

function error() {
  display.value = "Error";
  display.classList.add("shake");
  setTimeout(() => {
    display.classList.remove("shake");
    display.value = "";
    output = "";
  }, 700);
}


// THEME TOGGLE

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
