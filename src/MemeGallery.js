import React, { useState, useEffect } from "react";

const MemeGallery = ({ onUpdate }) => {
  const [gallery, setGallery] = useState([]);
  const [searchTerm] = useState("");
  const [sortBy] = useState("newest");

  useEffect(() => {
    const memes = JSON.parse(localStorage.getItem("memeGallery") || "[]");
    setGallery(memes);
  }, []);

  const handleDelete = (index) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
    localStorage.setItem("memeGallery", JSON.stringify(newGallery));
    onUpdate?.(); // ✅ Notifie le parent si la fonction est passée
  };

  const downloadMeme = (meme) => {
    const link = document.createElement("a");
    link.href = meme.image;
    link.download = `${meme.title || "meme"}-${meme.date}.png`;
    link.click();
  };

  const filteredAndSortedMemes = gallery
    .filter((meme) => {
      const allText = (meme.lines || [])
        .map((line) => line.text)
        .join(" ")
        .toLowerCase();
      return allText.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.date - a.date;
        case "oldest":
          return a.date - b.date;
        case "alphabetical":
          const aText =
            a.lines && a.lines[0] && a.lines[0].text ? a.lines[0].text : "";
          const bText =
            b.lines && b.lines[0] && b.lines[0].text ? b.lines[0].text : "";
          return aText.localeCompare(bText);
        default:
          return 0;
      }
    });

  return (
    <div
      style={{
        background: "var(--card-bg)",
        borderRadius: "var(--border-radius-lg)",
        boxShadow: "var(--shadow)",
        padding: "2rem",
        marginBottom: "2rem",
        width: "100%",
        maxWidth: 900,
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Galerie de mèmes
      </h2>
      {gallery.length === 0 && (
        <p style={{ textAlign: "center" }}>Aucun mème sauvegardé.</p>
      )}
      <div
        className="gallery-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {filteredAndSortedMemes.map((meme, idx) => (
          <div
            key={meme.date}
            className="gallery-card"
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "var(--shadow)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 220,
              maxWidth: 240,
            }}
          >
            <img
              src={meme.image}
              alt="meme"
              style={{ maxWidth: 180, borderRadius: 8, marginBottom: 8 }}
            />
            <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
              {new Date(meme.date).toLocaleString()}
            </div>
            <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
              }}
            >
              <button
                onClick={() => handleDelete(idx)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
            >
              Supprimer
            </button>
            <button
              onClick={() => downloadMeme(meme)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Télécharger 
            </button>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemeGallery;
