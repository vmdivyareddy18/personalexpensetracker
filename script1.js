// ===============================
// LOAD FROM STORAGE
// ===============================

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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
// PREPARE DATA
// ===============================

expenses.forEach(e => {

    let cat = e.category;

    if (categoryTotals[cat] !== undefined) {
        categoryTotals[cat] += Number(e.amount);
    } else {
        categoryTotals.Others += Number(e.amount);
    }

});


// ===============================
// CHART SETUP
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
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {

    let total = 0;

    expenses.forEach(e => {
        total += Number(e.amount);
    });

    let transactions = expenses.length;

    let avg = transactions ? (total / transactions).toFixed(2) : 0;

    // Health score
    let score = total < 5000 ? 90 :
        total < 10000 ? 70 : 50;


    document.getElementById("totalSpent").innerText = "₹" + total;

    document.getElementById("totalTransactions").innerText = transactions;

    document.getElementById("avgTransaction").innerText = "₹" + avg;

    document.getElementById("healthScore").innerText = score;


    // Update charts
    pieChart.data.datasets[0].data =
        Object.values(categoryTotals);

    pieChart.update();


    barChart.data.datasets[0].data = [total];

    barChart.update();
}