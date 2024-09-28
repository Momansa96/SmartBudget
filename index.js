document.addEventListener('DOMContentLoaded', () => {
    const totalAmountInput = document.getElementById("budget-amount");
    const setBudgetButton = document.getElementById("set-budget-btn");
    const expenseTitleInput = document.getElementById("expense-title");
    const expenseAmountInput = document.getElementById("expense-amount");
    const errorMessage = document.getElementById("error-message");
    const expenseValue = document.getElementById("expense-value");
    const balanceValue = document.getElementById("balance-value");
    const expenseList = document.getElementById("expense-list");

    let tempAmount = 0;

    // Set Budget Functions
    setBudgetButton.addEventListener("click", () => {
        tempAmount = parseFloat(totalAmountInput.value);
        if (isNaN(tempAmount) || tempAmount <= 0) {
            errorMessage.classList.remove("hidden");
        } else {
            errorMessage.classList.add("hidden");
            document.getElementById("budget-value").innerText = `${Math.floor(tempAmount)} FCFA`;
            balanceValue.innerText = `${Math.floor(tempAmount)} FCFA`;
            totalAmountInput.value = "";
        }
    });

    // Disable edit and delete button function
    const disableButtons = (bool) => {
        const editButtons = document.getElementsByClassName("edit");
        Array.from(editButtons).forEach((element) => {
            element.disabled = bool;
        });
    };

    // Modify list elements function
    const modifyElement = (element, edit = false) => {
        const parentDiv = element.closest(".expense-item");
        const currentBalance = parseFloat(balanceValue.innerText.replace('FCFA', '') || 0);
        const currentExpense = parseFloat(expenseValue.innerText.replace('FCFA', '') || 0);
        const parentAmount = parseFloat(parentDiv.querySelector(".amount").innerText.replace('FCFA', '') || 0);

        if (edit) {
            const parentText = parentDiv.querySelector(".product").innerText;
            expenseTitleInput.value = parentText;
            expenseAmountInput.value = parentAmount;
            disableButtons(true);
        }

        balanceValue.innerText = `FCFA ${Math.floor(currentBalance + parentAmount)}`;
        expenseValue.innerText = `FCFA ${Math.floor(currentExpense - parentAmount)}`;
        parentDiv.remove();
    };

    // Create list function
    const listCreator = (expenseName, expenseValue) => {
        const subListContent = document.createElement("div");
        subListContent.classList.add("expense-item");
        subListContent.innerHTML = `
            <p class="product">${expenseName}</p>
            <p class="amount">${Math.floor(expenseValue)} FCFA</p>
            <div class="actions">
                <button class="edit" aria-label="Modifier"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete" aria-label="Supprimer"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;

        const editButton = subListContent.querySelector(".edit");
        editButton.addEventListener("click", () => {
            modifyElement(editButton, true);
        });

        const deleteButton = subListContent.querySelector(".delete");
        deleteButton.addEventListener("click", () => {
            modifyElement(deleteButton);
        });

        expenseList.appendChild(subListContent);
    };

    // Add expenses function
    document.getElementById("add-expense-btn").addEventListener("click", () => {
        if (!expenseAmountInput.value || !expenseTitleInput.value) {
            errorMessage.classList.remove("hidden");
            return false;
        }
        errorMessage.classList.add("hidden");
        disableButtons(false);

        const expenditure = parseFloat(expenseAmountInput.value);
        const currentExpenditure = parseFloat(expenseValue.innerText.replace('FCFA', '') || 0);
        const newTotalExpenditure = currentExpenditure + expenditure;
        expenseValue.innerText = `${Math.floor(newTotalExpenditure)} FCFA`;

        const totalBalance = tempAmount - newTotalExpenditure;
        balanceValue.innerText = `${Math.floor(totalBalance)} FCFA`;

        listCreator(expenseTitleInput.value, expenseAmountInput.value);

        expenseTitleInput.value = "";
        expenseAmountInput.value = "";
    });
});
