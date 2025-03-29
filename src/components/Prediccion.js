import React, { useEffect, useState } from "react";
import './Prediccion.css';

const API_BASE_URL = 'http://localhost:8000';

const Prediccion = () => { // se usa el nombre de la función como nombre del componente
  const [texto, setTexto] = useState({
    Titulo: "",
    Descripcion: "",
  });
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metricas, setMetricas] = useState(null);

  const handleChange = (e) => { 
    setTexto({ ...texto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);
    setError(null);
    
    // Consumimos la API para hacer la predicción
    // Enviamos el objeto texto completo
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(texto), // Enviamos el objeto texto completo
      });

      if (!response.ok) {
        throw new Error("Error al hacer la predicción");
      }

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setResultado(data.results[0]); // primera instancia
      } else {
        throw new Error("No se recibió una predicción válida");
      }
          } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Consumimos la API para obtener las métricas
  // Se ejecuta una vez al cargar el componente
  const fetchMetricas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      const data = await response.json();
      setMetricas(data.metricas);
    } catch (error) {
      console.error("Error al obtener métricas:", error);
    }
  };

  useEffect(() => {
    fetchMetricas();
  }, []);

  return (
    // Contenedor principal
    <div style={{ display: "flex", padding: "10px" }}>
      {/* Columna izquierda - Formulario de predicción */}
      <div style={{ flex: 1, paddingRight: "30px", borderRight: "1px solid #ccc" }}>
        <label className="titulo_prediccion"> <strong>  Predicción de Fake News  </strong> </label><br />
        <form onSubmit={handleSubmit}>
          <label className="label-form">
            <strong>Título:</strong>
            <input
              type="text"
              name="Titulo"
              value={texto.Titulo}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </label>
          <br />
          <label className="label-form">
            <strong>Descripción:</strong>
            <textarea
              name="Descripcion"
              value={texto.Descripcion}
              onChange={handleChange}
              required
              rows="5"
              style={{ width: "100%", marginBottom: "10px" }}
            ></textarea>
          </label>
          <br />
          <div className="predict-button">
            <button type="submit" disabled={loading}>
              {loading ? "Cargando..." : "Predecir"}
            </button>
          </div>
        </form>

        {resultado && (
          <table className="blue-result-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Label</th>
                <th>Probabilidad</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{texto.Titulo}</td>
                <td>{resultado.label}</td>
                <td>{(resultado.probability * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        )}



        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            <p>Error: {error}</p>
          </div>
        )}
      </div>

      {/* Columna derecha - explicacion de la aplicacion y metricas*/}
      <div style={{ flex: 1, paddingLeft: "80px", borderLeft: "1px solid #ccc" }}>
        <div className="card descripcion">
          <label><strong>Descripción de la Aplicación:</strong></label><br />
          <p>
            Esta aplicación permite predecir si una noticia es falsa o verdadera
            utilizando un modelo de aprendizaje automático. En esta seccion solo debes ingresar el título y la descripción de la noticia.
          </p>
        </div>
      <div style={{ flex: 1, paddingLeft: "5px" }}>
        <h2>Métricas del Modelo</h2>
        {metricas ? (
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
        ) : (
          <p>Cargando métricas...</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Prediccion;
