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
      },
      {
        id: 2,
        text: "Éditer la tâche en cliquant sur le texte",
        completed: false,
      },
      {
        id: 3,
        text: "Sauver le monde... et finir le projet",
        completed: true,
      },
    ];
  });

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem("checklist-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    // Limiter le texte
    const limitedText = text.slice(0, MAX_CHARACTERS);
    const newTask = {
      id: Date.now(), // ID unique
      text: limitedText,
      completed: false,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask.id; // Retourne ID
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleTaskComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (id, newText) => {
    // Limiter le texte
    const limitedText = newText.slice(0, MAX_CHARACTERS);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: limitedText } : task
      )
    );
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
    toggleTaskComplete,
    editTask,
    getFilteredTasks,
    getPendingTasks,
    getCompletedTasks,
    reorderTasks,
  };
}

export default useTasks;
