import { useState } from "react";
import iconHelp from "../assets/icons/icon-help.svg";
import iconSearch from "../assets/icons/icon-search.svg";

function Header({
  remainingTasks,
  completedTasks,
  currentFilter,
  setCurrentFilter,
  searchTerm,
  setSearchTerm,
}) {
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const totalPending = remainingTasks.length;
  const totalCompleted = completedTasks.length;

  const toggleHelpMenu = () => {
    setShowHelpMenu(!showHelpMenu);
  };

  return (
    <header className="app-max-width flex flex-column gap-20">
      <div className="flex flex-column">
        <h1>Checklist</h1>
        <p className="t-grey-3">
          {totalPending}{" "}
          {totalPending <= 1 ? "tâche restante" : "tâches restantes"}
        </p>
      </div>

      <div className="search-container flex gap-4">
        <div className="search">
          <img src={iconSearch} alt="Icone de recherche" />
          <input
            className="input-search"
            type="text"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="help-container">
          <button className="btn-help" onClick={toggleHelpMenu}>
            <img src={iconHelp} alt="Icone d'aide" />
          </button>
          {showHelpMenu && (
            <div className="help-menu">
              <div className="help-menu-header">
                <h3>Raccourcis disponibles</h3>
                <button
                  className="help-close"
                  onClick={() => setShowHelpMenu(false)}
                >
                  ×
                </button>
              </div>
              <div className="help-content">
                <div className="help-section">
                  <h4>Édition des tâches</h4>
                  <div className="help-item">
                    <span className="help-key">Clic</span>
                    <span>Éditer une tâche</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Entrée</span>
                    <span>Sauvegarder</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Échap</span>
                    <span>Annuler</span>
                  </div>
                </div>
                <div className="help-section">
                  <h4>Actions</h4>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + N</span>
                    <span>Nouvelle tâche</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + Z</span>
                    <span>Annuler</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + Y</span>
                    <span>Rétablir</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + P</span>
                    <span>Filtrer : En cours</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + F</span>
                    <span>Filtrer : Terminé</span>
                  </div>
                  <div className="help-item">
                    <span className="help-key">Ctrl + Alt + R</span>
                    <span>Reset</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="action-container flex gap-20">
        <button
          className={`btn-action btn-blue ${
            currentFilter === "pending" ? "active" : ""
          }`}
          onClick={() => setCurrentFilter("pending")}
        >
          En cours ({totalPending})
        </button>
        <button
          className={`btn-action btn-green ${
            currentFilter === "completed" ? "active" : ""
          }`}
          onClick={() => setCurrentFilter("completed")}
        >
          Terminé ({totalCompleted})
        </button>
      </div>
    </header>
  );
}

export default Header;
