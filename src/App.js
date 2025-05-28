import React, { useState, useEffect } from "react";
import MemeGenerator from "./MemeGenerator";
import MemeGallery from "./MemeGallery";
import "./App.css";

function App() {
  const [view, setView] = useState("generator");
  const [galleryCount, setGalleryCount] = useState(0);

  useEffect(() => {
    // Mettre à jour le nombre au démarrage
    updateGalleryCount();
    // Écouter les changements de stockage (optionnel si on modifie localStorage ailleurs)
    window.addEventListener("storage", updateGalleryCount);
    return () => window.removeEventListener("storage", updateGalleryCount);
  }, []);

  const updateGalleryCount = () => {
    const memes = JSON.parse(localStorage.getItem("memeGallery") || "[]");
    setGalleryCount(memes.length);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="main-title">Générateur de Mèmes</div>
        <div className="subtitle">
          Créez des mèmes hilarants en quelques clics !
        </div>
        <nav>
          <button onClick={() => setView("generator")}>+ Créateur</button>
          <button onClick={() => setView("gallery")}>
            👁 Galerie ({galleryCount})
          </button>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 32,
        }}
      >
        {view === "generator" ? (
          <MemeGenerator onSave={updateGalleryCount} />
        ) : (
          <MemeGallery onUpdate={updateGalleryCount} />
        )}
      </main>

      <footer
        className="orange-bg"
        style={{ textAlign: "center", padding: "1rem", marginTop: "2rem" }}
      >
        <p className="logo">MemeGenerator</p>
        <p>all rights reserved 2025</p>
      </footer>
    </div>
  );
}

export default App;
