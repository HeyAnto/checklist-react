import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  allTasks,
  onToggleComplete,
  onDelete,
  onEdit,
  newlyCreatedTaskId,
  onTaskEditStart,
  onReorderTasks,
  searchTerm,
  onDragEnd,
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Drag désactivé
  const isDragDisabled = searchTerm.trim() !== "" || editingTaskId !== null;

  // Réinitialiser draggedIndex
  useEffect(() => {
    setDraggedIndex(null);
  }, [tasks.length]);

  const handleTaskEditStart = (taskId) => {
    setEditingTaskId(taskId);
    onTaskEditStart(taskId);
  };

  const handleTaskEditEnd = () => {
    setEditingTaskId(null);
  };

  const handleDragStart = (e, index) => {
    if (isDragDisabled) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const taskId = tasks[index].id;
    e.dataTransfer.setData("text/plain", taskId);

    const handleGlobalDragEnd = () => {
      setDraggedIndex(null);
      document.removeEventListener("dragend", handleGlobalDragEnd);
    };
    document.addEventListener("dragend", handleGlobalDragEnd);
  };

  const handleDragOver = (e) => {
    if (isDragDisabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    if (isDragDisabled) return;
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const draggedTask = tasks[draggedIndex];
      const targetTask = tasks[dropIndex];
      const draggedTaskIndex = allTasks.findIndex(
        (task) => task.id === draggedTask.id
      );
      const targetTaskIndex = allTasks.findIndex(
        (task) => task.id === targetTask.id
      );

      onReorderTasks(draggedTaskIndex, targetTaskIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  if (tasks.length === 0) {
    return (
      <div
        className="flex flex-column gap-20 empty-state"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <p className="t-grey-3">Aucune tâche à afficher</p>
      </div>
    );
  }

  return (
    <div className="flex flex-column task-list-container">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          draggable={!isDragDisabled}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`task-drag-item ${
            draggedIndex === index ? "dragging" : ""
          } ${isDragDisabled ? "drag-disabled" : ""}`}
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <TaskItem
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            shouldStartEditing={newlyCreatedTaskId === task.id}
            onEditStart={handleTaskEditStart}
            onEditEnd={handleTaskEditEnd}
          />
        </div>
      ))}
    </div>
  );
}

export default TaskList;
