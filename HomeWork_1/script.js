let buyList = [
    { id: 1, name: "Помідори", amount: 2, isBought: true },
    { id: 2, name: "Печиво", amount: 2, isBought: false },
    { id: 3, name: "Сир", amount: 1, isBought: false }
];

const productList = document.getElementById('product-list');
const leftStats = document.getElementById('left-stats');
const boughtStats = document.getElementById('bought-stats');
const inputAdd = document.getElementById('new-item-input');
const buttonAdd = document.getElementById('add-btn');

//головна функція відмальовки
function updateUI() {
    productList.innerHTML = '';
    leftStats.innerHTML = '';
    boughtStats.innerHTML = '';

    buyList.forEach(function(item) {
        const li = document.createElement('li');
        li.className = 'list-item';
        li.setAttribute('data-id', item.id); 

        if (item.isBought) {
            li.classList.add('is-bought'); 
            li.innerHTML = `
                <span class="prod-name">${item.name}</span>
                <div class="amount-block">
                    <span class="count box">${item.amount}</span>
                </div>
                <div class="action-btns">
                    <button class="status-btn return-btn" data-tooltip="Повернути">Не куплено</button>
                </div>
            `;
        } else {
            let minusBtnClass = item.amount === 1 ? 'circle-btn minus-btn disabled' : 'circle-btn minus-btn';
            li.innerHTML = `
                <span class="prod-name edit-name" data-tooltip="Редагувати назву">${item.name}</span>
                <div class="amount-block">
                    <button class="${minusBtnClass}" data-tooltip="Менше">-</button>
                    <span class="count">${item.amount}</span>
                    <button class="circle-btn plus-btn" data-tooltip="Більше">+</button>
                </div>
                <div class="action-btns">
                    <button class="status-btn buy-btn" data-tooltip="Купив">Куплено</button>
                    <button class="circle-btn del-btn" data-tooltip="Прибрати">✖</button>
                </div>
            `;
        }
        
        productList.appendChild(li);

        //права колонка статистики
        let statHtml = `
            <span class="product-item ${item.isBought ? 'crossed' : ''}">
                ${item.name}
                <span class="amount">${item.amount}</span>
            </span>
            `;
        
        if (item.isBought) {
            boughtStats.innerHTML += statHtml;
        } else {
            leftStats.innerHTML += statHtml;
        }
    });
}

//додавання товару
function addNewItem() {
    const newItemName = inputAdd.value.trim(); 
    if (newItemName !== '') {
        buyList.push({
            id: Date.now(), 
            name: newItemName,
            amount: 1, 
            isBought: false
        });
        inputAdd.value = ''; 
        inputAdd.focus(); 
        updateUI(); 
    }
}

buttonAdd.addEventListener('click', addNewItem);
inputAdd.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') addNewItem();
});

productList.addEventListener('click', function(event) {
    const listItem = event.target.closest('.list-item');
    if (!listItem) return; 
    
    const itemId = Number(listItem.getAttribute('data-id'));
    const item = buyList.find(i => i.id === itemId);

    //видалення
    if (event.target.classList.contains('del-btn')) {
        buyList = buyList.filter(i => i.id !== itemId);
        updateUI();
    }

    //зміна статусу
    if (event.target.classList.contains('buy-btn') || event.target.classList.contains('return-btn')) {
        item.isBought = !item.isBought; 
        updateUI();
    }

    //плюс
    if (event.target.classList.contains('plus-btn')) {
        item.amount += 1;
        updateUI();
    }

    //мінус
    if (event.target.classList.contains('minus-btn')) {
        if (item.amount > 1) {
            item.amount -= 1;
            updateUI();
        }
    }

    //редагування назви
    if (event.target.classList.contains('edit-name')) {
        const spanElement = event.target;
        
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'prod-edit';
        editInput.value = item.name;
        
        spanElement.replaceWith(editInput);
        editInput.focus();

        function saveEditedName() {
            const newName = editInput.value.trim();
            if (newName !== '') {
                item.name = newName;
            }
            updateUI();
        }

        editInput.addEventListener('blur', saveEditedName);
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEditedName();
        });
    }
});

updateUI();