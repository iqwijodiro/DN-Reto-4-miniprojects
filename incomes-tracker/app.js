const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const form = document.querySelector('#form');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');



const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function showAlert (text) {
    const alert = document.querySelector('.alert')
    if (!alert) {
        const alertElement = document.createElement('p')
        alertElement.classList.add('alert')
        alertElement.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">${text}</span>
        `;
        const form = document.querySelector('#form');
        form.appendChild(alertElement)
        setTimeout(() => {
            alertElement.remove();
        }, 2000);
    }
}

// Add transaction
function addTransaction(evt) {
  evt.preventDefault();

  let selectedType;
  radioBtns.forEach( item => {
      if(item.checked) {
          return selectedType = item.value;
        }
    })
  
  if (text.value.trim() === '' || 
      amount.value.trim() === '' || 
      !selectedType) 
      {
        showAlert('Por favor complete todos los campos');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      type: selectedType,  
      amount: selectedType === 'outcome' ? amount.value * -1 
                                        : +amount.value
    };

    transactions.push(transaction);
    updateValues();

    addTransactionDOM(transaction);


    updateLocalStorage();

    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const item = document.createElement('li');
  // Get sign
  if (transaction.type === 'outcome') {
    item.classList.add('minus')
  } else {
    item.classList.add('plus')
  }

  item.innerHTML = `
    ${transaction.text}
    <span>
      ${transaction.amount}
    </span>
    <button class="delete-btn" onclick="removeTransaction(${
    transaction.id})">
      <i class="fas fa-trash"></i>
    </button>
  `;

  list.appendChild(item);
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  if (total < 0) {
    showAlert('Ya no posee fondos. Debe ' + Math.abs(total))
  }
  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;

}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
  list.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
}
const radioBtns = document.querySelectorAll('input[name="type"]');



init();

form.addEventListener('submit', addTransaction);


