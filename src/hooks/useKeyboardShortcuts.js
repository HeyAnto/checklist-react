import { useEffect } from "react";

function useKeyboardShortcuts({
  currentFilter,
  setCurrentFilter,
  handleAddTask,
  undoLastAction,
  redoAction,
  deleteAllTasks,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Vérifier que Ctrl + Alt sont pressés
      if (!e.ctrlKey || !e.altKey) return;

      const key = e.key.toLowerCase();

      switch (key) {
        case "n":
          e.preventDefault();
          if (currentFilter !== "pending") {
            setCurrentFilter("pending");
          }
          handleAddTask("Nouvelle tâche");
          break;
        case "z":
          e.preventDefault();
          undoLastAction();
          break;
        case "y":
          e.preventDefault();
          redoAction();
          break;
        case "c":
          e.preventDefault();
          setCurrentFilter("pending");
          break;
        case "f":
          e.preventDefault();
          setCurrentFilter("completed");
          break;
        case "r":
          e.preventDefault();
          deleteAllTasks();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    currentFilter,
    setCurrentFilter,
    handleAddTask,
    undoLastAction,
    redoAction,
    deleteAllTasks,
  ]);
}

export default useKeyboardShortcuts;
