function AddTaskButton({ onAddTask }) {
  const handleAddTask = () => {
    onAddTask("Nouvelle tâche");
  };

  return (
    <button className="btn-add" onClick={handleAddTask}>
      Ajouter une tâche
    </button>
  );
}

export default AddTaskButton;
