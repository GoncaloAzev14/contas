import React, { useState, useEffect } from 'react';
import './App.css';
import ExpensesList from './ExpensesList';
import BalanceInput from './BalanceInput';
import ChangeTotal from './ChangeTotal';
import ExpenseInput from './ExpenseInput';

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
                description: description || 'Débito',
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

    const handleUpdateTransaction = async (updatedTransaction) => {
        try {
            const response = await fetch(BASE_API_URL + 'transaction/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: updatedTransaction.id, value: updatedTransaction.value, date: updatedTransaction.date, description: updatedTransaction.description}),
            });

            if (response.ok) {
                const updatedExpenses = expenses.map((expense) =>
                    expense.id === updatedTransaction.id ? updatedTransaction : expense
                );
                setExpenses(updatedExpenses);
            } else {
                console.error('Error updating transaction:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
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

            <ExpensesList expenses={expenses} onUpdateTransaction={handleUpdateTransaction} />
        </div>
    );
}

export default App;
