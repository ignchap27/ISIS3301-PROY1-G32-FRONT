import React, { useState } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './CSVPrediccion.css';

const API_BASE_URL = 'http://localhost:8000';
const COLORS = ['#4d94ff', '#1f499c', '#3366cc', '#99ccff'];

const CSVPrediccion = () => {
  const [file, setFile] = useState(null);
  const [predicciones, setPredicciones] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPredicciones([]);
    setCsvData([]);

    // Completar el CSV con los datos del archivo
    Papa.parse(uploadedFile, { // parsear el archivo CSV
      header: true, // usar la primera fila como encabezados
      delimiter: ";",
      complete: (results) => { // completar el CSV
        setCsvData(results.data); // guardar los datos en el estado
      },
      error: (err) => setError("Error al leer el archivo CSV: " + err.message),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    // Crear un objeto FormData para enviar el archivo CSV al backend
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict_csv`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la predicción");
      }

      const data = await response.json();

      const dataWithLabel = csvData.map((row, index) => {
        const pred = data.predictions?.[index];
      
        return {
          ID: row.ID ?? index,  
          Titulo: row.Titulo,
          Descripcion: row.Descripcion,
          Label: pred?.label ?? "N/A",
          Probabilidad: pred?.probability ? pred.probability.toFixed(2) : "0.00"
        };
      });
      
      

      setPredicciones(dataWithLabel);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para contar las predicciones por clase para el gráfico
  const contarPredicciones = () => {
    const counts = { "0": 0, "1": 0 };
  
    predicciones.forEach((p) => {
      if (p.Label === "0" || p.Label === "1" || p.Label === 0 || p.Label === 1) {
        counts[p.Label]++;
      }
    });
  
    return [
      { name: "0", value: counts["0"] },
      { name: "1", value: counts["1"] },
    ];
  };
  
  // Función para descargar el CSV con las predicciones
  // Esta función convierte el objeto predicciones a CSV y lo descarga
  const descargarCSV = () => {
    const csv = Papa.unparse(predicciones);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "predicciones_Fake_News.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
    
        <div style={{ flex: 1, paddingRight: "30px", borderRight: "1px solid #ccc" }}>
        <label className="titulo_prediccion"> <strong>  Predicción de Fake News  </strong> </label><br />

        <form onSubmit={handleSubmit} className="csv-form">
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

            <div className="form-row predict-button">
                <button type="submit" disabled={loading}>
                {loading ? "Cargando..." : "Predecir CSV"}
                </button>
            </div>
            </form>

          {predicciones.length > 0 && (
            <>
            <div style={{ marginTop: "1px", height: 250 }}>
              <h3>Distribución de clases</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                  data={contarPredicciones()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {contarPredicciones().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                    
                 formatter={(value) => (value === "0" ? "Noticia Falsa" : "Noticia Verdadera")} />
        

                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="download-btn-wrapper">
              <button onClick={descargarCSV} className="download-button">
                Descargar CSV con predicciones
              </button>
            </div>
            </>
          )}

          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>

        {/* Lado derecho */}
    <div style={{ flex: 1, paddingLeft: "80px", borderLeft: "1px solid #ccc" }}>
      <div className="card descripcion">
        <label><strong>Descripción de la Aplicación:</strong></label><br />
        <p>
        Esta aplicación permite predecir si una noticia es falsa o verdadera
        utilizando un modelo de aprendizaje automático. En esta seccion ingresa el archivo CSV con las noticias a predecir.
        </p>
      </div>

      <div style={{ flex: 1, paddingLeft: "30px" }}>
        {predicciones.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Primeros 5 datos predichos:</h3>
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Label</th>
                  <th>Probabilidad</th>

                </tr>
              </thead>
              <tbody>
                {predicciones.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td>{row.Titulo}</td>
                    <td>{row.Label}</td>
                    <td>{(row.Probabilidad * 100).toFixed(2)}%</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default CSVPrediccion;
