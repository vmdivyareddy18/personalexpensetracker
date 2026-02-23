// ===============================
// 📦 LOAD FROM STORAGE
// ===============================
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


// ===============================
// 📊 CATEGORY TOTALS
// ===============================
let categoryTotals = {
    Food: 0,
    Shopping: 0,
    Bills: 0,
    Transport: 0,
    Health: 0,
    Entertainment: 0,
    Others: 0
};


// ===============================
// ➕ ADD EXPENSE
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
        amount: Number(amount),
        category,
        date,
        note,
        language: document.getElementById("language").value
    };

    expenses.unshift(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    recalculateCategoryTotals();
    renderExpenses();
    clearForm();

    speak("Expense added successfully");
}


// ===============================
// 🧾 RENDER HISTORY
// ===============================
function renderExpenses() {

    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    if (expenses.length === 0) {
        list.innerHTML = "<p>No expenses yet</p>";
        return;
    }

    expenses.forEach(exp => {

        const div = document.createElement("div");
        div.className = "expense-item";

        div.innerHTML = `
            <div class="expense-header">
                <span>₹${exp.amount} - ${exp.category}</span>
                <span>${exp.date}</span>
            </div>

            <div class="expense-details">
                <p><b>Note:</b> ${exp.note || "No note"}</p>
                <p><b>Language:</b> ${exp.language}</p>
            </div>
        `;

        div.addEventListener("click", () => {
            div.classList.toggle("active");
        });

        list.appendChild(div);
    });

    updateDashboard();
}


// ===============================
// 🧮 RECALCULATE TOTALS
// ===============================
function recalculateCategoryTotals() {

    Object.keys(categoryTotals).forEach(key => {
        categoryTotals[key] = 0;
    });

    expenses.forEach(e => {

        if (categoryTotals[e.category] !== undefined) {
            categoryTotals[e.category] += e.amount;
        } else {
            categoryTotals.Others += e.amount;
        }

    });
}


// ===============================
// 🧹 CLEAR FORM
// ===============================
function clearForm() {

    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";
}


// ===============================
// 👁️ TOGGLE HISTORY
// ===============================
function toggleHistory() {

    const box = document.getElementById("historyBox");
    const btn = document.getElementById("toggleBtn");

    if (box.style.display === "none") {

        box.style.display = "block";
        btn.innerText = "Hide";

    } else {

        box.style.display = "none";
        btn.innerText = "Show";
    }
}


// ===============================
// 🎤 VOICE SYSTEM
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

            micBtn.innerText = "🔴";
            isRecording = true;

        } else {

            recognition.stop();
        }
    });


    recognition.onresult = function (event) {

        const transcript =
            event.results[event.results.length - 1][0].transcript.toLowerCase();

        processVoiceCommand(transcript);
    };


    recognition.onend = function () {

        micBtn.innerText = "🎤";
        isRecording = false;
    };

}


// ===============================
// 🧠 PROCESS VOICE
// ===============================
function processVoiceCommand(text) {

    console.log("Voice:", text);

    const amountMatch = text.match(/\d+/);

    if (amountMatch) {
        amountInput.value = amountMatch[0];
    }


    const categories = ["food", "transport", "bills", "shopping", "health", "entertainment"];

    categories.forEach(cat => {

        if (text.includes(cat)) {

            categorySelect.value =
                cat.charAt(0).toUpperCase() + cat.slice(1);
        }
    });


    if (text.includes("today")) {

        const today = new Date().toISOString().split("T")[0];

        document.getElementById("date").value = today;
    }


    noteInput.value = text;
}


// ===============================
// 🔊 SPEAK
// ===============================
function speak(msg) {

    const speech = new SpeechSynthesisUtterance();

    speech.text = msg;

    speech.lang = languageSelect.value || "en-US";

    window.speechSynthesis.speak(speech);
}


// ===============================
// 📈 CHARTS
// ===============================
const pieCtx = document.getElementById('pieChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');


let pieChart = new Chart(pieCtx, {

    type: 'pie',

    data: {
        labels: Object.keys(categoryTotals),

        datasets: [{
            data: Object.values(categoryTotals),

            backgroundColor: [
                '#3b82f6', '#10b981', '#f59e0b',
                '#ef4444', '#8b5cf6', '#ec4899',
                '#6b7280'
            ]
        }]
    }
});


let barChart = new Chart(barCtx, {

    type: 'bar',

    data: {
        labels: ['Total'],

        datasets: [{
            label: 'Monthly Spending',

            data: [0],

            backgroundColor: '#3b82f6'
        }]
    }
});


// ===============================
// 📊 DASHBOARD
// ===============================
function updateDashboard() {

    let total = 0;

    expenses.forEach(e => total += e.amount);

    let transactions = expenses.length;

    let avg = transactions ? (total / transactions).toFixed(2) : 0;


    let score =
        total < 5000 ? 90 :
            total < 10000 ? 70 : 50;


    document.getElementById("totalSpent").innerText = "₹" + total;

    document.getElementById("totalTransactions").innerText = transactions;

    document.getElementById("avgTransaction").innerText = "₹" + avg;

    document.getElementById("healthScore").innerText = score;


    pieChart.data.datasets[0].data =
        Object.values(categoryTotals);

    pieChart.update();


    barChart.data.datasets[0].data = [total];

    barChart.update();
}


// ===============================
// 🚀 INIT
// ===============================
recalculateCategoryTotals();
renderExpenses();

document.getElementById("historyBox").style.display = "none";
document.getElementById("toggleBtn").innerText = "Show";