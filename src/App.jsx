import { useCallback, useEffect, useState } from "react";
import "./assets/styles/index.css";
import {
  AddTaskButton,
  DeleteTaskButton,
  Header,
  TaskList,
} from "./components";
import useTasks from "./hooks/useTasks";

function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    deleteLastUserTask,
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

  // Supprimer toutes les tâches terminées
  const handleDeleteCompleted = useCallback(() => {
    completedTasks.forEach((task) => deleteTask(task.id));
  }, [completedTasks, deleteTask]);

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

  const handleDragEnd = () => {
    // Reset drag state if needed
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl + Alt + N
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (currentFilter !== "pending") {
          setCurrentFilter("pending");
        }
        handleAddTask("Nouvelle tâche");
      }
      // Ctrl + Alt + Z
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        // Tenter de supprimer la dernière tâche créée par l'utilisateur
        const deleted = deleteLastUserTask();
        // Si aucune tâche utilisateur, supprimer la dernière tâche globalement
        if (!deleted && tasks.length > 0) {
          const lastTask = tasks[tasks.length - 1];
          deleteTask(lastTask.id);
        }
      }
      // Ctrl + Alt + P
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setCurrentFilter("pending");
      }
      // Ctrl + Alt + F
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setCurrentFilter("completed");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentFilter, handleAddTask, tasks, deleteTask, deleteLastUserTask]);

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
        {currentFilter === "completed" && (
          <DeleteTaskButton
            onDeleteAllCompleted={handleDeleteCompleted}
            onDeleteTask={deleteTask}
            onDragEnd={handleDragEnd}
          />
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
          onDragEnd={handleDragEnd}
        />
      </section>
    </>
  );
}

export default App;
