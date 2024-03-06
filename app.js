//? Selectors

const addBtn = document.getElementById("ekle-btn");
const incomeInput = document.getElementById("gelir-input");
const addForm = document.getElementById("ekle-formu");
const incomeTd = document.getElementById("geliriniz");
const expenseTd = document.getElementById("gideriniz");
const remainingTd = document.getElementById("kalan");
const remainingT = document.getElementById("kalanTh");

//& Variables

let income = 0;
let listOfExpense = [];

//  Add Form
addForm.addEventListener("submit", (e) => {
  e.preventDefault();
  income = income + Number(incomeInput.value);
  addForm.reset();
  // console.log(income)
  localStorage.setItem("income", income);
  calculateAndUpdate();
});

//Expense Form

const expenseForm = document.getElementById("harcama-formu");
const dateInput = document.getElementById("tarih");
const quantityInput = document.getElementById("miktar");
const expenseAreaInput = document.getElementById("harcama-alani");

const harcamaBody = document.getElementById("harcama-body");
const clearBtn = document.getElementById("temizle-btn");

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const yeniHarcama = {
    tarih: dateInput.value,
    miktar: quantityInput.value,
    alan: expenseAreaInput.value,
    id: new Date().getTime(),
  };

  // console.log(yeniHarcama)
  listOfExpense.push(yeniHarcama);
  // console.log(listOfExpense)
  localStorage.setItem("harcamalar", JSON.stringify(listOfExpense));
  harcamayiDomaYaz(yeniHarcama);

  expenseForm.reset();
  dateInput.valueAsDate = new Date();
  calculateAndUpdate();
});

const harcamayiDomaYaz = ({ id, miktar, tarih, alan }) => {
  const tr = document.createElement("tr");

  const appendTd = (content) => {
    const td = document.createElement("td");
    td.textContent = content;
    return td;
  };

  const createLastTd = () => {
    const td = document.createElement("td");
    const iElement = document.createElement("i");
    iElement.id = id;
    iElement.className = "fa-solid fa-trash-can text-danger";
    iElement.type = "button";
    td.appendChild(iElement);
    return td;
  };

  tr.append(appendTd(tarih), appendTd(alan), appendTd(miktar), createLastTd());

  harcamaBody.append(tr);
};

// Calculate and Update

const calculateAndUpdate = () => {
  const expenses = listOfExpense.reduce(
    (toplam, harcama) => toplam + Number(harcama.miktar),
    0
  );
  if (expenses > income) {
    remainingTd.style.color = "red";
    remainingT.style.color = "red";
  } 
   if (expenses < income) {
    remainingTd.style.color = "black";
    remainingT.style.color = "black";
  }

  expenseTd.textContent = expenses;
  incomeTd.textContent = income;
  remainingTd.textContent = income - expenses;
};

//? Event listeners

window.addEventListener("load", () => {
  income = Number(localStorage.getItem("income")) || 0;
  listOfExpense = JSON.parse(localStorage.getItem("harcamalar")) || [];

  listOfExpense.forEach((harcama) => {
    harcamayiDomaYaz(harcama);
  });

  incomeTd.textContent = income;

  calculateAndUpdate();
  dateInput.valueAsDate = new Date();
});

harcamaBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash-can")) {
    e.target.parentElement.parentElement.remove();
    const id = e.target.id;
    listOfExpense = listOfExpense.filter((harcama) => harcama.id != id);
    // console.log(listOfExpense)
    localStorage.setItem("harcamalar", JSON.stringify(listOfExpense));
  }
});

clearBtn.addEventListener("click", () => {
  if (confirm("All you data will be deleted.Do you want to continue?")) {
    listOfExpense = [];
    income = 0;
    harcamaBody.innerHTML = "";

    localStorage.removeItem("income");
    localStorage.removeItem("harcamalar");
    calculateAndUpdate();
  }
});
