let questions = [];
let currentQuestion = 0;
let selectedAnswers = {};
let timer;
let timeLeft = 900; // 15 minutes

// Load questions from URL or JSON file
fetch("questions.json")
  .then((res) => res.json())
  .then((data) => {
    questions = data;
    displayQuestion();
    startTimer();
    createReviewPanel(); // ← Added
  })
  .catch((err) => {
    console.error("Failed to load questions:", err);
    document.getElementById("questionText").textContent = "Failed to load questions.";
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
    option.onclick = () => selectOption(index);
    if (selectedAnswers[currentQuestion] === index) {
      option.style.background = "#d0eaff";
    }
    optionsDiv.appendChild(option);
  });

  updateProgressBar();
  highlightSelectedInReview(); // ← Added
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

function showSubmit() {
  document.getElementById("questionText").textContent = "You've reached the end of the test.";
  document.getElementById("options").innerHTML = "";
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("submitBtn").style.display = "inline-block";
}

document.getElementById("submitBtn").onclick = () => {
  clearInterval(timer);
  let score = 0;

  questions.forEach((q, i) => {
    if (selectedAnswers[i] === q.answer) {
      score++;
    }
  });

  // Hide test, show result
  document.getElementById("testContainer").style.display = "none";
  document.getElementById("resultContainer").style.display = "block";
  document.getElementById("scoreText").textContent =
    `You scored ${score} out of ${questions.length} (${Math.round((score / questions.length) * 100)}%)`;
};

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

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  document.getElementById("time").textContent = `${minutes}:${seconds}`;
}

function updateProgressBar() {
  const percent = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

// ✅ THEME TOGGLE BUTTON FUNCTIONALITY
const toggleButton = document.getElementById("themeToggle");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  toggleButton.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});

// ✅ REVIEW PANEL LOGIC (Sidebar Question Pallet)
function createReviewPanel() {
  const reviewPanel = document.getElementById("reviewPanel");
  reviewPanel.innerHTML = ""; // Clear existing buttons
  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;
    btn.className = "review-btn";
    btn.onclick = () => {
      currentQuestion = i;
      displayQuestion();
    };
    reviewPanel.appendChild(btn);
  });
}

function highlightSelectedInReview() {
  const reviewBtns = document.querySelectorAll(".review-btn");
  reviewBtns.forEach((btn, i) => {
    if (selectedAnswers[i] !== undefined) {
      btn.classList.add("answered");
    } else {
      btn.classList.remove("answered");
    }
  });
}

// ✅ TOGGLE RIGHT SIDEBAR
document.getElementById("toggleReview").onclick = () => {
  document.getElementById("reviewSidebar").classList.toggle("hidden");
};
function buildQuestionPalette() {
  const palette = document.getElementById("questionPalette");
  palette.innerHTML = "";

  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.className = "palette-btn";
    btn.textContent = i + 1;
    btn.onclick = () => {
      currentQuestion = i;
      displayQuestion();
    };

    // Highlight if answered
    if (selectedAnswers[i] !== undefined) {
      btn.classList.add("answered");
    }

    palette.appendChild(btn);
  });
}

// Update palette when displaying question
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
    option.onclick = () => selectOption(index);
    if (selectedAnswers[currentQuestion] === index) {
      option.style.background = "#d0eaff";
    }
    optionsDiv.appendChild(option);
  });

  updateProgressBar();
  buildQuestionPalette(); // 👈 Ensure palette updates
}
