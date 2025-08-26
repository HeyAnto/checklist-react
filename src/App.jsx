import { useCallback, useEffect, useState } from "react";
import "./assets/styles/index.css";
import { AddTaskButton, Header, TaskList } from "./components";
import useTasks from "./hooks/useTasks";

function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    editTask,
    getFilteredTasks,
    getPendingTasks,
    getCompletedTasks,
    reorderTasks,
  } = useTasks();

  const [currentFilter, setCurrentFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [newlyCreatedTaskId, setNewlyCreatedTaskId] = useState(null);

  const pendingTasks = getPendingTasks();
  const completedTasks = getCompletedTasks();
  const filteredTasks = getFilteredTasks(currentFilter, searchTerm);

  const handleAddTask = useCallback(
    (text) => {
      const newTaskId = addTask(text);
      setNewlyCreatedTaskId(newTaskId);
      // Afficher tâches en cours
      if (currentFilter !== "pending") {
        setCurrentFilter("pending");
      }
    },
    [addTask, currentFilter]
  );

  const handleTaskEditStart = (taskId) => {
    // Reset ID édition
    if (newlyCreatedTaskId === taskId) {
      setNewlyCreatedTaskId(null);
    }
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Alt + N : Nouvelle tâche
      if (e.ctrlKey && e.altKey && e.key === "n") {
        e.preventDefault();
        if (currentFilter !== "pending") {
          setCurrentFilter("pending");
        }
        handleAddTask("Nouvelle tâche");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentFilter, handleAddTask]);

  return (
    <>
      <Header
        remainingTasks={pendingTasks}
        completedTasks={completedTasks}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <section className="app-max-width flex flex-column gap-50">
        {currentFilter === "pending" && (
          <AddTaskButton onAddTask={handleAddTask} />
        )}
        <TaskList
          tasks={filteredTasks}
          allTasks={tasks}
          onToggleComplete={toggleTaskComplete}
          onDelete={deleteTask}
          onEdit={editTask}
          newlyCreatedTaskId={newlyCreatedTaskId}
          onTaskEditStart={handleTaskEditStart}
          onReorderTasks={reorderTasks}
          searchTerm={searchTerm}
        />
      </section>
    </>
  );
}

export default App;
