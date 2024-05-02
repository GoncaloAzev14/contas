import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_API_URL = 'http://localhost:4000/api/transaction'; // Update this URL to match your backend server URL

function App() {
    const [totalValue, setTotalValue] = useState(0);
    const [expenses, setExpenses] = useState([]);

    // Fetch transactions from the backend when the component mounts 
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(BASE_API_URL);
                const data = await response.json();
                setExpenses(data); // Update expenses based on data from the backend
                const total = data.reduce((sum, transaction) => sum + transaction.value, 0);
                setTotalValue(total); // Calculate the total value from transactions
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    // Create a new transaction (either expense or balance) and update state
    const createTransaction = async (transactionData) => {
        try {
            const response = await fetch(BASE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (response.ok) {
                const newTransaction = await response.json();
                // Update state with the new transaction
                setExpenses((prevExpenses) => [...prevExpenses, newTransaction]);
                setTotalValue((prevTotal) => prevTotal + newTransaction.value);
            } else {
                console.error('Error creating transaction:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const handleAddExpense = (expenseValue, description) => {
        if (expenseValue > 0) {
            const transactionData = {
                value: -expenseValue,
                date: new Date().toISOString(),
                description, // Use the provided description
            };
            createTransaction(transactionData);
        }
    };

    const handleAddBalance = (addValue, description) => {
        if (addValue > 0) {
            const transactionData = {
                value: +addValue,
                date: new Date().toISOString(),
                description, // Use the provided description
            };
            createTransaction(transactionData);
        }
    };

    const handleChangeTotal = (value) => {
        if (value >= 0) {
            setTotalValue(value);
            // Optional: Add logic to handle updating the total on the backend if necessary.
        }
    };

    return (
        <div className="app-container">
            <div className="total-display">
                <span className="total-label">Saldo:</span>
                <span className="total-value">{totalValue.toFixed(2)}</span>
            </div>

            <ExpenseInput onAddExpense={handleAddExpense} />

            <BalanceInput onAddBalance={handleAddBalance} />

            <ChangeTotal onChangeTotal={handleChangeTotal} />

            <ExpensesList expenses={expenses} />
        </div>
    );
}

function ExpenseInput({ onAddExpense }) {
    const [expenseValue, setExpenseValue] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const value = parseFloat(expenseValue);
        if (value > 0) {
            onAddExpense(value, description);
            setExpenseValue('');
            setDescription('');
        }
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="expense"
                value={expenseValue}
                onChange={(event) => setExpenseValue(event.target.value)}
            />
            <input
                type="text"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição da despesa"
            />
            <button type="submit">Adicionar Débito</button>
        </form>
    );
}

function BalanceInput({ onAddBalance }) {
    const [addValue, setAddValue] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const value = parseFloat(addValue);
        if (value > 0) {
            onAddBalance(value, description);
            setAddValue('');
            setDescription('');
        }
    };

    return (
        <form className="balance-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="balance"
                value={addValue}
                onChange={(event) => setAddValue(event.target.value)}
            />
            <input
                type="text"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição do crédito"
            />
            <button type="submit">Adicionar Crédito</button>
        </form>
    );
}

function ChangeTotal({ onChangeTotal }) {
    const [value, setTotalValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newValue = parseFloat(value);
        if (newValue >= 0) {
            onChangeTotal(newValue);
            setTotalValue('');
        }
    };

    return (
        <form className="change-total-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="total"
                value={value}
                onChange={(event) => setTotalValue(event.target.value)}
            />
            <button type="submit">Alterar Total</button>
        </form>
    );
}

function ExpensesList({ expenses }) {
    return (
        <ul className="expenses-list">
            {expenses.map((expense, index) => (
                <li key={index}>
                    {expense.value.toFixed(2)} - {expense.description} on {new Date(expense.date).toLocaleDateString()}
                </li>
            ))}
        </ul>
    );
}

export default App;
