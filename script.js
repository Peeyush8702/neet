let questions = [];
let currentQuestion = 0;
let selectedAnswers = {};
let timer;
let timeLeft = 900;

fetch("questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    displayQuestion();
    createPalette();
    startTimer();
  });

function displayQuestion() {
  if (currentQuestion >= questions.length) {
    showSubmit();
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("questionText").textContent = `Q${currentQuestion + 1}: ${q.q}`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, index) => {
    const option = document.createElement("div");
    option.className = "option";
    option.textContent = opt;

    option.onclick = (e) => {
      selectOption(index);
      // Ripple effect
      option.classList.remove("ripple");
      void option.offsetWidth; // reflow
      option.classList.add("ripple");
    };

    if (selectedAnswers[currentQuestion] === index) {
      option.classList.add("selected");
    }

    optionsDiv.appendChild(option);
  });

  updateProgressBar();
  updatePalette();
}

function selectOption(index) {
  selectedAnswers[currentQuestion] = index;
  displayQuestion();
}

document.getElementById("nextBtn").onclick = () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    displayQuestion();
  } else {
    showSubmit();
  }
};

document.getElementById("submitBtn").onclick = () => {
  clearInterval(timer);
  let score = 0;

  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.answer) score++;
  });

  document.getElementById("testContainer").style.display = "none";
  document.getElementById("resultContainer").style.display = "block";
  document.getElementById("scoreText").textContent = `You scored ${score} out of ${questions.length} (${Math.round((score / questions.length) * 100)}%)`;
};

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  document.getElementById("time").textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  updateTimerDisplay();
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up!");
      document.getElementById("submitBtn").click();
    }
  }, 1000);
}

function updateProgressBar() {
  const percent = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

const toggleButton = document.getElementById("themeToggle");
toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  toggleButton.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

// Sidebar toggle
const sidebar = document.getElementById("rightSidebar");
const toggleSidebar = document.getElementById("toggleSidebar");
toggleSidebar.onclick = () => {
  sidebar.classList.toggle("hidden");
};

function createPalette() {
  const container = document.getElementById("questionPalette");
  container.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement("div");
    btn.className = "palette-btn";
    btn.textContent = i + 1;
    btn.onclick = () => {
      currentQuestion = i;
      displayQuestion();
    };
    container.appendChild(btn);
  }
}

function updatePalette() {
  const btns = document.querySelectorAll(".palette-btn");
  btns.forEach((btn, i) => {
    btn.classList.remove("answered", "current");
    if (selectedAnswers[i] !== undefined) {
      btn.classList.add("answered");
    }
    if (i === currentQuestion) {
      btn.classList.add("current");
    }
  });
}
