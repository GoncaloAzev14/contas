import React, { useState } from 'react';
import './ExpenseDetailsPopup.css';

function ExpenseDetailsPopup({ expense, onClose, onUpdateTransaction, onDeleteData }) {
    const [isEditing, setIsEditing] = useState(false); // Estado para controlar se o usuário está editando a transação
    const [updatedExpense, setUpdatedExpense] = useState({
        ...expense,
        date: new Date(expense.date).toISOString().split('T')[0] // Formata a data para 'yyyy-MM-dd'
    }); // Estado local para armazenar a transação atualizada
    

    const handleEditClick = () => {
        setIsEditing(true); // Define isEditing como true quando o usuário clicar em "Editar"
    };

    const handleCancelClick = () => {
        setIsEditing(false); // Define isEditing como false quando o usuário clicar em "Cancelar"
        // Reverte os valores editados para os valores originais da despesa
        setUpdatedExpense({ ...expense });
    };

    const handleConfirmClick = () => {
        onUpdateTransaction(updatedExpense); // Chama a função para atualizar a transação com os dados atualizados
        onClose(); // Fecha o popup após a edição
    };

    const handleUndoClick = () => {
        onDeleteData(expense.id); // Chama a função para excluir a transação
        onClose(); // Fecha o popup após a exclusão
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedExpense(prevExpense => ({
            ...prevExpense,
            [name]: value
        }));
    };

    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>Detalhes da Despesa</h2>
                {/* Mostra os campos de edição somente quando o usuário clicar em "Editar" */}
                {isEditing ? (
                    <>
                        <p>
                            Valor: 
                            <input 
                                type="number" 
                                name="value" 
                                value={updatedExpense.value} 
                                onChange={handleChange} 
                            />
                        </p>
                        <p>
                            Descrição: 
                            <input 
                                type="text" 
                                name="description" 
                                value={updatedExpense.description} 
                                onChange={handleChange} 
                            />
                        </p>
                        <p>
                            Data: 
                            <input 
                                type="date" 
                                name="date" 
                                value={updatedExpense.date} 
                                onChange={handleChange} 
                            />
                        </p>
                        {/* Botões para confirmar ou cancelar a edição */}
                        <button onClick={handleConfirmClick}>Confirmar</button>
                        <button onClick={handleCancelClick}>Cancelar</button>
                    </>
                ) : (
                    <>
                        <p>Valor: {expense.value.toFixed(2)}</p>
                        <p>Descrição: {expense.description}</p>
                        <p>Data: {new Date(expense.date).toLocaleDateString()}</p>
                        {/* Botão para editar a transação */}
                        <button onClick={handleEditClick}>Editar</button>
                        <button onClick={handleUndoClick}>Desfazer</button>
                    </>
                )}
                <button className="close-button" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}

export default ExpenseDetailsPopup;
