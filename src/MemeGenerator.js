import React, { useRef, useState, useEffect } from "react";
import './MemeGenerator.css'; // Assure-toi d'importer le fichier CSS

const defaultLine = () => ({
  text: "",
  size: 40,
  color: "#ffffff",
  stroke: "#000000",
  align: "center",
  x: 200,
  y: 60,
  font: "Impact",
  emoji: "",
});

const MemeGenerator = () => {
  const [image, setImage] = useState(null);
  const [setFile] = useState(null);
  const [lines, setLines] = useState([defaultLine()]);
  const [selectedLine, setSelectedLine] = useState(0);
  const canvasRef = useRef(null);

  // Mise à jour du canvas à chaque changement
  useEffect(() => {
    drawMeme();
    // eslint-disable-next-line
  }, [image, lines, selectedLine]);

  const drawMeme = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
      const img = new window.Image();
      img.src = image;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        lines.forEach((line, idx) => {
          ctx.font = `${line.size}px ${line.font}`;
          ctx.textAlign = line.align;
          ctx.fillStyle = line.color;
          ctx.strokeStyle = line.stroke;
          ctx.lineWidth = 2;
          ctx.save();
          ctx.beginPath();
          ctx.fillText(line.text + (line.emoji || ""), line.x, line.y);
          ctx.strokeText(line.text + (line.emoji || ""), line.x, line.y);
          ctx.restore();
        });
      };
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Gestion des lignes de texte
  const updateLine = (prop, value) => {
    setLines((lines) =>
      lines.map((l, i) => (i === selectedLine ? { ...l, [prop]: value } : l))
    );
  };
  const addLine = () => {
    if (lines.length < 4) {
      setLines([...lines, { ...defaultLine(), y: 200 + lines.length * 40 }]);
      setSelectedLine(lines.length);
    }
  };
  const removeLine = () => {
    if (lines.length > 1) {
      const newLines = lines.filter((_, i) => i !== selectedLine);
      setLines(newLines);
      setSelectedLine(Math.max(0, selectedLine - 1));
    }
  };
  const switchLine = () => {
    setSelectedLine((selectedLine + 1) % lines.length);
  };

  // Déplacement
  const moveLine = (dx, dy) => {
    setLines((lines) =>
      lines.map((l, i) =>
        i === selectedLine ? { ...l, x: l.x + dx, y: l.y + dy } : l
      )
    );
  };

  // Alignement
  const alignLine = (align) => {
    updateLine("align", align);
  };

  // Emoji
  const addEmoji = (emoji) => {
    updateLine("emoji", emoji);
  };

  // Couleur
  const updateColor = (color) => {
    updateLine("color", color);
  };
  const updateStroke = (color) => {
    updateLine("stroke", color);
  };

  // Font size
  const incrFontSize = () => {
    updateLine("size", lines[selectedLine].size + 2);
  };
  const decrFontSize = () => {
    updateLine("size", Math.max(10, lines[selectedLine].size - 2));
  };

  // Téléchargement
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = url;
    link.download = "meme.jpg";
    link.click();
  };

  // Galerie
  const handleSaveToGallery = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/jpeg");
    const meme = {
      image: url,
      lines,
      date: Date.now(),
    };
    const gallery = JSON.parse(localStorage.getItem("memeGallery") || "[]");
    gallery.unshift(meme);
    localStorage.setItem("memeGallery", JSON.stringify(gallery));
    alert("Mème sauvegardé dans la galerie !");
  };

  // Emojis de base
  const emojis = ["😂", "🔥", "😎", "🥲", "🤡", "💀", "😱", "😍", "🤔", "🥳"];

  return (
    <div className="container">
      <div className="flex-container">
        <div style={{ flex: "1 1 320px", minWidth: 320 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginBottom: 12 }}
          />
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`line-container ${idx === selectedLine ? 'selected-line' : ''}`}
            >
              <input
                type="text"
                value={line.text}
                onChange={(e) => {
                  setLines((lines) =>
                    lines.map((l, i) =>
                      i === idx ? { ...l, text: e.target.value } : l
                    )
                  );
                }}
                placeholder={`Texte ${idx + 1}`}
                className="input-text"
              />
              <button
                onClick={() => setSelectedLine(idx)}
                style={{
                  background:
                    idx === selectedLine ? "var(--primary-color)" : "#e5e7eb",
                  color: idx === selectedLine ? "#fff" : "#333",
                  borderRadius: 6,
                  padding: "2px 8px",
                  marginRight: 4,
                }}
              >
                ✏️
              </button>
            </div>
          ))}
          <div style={{ margin: "8px 0" }}>
            <button onClick={addLine}>Ajouter une ligne</button>
            <button onClick={removeLine} disabled={lines.length <= 1}>
              Supprimer
            </button>
            <button onClick={switchLine}>Changer de ligne</button>
          </div>
          <div style={{ margin: "8px 0" }}>
            <button onClick={() => moveLine(-5, 0)}>⬅️</button>
            <button onClick={() => moveLine(5, 0)}>➡️</button>
            <button onClick={() => moveLine(0, -5)}>⬆️</button>
            <button onClick={() => moveLine(0, 5)}>⬇️</button>
          </div>
          <div style={{ margin: "8px 0" }}>
            <button onClick={() => alignLine("left")}>Gauche</button>
            <button onClick={() => alignLine("center")}>Centre</button>
            <button onClick={() => alignLine("right")}>Droite</button>
          </div>
          <div style={{ margin: "8px 0" }}>
            <button onClick={incrFontSize}>Agrandir</button>
            <button onClick={decrFontSize}>Réduire</button>
            <input
              type="color"
              value={lines[selectedLine].color}
              onChange={(e) => updateColor(e.target.value)}
              title="Couleur texte"
              style={{ marginLeft: 8 }}
            />
            <input
              type="color"
              value={lines[selectedLine].stroke}
              onChange={(e) => updateStroke(e.target.value)}
              title="Contour texte"
              style={{ marginLeft: 8 }}
            />
          </div>
          <div style={{ margin: "8px 0" }}>
            {emojis.map((e) => (
              <button
                key={e}
                onClick={() => addEmoji(e)}
                style={{ fontSize: 22, margin: "0 2px" }}
              >
                {e}
              </button>
            ))}
            <button onClick={() => addEmoji("")}>❌</button>
          </div>
        </div>
        <div
          style={{
            flex: "1 1 320px",
            minWidth: 320,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="canvas"
          />
          <div className="button-group">
            <button onClick={handleDownload} disabled={!image}>
              Télécharger
            </button>
            <button onClick={handleSaveToGallery} disabled={!image}>
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;