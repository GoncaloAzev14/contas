import React, { useState } from 'react';

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

export default BalanceInput;
