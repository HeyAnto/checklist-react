import { useCallback, useEffect, useState } from "react";
import { MAX_CHARACTERS } from "../constants";

function useTasks() {
  const [tasks, setTasks] = useState(() => {
    // Charger localStorage
    const savedTasks = localStorage.getItem("checklist-tasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error);
      }
    }
    // Tâches défaut
    return [
      {
        id: 1,
        text: "Créer ça première tâche",
        completed: false,
        isDefault: true,
      },
      {
        id: 2,
        text: "Éditer la tâche en cliquant sur le texte",
        completed: false,
        isDefault: true,
      },
      {
        id: 3,
        text: "Sauver le monde... et finir le projet",
        completed: true,
        isDefault: true,
      },
    ];
  });

  const [userCreatedTasks, setUserCreatedTasks] = useState(() => {
    // Charger tâches utilisateur
    const savedUserTasks = localStorage.getItem("checklist-user-tasks");
    if (savedUserTasks) {
      try {
        return JSON.parse(savedUserTasks);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des tâches utilisateur:",
          error
        );
      }
    }
    return [];
  });

  // Historique annulation
  const [history, setHistory] = useState([]);
  // Historique rétablissement
  const [redoHistory, setRedoHistory] = useState([]);

  // Sauvegarder état
  const saveToHistory = (action, data) => {
    setHistory((prev) => [
      {
        action,
        data,
        tasks: [...tasks],
        userCreatedTasks: [...userCreatedTasks],
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9), // 10 dernières actions
    ]);
    // Vider l'historique redo
    setRedoHistory([]);
  };

  // Sauvegarde auto
  useEffect(() => {
    localStorage.setItem("checklist-tasks", JSON.stringify(tasks));
    localStorage.setItem(
      "checklist-user-tasks",
      JSON.stringify(userCreatedTasks)
    );
  }, [tasks, userCreatedTasks]);

  const addTask = (text) => {
    // Sauvegarder état
    saveToHistory("ADD_TASK", null);

    // Limiter texte
    const limitedText = text.slice(0, MAX_CHARACTERS);
    const newTask = {
      id: Date.now(), // ID unique
      text: limitedText,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    // Ajouter tâches utilisateur
    setUserCreatedTasks((prev) => [newTask.id, ...prev]);
    return newTask.id; // Retourner ID
  };

  const deleteTask = (id) => {
    // Sauvegarder état
    const taskToDelete = tasks.find((task) => task.id === id);
    saveToHistory("DELETE_TASK", taskToDelete);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    // Retirer tâches utilisateur
    setUserCreatedTasks((prev) => prev.filter((taskId) => taskId !== id));
  };

  const deleteLastUserTask = () => {
    if (userCreatedTasks.length > 0) {
      const lastUserTaskId = userCreatedTasks[0]; // Plus récent
      deleteTask(lastUserTaskId);
      return true;
    }
    return false;
  };

  const deleteAllTasks = () => {
    // Sauvegarder état
    saveToHistory("DELETE_ALL", null);

    setTasks([]);
    setUserCreatedTasks([]);
  };

  const toggleTaskComplete = (id) => {
    // Sauvegarder état
    const taskToToggle = tasks.find((task) => task.id === id);
    saveToHistory("TOGGLE_COMPLETE", {
      id,
      previousCompleted: taskToToggle?.completed,
    });

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newText) => {
    // Sauvegarder état
    const taskToEdit = tasks.find((task) => task.id === id);
    saveToHistory("EDIT_TASK", { id, previousText: taskToEdit?.text });

    // Limiter le texte
    const limitedText = newText.slice(0, MAX_CHARACTERS);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: limitedText } : task
      )
    );
  };

  // Fonction d'annulation
  const undoLastAction = () => {
    if (history.length === 0) return false;

    const lastAction = history[0];
    const { tasks: previousTasks, userCreatedTasks: previousUserTasks } =
      lastAction;

    // Sauvegarder dans l'historique redo
    setRedoHistory((prev) => [
      {
        action: lastAction.action,
        data: lastAction.data,
        tasks: [...tasks],
        userCreatedTasks: [...userCreatedTasks],
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9), // 10 dernières actions
    ]);

    // Restaurer l'état précédent
    setTasks(previousTasks);
    setUserCreatedTasks(previousUserTasks);

    // Retirer de l'historique
    setHistory((prev) => prev.slice(1));

    return true;
  };

  // Fonction de rétablissement
  const redoAction = () => {
    if (redoHistory.length === 0) return false;

    const actionToRedo = redoHistory[0];
    const { tasks: redoTasks, userCreatedTasks: redoUserTasks } = actionToRedo;

    // Sauvegarder dans l'historique
    setHistory((prev) => [
      {
        action: actionToRedo.action,
        data: actionToRedo.data,
        tasks: [...tasks],
        userCreatedTasks: [...userCreatedTasks],
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9),
    ]);

    // Restaurer l'état redo
    setTasks(redoTasks);
    setUserCreatedTasks(redoUserTasks);

    // Retirer de l'historique redo
    setRedoHistory((prev) => prev.slice(1));

    return true;
  };

  const getFilteredTasks = useCallback(
    (filter, searchTerm = "") => {
      let filteredTasks = tasks;

      // Filtre par statut
      if (filter === "pending") {
        filteredTasks = tasks.filter((task) => !task.completed);
      } else if (filter === "completed") {
        filteredTasks = tasks.filter((task) => task.completed);
      }

      // Filtre par recherche
      if (searchTerm) {
        filteredTasks = filteredTasks.filter((task) =>
          task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredTasks;
    },
    [tasks]
  );

  const getPendingTasks = useCallback(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );
  const getCompletedTasks = useCallback(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  // Réorganiser tâches
  const reorderTasks = (fromIndex, toIndex) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const [draggedTask] = newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, draggedTask);
      return newTasks;
    });
  };

  return {
    tasks,
    addTask,
    deleteTask,
    deleteLastUserTask,
    deleteAllTasks,
    undoLastAction,
    redoAction,
    toggleTaskComplete,
    editTask,
    getFilteredTasks,
    getPendingTasks,
    getCompletedTasks,
    reorderTasks,
  };
}

export default useTasks;
