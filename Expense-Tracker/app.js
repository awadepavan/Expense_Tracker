const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const storage = [];

const showMenu = () => {
    console.log("\nWelcome to the Expense Tracker Application:");
    console.log("1. ADD");
    console.log("2. LIST");
    console.log("3. UPDATE");
    console.log("4. DELETE");
    console.log("5. EXIT");

    rl.question("Choose a number: ", handleInput);
};

const handleInput = (option) => {
    switch(option.trim()) {
        case "1":
            addExpense();
            break;
        case "2":
            listExpenses();
            break;
        case "3":
            updateExpense();
            break;
        case "4":
            deleteExpense();
            break;
        case "5":
            console.log("Exiting Expense Tracker. Goodbye!");
            rl.close();
            break;
        default:
            console.log("Invalid option. Please choose a valid number.");
            showMenu();
    }
};

const addExpense = () => {
    rl.question("Enter Id,Date,Description,Amount (comma separated): ", (input) => {
        const parts = input.split(",");
        if(parts.length !== 4) {
            console.log("Invalid input format. Please enter exactly 4 values separated by commas.");
            return addExpense();
        }
        const [id, date, description, amount] = parts.map(p => p.trim());
        if(!id || !date || !description || !amount || isNaN(Number(amount))) {
            console.log("Invalid input values. Ensure Id, Date, Description are non-empty and Amount is a number.");
            return addExpense();
        }
        // Check if Id already exists
        if(storage.find(exp => exp.id === id)) {
            console.log(`Expense with Id ${id} already exists. Use Update option to modify.`);
            return showMenu();
        }
        storage.push({ id, date, description, amount: Number(amount) });
        console.log("Expense added successfully.");
        showMenu();
    });
};

const listExpenses = () => {
    if(storage.length === 0) {
        console.log("No expenses to display.");
    } else {
        console.log("\nExpenses:");
        storage.forEach((exp, index) => {
            console.log(`${index + 1}. Id: ${exp.id}, Date: ${exp.date}, Description: ${exp.description}, Amount: ${exp.amount}`);
        });
    }
    showMenu();
};

const updateExpense = () => {
    rl.question("Enter the Id of the expense to update: ", (id) => {
        const expense = storage.find(exp => exp.id === id.trim());
        if(!expense) {
            console.log(`Expense with Id ${id} not found.`);
            return showMenu();
        }
        rl.question(`Enter new Date (current: ${expense.date}): `, (date) => {
            rl.question(`Enter new Description (current: ${expense.description}): `, (description) => {
                rl.question(`Enter new Amount (current: ${expense.amount}): `, (amount) => {
                    if(date.trim()) expense.date = date.trim();
                    if(description.trim()) expense.description = description.trim();
                    if(amount.trim()) {
                        if(isNaN(Number(amount.trim()))) {
                            console.log("Amount must be a number. Update cancelled.");
                            return showMenu();
                        }
                        expense.amount = Number(amount.trim());
                    }
                    console.log("Expense updated successfully.");
                    showMenu();
                });
            });
        });
    });
};

const deleteExpense = () => {
    rl.question("Enter the Id of the expense to delete: ", (id) => {
        const index = storage.findIndex(exp => exp.id === id.trim());
        if(index === -1) {
            console.log(`Expense with Id ${id} not found.`);
            return showMenu();
        }
        storage.splice(index, 1);
        console.log("Expense deleted successfully.");
        showMenu();
    });
};

showMenu();
