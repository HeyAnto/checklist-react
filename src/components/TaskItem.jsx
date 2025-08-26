import { useEffect, useRef, useState } from "react";
import iconCheck from "../assets/icons/icon-check.svg";
import iconCross from "../assets/icons/icon-cross.svg";
import { MAX_CHARACTERS } from "../constants";

function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  shouldStartEditing,
  onEditStart,
  onEditEnd,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [shake, setShake] = useState(false);
  const textareaRef = useRef(null);

  // Compteur de caractères
  const remainingChars = MAX_CHARACTERS - editText.length;
  const isOverLimit = editText.length > MAX_CHARACTERS;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      // Fix Firefox DOM
      setTimeout(() => {
        if (textareaRef.current) {
          adjustTextareaHeight();
          textareaRef.current.focus();
          textareaRef.current.select();
        }
      }, 0);
    }
  }, [isEditing]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      // Reset hauteur
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "1px";

      // Force Firefox reflow
      textareaRef.current.offsetHeight;

      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  };

  const handleTextChange = (e) => {
    setEditText(e.target.value);
    adjustTextareaHeight();
  };

  // Auto-édition nouvelles tâches
  useEffect(() => {
    if (shouldStartEditing) {
      setIsEditing(true);
      setEditText(task.text);
      if (onEditStart) {
        onEditStart(task.id);
      }
    }
  }, [shouldStartEditing, task.text, task.id, onEditStart]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
    if (onEditStart) {
      onEditStart(task.id);
    }
  };

  const handleSaveEdit = () => {
    if (isOverLimit) {
      setShake(false);
      setTimeout(() => setShake(true), 10); // Rejoue l'animation
      return;
    }
    if (editText.trim() && editText.trim() !== task.text) {
      onEdit(task.id, editText.trim());
    }
    setIsEditing(false);
    if (onEditEnd) {
      onEditEnd();
    }
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
    if (onEditEnd) {
      onEditEnd();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isOverLimit) {
        handleSaveEdit();
      } else {
        setShake(false);
        setTimeout(() => setShake(true), 10);
      }
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleBlur = () => {
    handleSaveEdit();
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <div className="task-edit-container">
          <textarea
            ref={textareaRef}
            className={`task-text ${isOverLimit ? "over-limit" : ""}`}
            value={editText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            maxLength={MAX_CHARACTERS + 30}
            style={{
              resize: "none",
              overflow: "hidden",
              height: "auto",
              margin: 0,
              padding: 0,
              border: "none",
              outline: "none",
              background: "transparent",
              color: "inherit",
              cursor: "text",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          />
          <div
            className={`char-counter ${isOverLimit ? "over-limit" : ""} ${
              shake ? "shake" : ""
            }`}
          >
            {remainingChars < 20 ? remainingChars : ""}
          </div>
        </div>
      ) : (
        <span
          className={`task-text ${task.completed ? "task-completed" : ""}`}
          onClick={handleStartEdit}
        >
          {task.text}
        </span>
      )}

      <div className="flex gap-10">
        <button
          className={`btn-task btn-green ${
            task.completed ? "task-completed-btn" : "task-pending-btn"
          }`}
          onClick={() => onToggleComplete(task.id)}
          title={
            task.completed ? "Marquer comme en cours" : "Marquer comme terminé"
          }
        >
          <img src={iconCheck} alt="Icone de validation" />
        </button>
        <button
          className="btn-task btn-red"
          onClick={() => onDelete(task.id)}
          title="Supprimer la tâche"
        >
          <img src={iconCross} alt="Icone de suppression" />
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
