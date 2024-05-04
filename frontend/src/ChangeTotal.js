import React, { useState } from 'react';

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

export default ChangeTotal;
