import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_API_URL = 'http://localhost:4000/api/'; // Update this URL to match your backend server URL

function App() {
    const [totalValue, setTotalValue] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [id, setId] = useState(null);

    // Fetch total from the database when the component mounts 
    useEffect(() => {
        const fetchTotal = async () => {
            try {
                const response = await fetch(BASE_API_URL + 'total');
                const data = await response.json();
                setId(data[0].id);
                // console.log("DATA.ID: " + data[0].id)
    
                // Verifica se `data` é um array e se contém exatamente um objeto
                if (Array.isArray(data) && data.length === 1) {
                    const [total] = data; // Extrai o primeiro objeto do array
                    setTotalValue(total.value); // Assume que `total` possui uma propriedade `value`
                } else {
                    console.error('Resposta inesperada da API: ', data);
                    // Caso contrário, defina `totalValue` como 0 ou um valor padrão
                    setTotalValue(0);
                }
            } catch (error) {
                console.error('Erro ao buscar o total:', error);
            }
        };
    
        fetchTotal();
    }, []);

    // console.log("TOTAL VALUE: " + totalValue)
    // console.log("ID: " + id)
    
    

    // Fetch transactions from the database when the component mounts 
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(BASE_API_URL + 'transaction');
                const data = await response.json();
                setExpenses(data); // Update expenses based on data from the backend
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const updateTotalValue = async (newTotalValue) => {
        try {
            const response = await fetch(BASE_API_URL + 'total', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, value: newTotalValue }), // Envia o novo valor total como JSON
            });
    
            if (response.ok) {
                // Atualize `totalValue` no estado com o novo valor
                setTotalValue(newTotalValue);
            } else {
                console.error('Erro ao atualizar o total:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao atualizar o total:', error);
        }
    };
    

    // Create a new transaction (either expense or balance) and update state
    const createTransaction = async (transactionData) => {
        try {
            const response = await fetch(BASE_API_URL + 'transaction', {
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
                updateTotalValue(newTransaction.value + totalValue)
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
            updateTotalValue(value);
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
                placeholder="Descrição de débito"
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
                placeholder="Descrição de crédito"
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
