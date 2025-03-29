import React, { useState } from "react";
import './Reentrenamiento.css';

const API_BASE_URL = 'http://localhost:8000';

const Reentrenamiento = () => {
  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResultado(null);
    setMetricas(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Debes seleccionar un archivo CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/retrain`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al reentrenar el modelo");
      }

      const data = await response.json();
      setResultado(data);
      setMetricas(data.metricas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        // Contenedor principal
    <div style={{ display: "flex", padding: "10px" }}>
      {/* Columna izquierda - Formulario de predicción */}
      <div style={{ flex: 1, paddingRight: "10px", borderRight: "1px solid #ccc" }}>
      <label className="titulo_prediccion"> <strong>  Reentrenamiento del modelo  </strong> </label><br />
        <div className="card descripcion_reentrenamiento">
          <p>
            Este módulo permite actualizar el modelo de detección de noticias falsas.
            Solo debes subir un archivo CSV con el nuevo conjunto de datos.
            El modelo será reentrenado automáticamente y se mostrarán las métricas actualizadas.
          </p>
        </div>

        <div className="card formulario">
          <form onSubmit={handleSubmit} className="retrain-form">

            <div className="form-row">
                <label htmlFor="file-upload" className="custom-file-upload">
                Seleccionar archivo
                </label>
            </div>
            
            <div className="form-row">
                <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
                />
            </div>

            <div className="form-row">
                <span className="nombre-archivo">
                {file ? file.name : "Ningún archivo seleccionado"}
                </span>
            </div>

            <button type="submit" disabled={loading} className="retrain-btn">
              {loading ? "Reentrenando..." : "Subir y reentrenar"}
            </button>
            
          </form>
          {error && <p style={{ color: "red" }}> {error}</p>}
          {resultado && (
            <p style={{ color: "green", marginTop: "10px" }}> ¡Modelo reentrenado con éxito!</p>
          )}
        </div>

      </div>
      {/* Sección derecha */}
      <div style={{ flex: 1, paddingLeft: "80px", borderLeft: "1px solid #ccc" }}>
        <h2>Métricas del Modelo</h2>
        {metricas ? (
          <>
            <table className="metricas-table">
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1-score</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metricas).map(([key, value]) => {
                  if (typeof value === 'object' && value.precision !== undefined) {
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{(value.precision * 100).toFixed(2)}%</td>
                        <td>{(value.recall * 100).toFixed(2)}%</td>
                        <td>{(value['f1-score'] * 100).toFixed(2)}%</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <div className="card metricas-descripcion">
               <label className="metricas-titulo"><strong>¿Cómo interpretar estas métricas?</strong></label><br />
                <ul>
                    <li>
                    <strong>Precisión (Precision):</strong> Indica qué tan confiables son las predicciones positivas.  
                    <br />
                    <em>Ejemplo:</em> Si el modelo predijo 100 noticias como falsas y 90 de ellas realmente lo eran, la precisión es del 90%.
                    </li>
                    <li>
                    <strong>Exhaustividad (Recall):</strong> Mide cuántas noticias realmente falsas fueron detectadas por el modelo.  
                    <br />
                    <em>Ejemplo:</em> Si había 120 noticias realmente falsas en el conjunto y el modelo identificó 90, el recall es del 75%.
                    </li>
                    <li>
                    <strong>Puntaje F1 (F1-score):</strong> Es una medida que equilibra precisión y recall. Es útil cuando hay un desbalance entre clases.  
                    <br />
                    <em>Ejemplo:</em> Si la precisión es del 90% y el recall es del 75%, el F1-score será aproximadamente del 82%.
                    </li>
                </ul>
                </div>

          </>
        ) : (
          <p>Cargando métricas...</p>
        )}
      </div>
    </div>
  );
};

export default Reentrenamiento;
