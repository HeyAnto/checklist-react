import { useState } from "react";
import iconDelete from "../assets/icons/icon-delete.svg";

function DeleteTaskButton({ onDeleteAllCompleted, onDeleteTask, onDragEnd }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDeleteAll = () => {
    onDeleteAllCompleted();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData("text/plain");

    if (taskId && onDeleteTask) {
      // Convertir en nombre
      onDeleteTask(Number(taskId));
    }

    // Fin du drag
    if (onDragEnd) {
      onDragEnd();
    }
  };
  return (
    <button
      className={`btn-delete ${isDragOver ? "drag-over" : ""}`}
      onClick={handleDeleteAll}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver ? (
        <img src={iconDelete} alt="Déposer pour supprimer" />
      ) : (
        "Supprimer toutes les tâches"
      )}
    </button>
  );
}

export default DeleteTaskButton;
