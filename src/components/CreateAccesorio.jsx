import { Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Button } from "primereact/button";

const Accesorios = () => {
  const [accesorios, setAccesorios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  const ValidationSchema = Yup.object().shape({
    nombre: Yup.string()
      .required("Este campo es requerido")
      .min(3, "Debe tener mínimo 3 caracteres")
      .max(50, "No debe ser mayor a 50 caracteres"),
  });

  const fetchAccesorios = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/accesorios_list", {
      headers: { Authorization: token },
    });
    const data = await response.json();
    setAccesorios(data.accesorios);
  };

  useEffect(() => {
    fetchAccesorios();
  }, );

  const handleGuardar = async (values, { resetForm }) => {
    try {
      const url = editing 
        ? `http://127.0.0.1:5000/api/accesorio/${editing}/editar`
        : "http://127.0.0.1:5000/api/accesorios_list";
      const method = editing ? "POST" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ nombre: values.nombre }),
      });
      
      if (!response.ok) throw new Error("Error al guardar el accesorio");
      
      setEditing(null);
      fetchAccesorios();
      resetForm();
      setMessage("Accesorio guardado exitosamente.");
    } catch (error) {
      console.error(error);
      setMessage("Error al guardar el accesorio.");
    }
  };
  
  const handleEditar = (id) => setEditing(id);

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/accesorio/${id}/eliminar`, {
        method: "POST",
        headers: { Authorization: token },
      });
      
      if (!response.ok) throw new Error("Error al eliminar accesorio");
      
      fetchAccesorios();
      setMessage("Accesorio eliminado exitosamente.");
    } catch (error) {
      console.error(error);
      setMessage("Error al eliminar el accesorio.");
    }
  };

  return (
    <div className="container">
      {isAdmin ? (
        <div className="row">
          <div className="col-md-6">
            <h4>{editing ? "Editar Accesorio" : "Crear un Nuevo Accesorio"}</h4>
            <Formik
              enableReinitialize
              initialValues={{ nombre: editing ? accesorios.find(a => a.id === editing).nombre : "" }}
              validationSchema={ValidationSchema}
              onSubmit={handleGuardar}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.nombre}
                      placeholder="Ingrese el nombre del accesorio"
                    />
                    {errors.nombre && touched.nombre && (
                      <div className="text-danger">{errors.nombre}</div>
                    )}
                  </div>
                  <Button
                    label={editing ? "Actualizar" : "Guardar"}
                    icon="pi pi-check" // Puedes agregar un ícono si lo deseas
                    className="p-button-success"
                    disabled={!isValid}
                    type="submit"
                  />
                </form>
              )}
            </Formik>
          </div>

          <div className="col-md-6">
            <h4>Listado de Accesorios</h4>
            <ul className="list-group">
              {accesorios.map(accesorio => (
                <li key={accesorio.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{accesorio.nombre}</span>
                  <div>
                <Button
                  label="Editar"
                  icon="pi pi-pencil"
                  className="p-button-warning p-button-sm me-2"
                  onClick={() => handleEditar(accesorio.id)}
                />
                <Button
                  label="Eliminar"
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() => handleEliminar(accesorio.id)}
                />

                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>No estás autorizado para gestionar accesorios.</p>
      )}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Accesorios;
