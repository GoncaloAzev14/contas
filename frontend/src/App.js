import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_API_URL = 'http://localhost:4000/api/'; // Atualize essa URL para corresponder à sua API

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

                // Verifica se `data` é um array e se contém exatamente um objeto
                if (Array.isArray(data) && data.length === 1) {
                    const [total] = data; // Extrai o primeiro objeto do array
                    setId(total.id); // Assume que `total` possui uma propriedade `id`
                    setTotalValue(total.value); // Assume que `total` possui uma propriedade `value`
                } else {
                    console.error('Resposta inesperada da API:', data);
                    setTotalValue(0); // Define `totalValue` como 0 se a resposta for inesperada
                }
            } catch (error) {
                console.error('Erro ao buscar o total:', error);
            }
        };

        fetchTotal();
    }, []);

    // Fetch transactions from the database when the component mounts 
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(BASE_API_URL + 'transaction');
                const data = await response.json();
                setExpenses(data); // Atualiza `expenses` com os dados do backend
            } catch (error) {
                console.error('Erro ao buscar transações:', error);
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
                // Atualiza `totalValue` com o novo valor
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
                // Atualiza `expenses` com a nova transação
                setExpenses((prevExpenses) => [...prevExpenses, newTransaction]);
                // Atualiza `totalValue` com o novo total
                const newTotal = totalValue + newTransaction.value;
                setTotalValue(newTotal);
                // Atualiza o total na base de dados
                await updateTotalValue(newTotal);
            } else {
                console.error('Erro ao criar transação:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao criar transação:', error);
        }
    };

    const handleAddExpense = (expenseValue, description, date) => {
        if (expenseValue > 0) {
            const transactionData = {
                value: -expenseValue,
                date: date || new Date().toISOString(), // Usa a data escolhida ou a data atual como padrão
                description: description || 'Despesa',
            };
            createTransaction(transactionData);
        }
    };

    const handleAddBalance = (addValue, description, date) => {
        if (addValue > 0) {
            const transactionData = {
                value: addValue,
                date: date || new Date().toISOString(), // Usa a data escolhida ou a data atual como padrão
                description: description || 'Crédito',
            };
            createTransaction(transactionData);
        }
    };

    const handleChangeTotal = async (value) => {
        if (value >= 0) {
            // Atualiza `totalValue` e o total na base de dados
            await updateTotalValue(value);
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
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const handleSubmit = (event) => {
        event.preventDefault();
        const value = parseFloat(expenseValue);
        if (value > 0) {
            onAddExpense(value, description, date);
            setExpenseValue('');
            setDescription('');
            setDate(new Date().toISOString().slice(0, 10)); // Redefine a data para a data atual
        }
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="expense"
                value={expenseValue}
                onChange={(event) => setExpenseValue(event.target.value)}
                placeholder="Valor da despesa"
            />
            <input
                type="text"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição da despesa"
            />
            <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
            />
            <button type="submit">Adicionar Débito</button>
        </form>
    );
}

function BalanceInput({ onAddBalance }) {
    const [addValue, setAddValue] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

    const handleSubmit = (event) => {
        event.preventDefault();
        const value = parseFloat(addValue);
        if (value > 0) {
            onAddBalance(value, description, date);
            setAddValue('');
            setDescription('');
            setDate(new Date().toISOString().slice(0, 10)); // Redefine a data para a data atual
        }
    };

    return (
        <form className="balance-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="balance"
                value={addValue}
                onChange={(event) => setAddValue(event.target.value)}
                placeholder="Valor do crédito"
            />
            <input
                type="text"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição do crédito"
            />
            <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
            />
            <button type="submit">Adicionar Crédito</button>
        </form>
    );
}

function ChangeTotal({ onChangeTotal }) {
    const [value, setValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newValue = parseFloat(value);
        if (newValue >= 0) {
            onChangeTotal(newValue);
            setValue('');
        }
    };

    return (
        <form className="change-total-form" onSubmit={handleSubmit}>
            <input
                type="number"
                id="total"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Novo valor total"
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
