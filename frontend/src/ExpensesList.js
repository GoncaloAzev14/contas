import React, { useState } from 'react';
import ExpenseDetailsPopup from './ExpenseDetailsPopup';

function ExpensesList({ expenses, onUpdateTransaction }) {
    const [selectedExpense, setSelectedExpense] = useState(null);

    const handleExpenseClick = (expense) => {
        setSelectedExpense(expense);
    };

    const handleClosePopup = () => {
        setSelectedExpense(null);
    };

    return (
        <div>
            <ul className="expenses-list">
                {expenses.map((expense, index) => (
                    <li key={index}>
                        <button onClick={() => handleExpenseClick(expense)}>
                            {expense.value} - {expense.description} on {new Date(expense.date).toLocaleDateString()}
                        </button>
                    </li>
                ))}
            </ul>
            {selectedExpense && (
                <ExpenseDetailsPopup
                    expense={selectedExpense}
                    onUpdateTransaction={onUpdateTransaction}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
}

export default ExpensesList;
