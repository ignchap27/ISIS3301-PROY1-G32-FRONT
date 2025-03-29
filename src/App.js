import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Prediccion from "./components/Prediccion";
import CSVPrediccion from "./components/CSVPrediccion";
import Reentrenamiento from "./components/Reentrenamiento";
import 'flowbite/dist/flowbite.css';

function App() {
  const [modo, setModo] = useState("predecir"); 
  const [opcion, setOpcion] = useState("una"); 

  const renderContenido = () => {
    if (modo === "predecir") {
      if (opcion === "una") return <Prediccion />;
      if (opcion === "csv") return <CSVPrediccion />;
    }
    if (modo === "reentrenar") {
      return <Reentrenamiento opcion={opcion} />;
    }
    return null;
  };

  return (
    <div>
      <Navbar modo={modo} setModo={setModo} />
      <div style={{ display: "flex" }}>
        <Sidebar modo={modo} opcion={opcion} setOpcion={setOpcion} />
        <div style={{ flex: 1, padding: "20px" }}>
          {renderContenido()}
        </div>
      </div>
    </div>
  );
}

export default App;
