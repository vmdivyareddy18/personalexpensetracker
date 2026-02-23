// ===============================
// 📦 Load Expenses From Storage
// ===============================
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// ===============================
// ➕ Add Expense Function
// ===============================
function addExpense() {

    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    let note = document.getElementById("note").value;

    if (!amount || !category || !date) {
        alert("Fill all required fields");
        return;
    }

    let expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        category: category,
        date: date,
        note: note
    };

    expenses.unshift(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    renderExpenses();
    clearForm();

    speak("Expense added successfully");
}


// ===============================
// 📋 Render Expenses
// ===============================
function renderExpenses() {

    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach(exp => {
        let div = document.createElement("div");
        div.className = "expense-item";
        div.innerHTML = `
            ₹${exp.amount} - ${exp.category} (${exp.date})
            <br><small>${exp.note || ""}</small>
        `;
        list.appendChild(div);
    });
}


// ===============================
// 🧹 Clear Form
// ===============================
function clearForm() {
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
}


// ===============================
// 🎤 VOICE RECOGNITION SYSTEM
// ===============================
const micBtn = document.getElementById("micBtn");
const noteInput = document.getElementById("note");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const languageSelect = document.getElementById("language");

let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;

    micBtn.addEventListener("click", () => {

        recognition.lang = languageSelect.value;

        if (!isRecording) {
            recognition.start();
            micBtn.classList.add("recording");
            micBtn.innerText = "🔴";
            isRecording = true;
        } else {
            recognition.stop();
        }
    });

    recognition.onresult = function (event) {

        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        processVoiceCommand(transcript);
    };

    recognition.onend = function () {
        micBtn.classList.remove("recording");
        micBtn.innerText = "🎤";
        isRecording = false;
    };

} else {
    micBtn.disabled = true;
    micBtn.innerText = "❌";
    alert("Speech Recognition not supported. Use Google Chrome.");
}


// ===============================
// 🧠 Smart Voice Processing
// ===============================
function processVoiceCommand(text) {

    console.log("Voice Input:", text);

    // Detect amount (numbers)
    const amountMatch = text.match(/\d+/);
    if (amountMatch) {
        amountInput.value = amountMatch[0];
    }

    // Detect category
    const categories = ["food", "transport", "bills", "shopping", "health", "entertainment"];

    categories.forEach(cat => {
        if (text.includes(cat)) {
            categorySelect.value = cat.charAt(0).toUpperCase() + cat.slice(1);
        }
    });

    // Detect "today"
    if (text.includes("today")) {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("date").value = today;
    }

    // Set entire text as note
    noteInput.value = text;
}


// ===============================
// 🔊 Text To Speech (Voice Reply)
// ===============================
function speak(message) {

    const speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.lang = languageSelect ? languageSelect.value : "en-US";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}


// ===============================
// 🚀 Initialize
// ===============================
renderExpenses();