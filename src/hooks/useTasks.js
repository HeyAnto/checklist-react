import { useEffect, useState } from "react";

// Limite de caractères
const MAX_CHARACTERS = 80;

function useTasks() {
  const [tasks, setTasks] = useState(() => {
    // Chargement localStorage
    const savedTasks = localStorage.getItem("checklist-tasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error);
      }
    }
    // Tâches par défaut
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
    // Charger la liste des tâches créées par l'utilisateur
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

  // Historique pour l'annulation
  const [history, setHistory] = useState([]);

  // Sauvegarder l'état actuel avant une action
  const saveToHistory = (action, data) => {
    setHistory((prev) => [
      {
        action,
        data,
        tasks: [...tasks],
        userCreatedTasks: [...userCreatedTasks],
        timestamp: Date.now(),
      },
      ...prev.slice(0, 9), // Garder seulement les 10 dernières actions
    ]);
  };

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem("checklist-tasks", JSON.stringify(tasks));
    localStorage.setItem(
      "checklist-user-tasks",
      JSON.stringify(userCreatedTasks)
    );
  }, [tasks, userCreatedTasks]);

  const addTask = (text) => {
    // Sauvegarder l'état avant l'action
    saveToHistory("ADD_TASK", null);

    // Limiter le texte
    const limitedText = text.slice(0, MAX_CHARACTERS);
    const newTask = {
      id: Date.now(), // ID unique
      text: limitedText,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    // Ajouter à la liste des tâches créées par l'utilisateur
    setUserCreatedTasks((prev) => [newTask.id, ...prev]);
    return newTask.id; // Retourne ID
  };

  const deleteTask = (id) => {
    // Sauvegarder l'état avant l'action
    const taskToDelete = tasks.find((task) => task.id === id);
    saveToHistory("DELETE_TASK", taskToDelete);

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    // Retirer de la liste des tâches utilisateur
    setUserCreatedTasks((prev) => prev.filter((taskId) => taskId !== id));
  };

  const deleteLastUserTask = () => {
    if (userCreatedTasks.length > 0) {
      const lastUserTaskId = userCreatedTasks[0]; // Le premier dans la liste = le plus récent
      deleteTask(lastUserTaskId);
      return true;
    }
    return false;
  };

  const deleteAllTasks = () => {
    // Sauvegarder l'état avant l'action
    saveToHistory("DELETE_ALL", null);

    setTasks([]);
    setUserCreatedTasks([]);
  };

  const toggleTaskComplete = (id) => {
    // Sauvegarder l'état avant l'action
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
    // Sauvegarder l'état avant l'action
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

    // Restaurer l'état précédent
    setTasks(previousTasks);
    setUserCreatedTasks(previousUserTasks);

    // Retirer cette action de l'historique
    setHistory((prev) => prev.slice(1));

    return true;
  };

  const getFilteredTasks = (filter, searchTerm = "") => {
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
  };

  const getPendingTasks = () => tasks.filter((task) => !task.completed);
  const getCompletedTasks = () => tasks.filter((task) => task.completed);

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
    toggleTaskComplete,
    editTask,
    getFilteredTasks,
    getPendingTasks,
    getCompletedTasks,
    reorderTasks,
  };
}

export default useTasks;
