import { useCallback, useState } from "react";
import {
  AddTaskButton,
  DeleteTaskButton,
  Header,
  TaskList,
} from "./components";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";
import useTasks from "./hooks/useTasks";

function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    deleteAllTasks,
    undoLastAction,
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
    // Réinitialiser ID édition
    if (newlyCreatedTaskId === taskId) {
      setNewlyCreatedTaskId(null);
    }
  };

  const handleDragEnd = () => {
    // Réinitialiser l'état de drag
  };

  // Raccourcis clavier
  useKeyboardShortcuts({
    currentFilter,
    setCurrentFilter,
    handleAddTask,
    undoLastAction,
    deleteAllTasks,
  });

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
