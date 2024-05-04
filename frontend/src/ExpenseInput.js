import React, { useState } from 'react';

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
                placeholder="Valor da débito"
            />
            <input
                type="text"
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Descrição da débito"
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

export default ExpenseInput;
