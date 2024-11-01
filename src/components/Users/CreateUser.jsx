import { Formik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from 'yup';
import { Button } from 'primereact/button';

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token"); // Asegúrate de obtener el token del almacenamiento local.

  const ValidationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Este campo es requerido')
      .max(50, 'El username no debe ser mayor a 50 caracteres'),
    password: Yup.string()
      .required('Este campo es requerido')
      .max(50, 'La contraseña no debe ser mayor a 50 caracteres'),
    admin: Yup.number()
      .required('Este campo es requerido')
      .oneOf([0, 1], 'Debe ser 1 para admin o 0 para usuario')
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users', {
        headers: { 'Authorization': ` ${token}` },
      });
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const RegisterUser = async (values, { resetForm }) => {
    const bodyRegisterUser = {
      username: values.username,
      password: values.password,
      is_admin: parseInt(values.admin),
    };
    console.log(values)
    const url = editing 
      ? `http://127.0.0.1:5000/users/${editing}/update` 
      : 'http://127.0.0.1:5000/users';

    const method = editing ? 'PUT' : 'POST'; 

    const response = await fetch(url, {
      method,
      body: JSON.stringify(bodyRegisterUser),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ` ${token}`
      }
    });

    if (response.ok) {
      fetchUsers();
      resetForm();
      setEditing(null);
      setMessage("Usuario guardado exitosamente.");
    } else {
      setMessage("Error al guardar el usuario.");
    }
  };

  const handleEditar = (id) => {
    const userToEdit = users.find(user => user.id === id);
    if (userToEdit) {
      setEditing(userToEdit.id);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/users/${id}/delete`, {
        method: "DELETE",
        headers: { 'Authorization': ` ${token}` },
      });
      
      if (!response.ok) throw new Error("Error al eliminar el usuario");
      
      fetchUsers();
      setMessage("Usuario eliminado exitosamente.");
    } catch (error) {
      console.error(error);
      setMessage("Error al eliminar el usuario.");
    }
  };

  return (
    <div className="container">
      <h4>{editing ? "Editar Usuario" : "Crear Nuevo Usuario"}</h4>
      <Formik
        enableReinitialize
        initialValues={{
          username: editing ? users.find(user => user.id === editing)?.username : '',
          password: '',
          admin: 0,
        }}
        validationSchema={ValidationSchema}
        onSubmit={RegisterUser}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isValid
        }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
              />
              {errors.username && touched.username && (
                <div className="text-danger">{errors.username}</div>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && (
                <div className="text-danger">{errors.password}</div>
              )}
            </div>
            <div>
              <select
                name="admin"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.admin}
              >
                <option value={0}>Usuario</option>
                <option value={1}>Administrador</option>
              </select>
              {errors.admin && touched.admin && (
                <div className="text-danger">{errors.admin}</div>
              )}
            </div>
            <Button label={editing ? "Actualizar Usuario" : "Crear Usuario"} 
                icon="pi pi-check" 
                type="submit" 
                disabled={!isValid} 
                className="p-button-success" 
            />
            
          </form>
        )}
      </Formik>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <h4>Lista de Usuarios</h4>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <span>{user.username} - {user.is_admin ? "Admin" : "Usuario"}</span>
            <Button 
              icon="pi pi-pencil" 
              className="p-button-warning p-button-sm me-2" 
              onClick={() => handleEditar(user.id)} 
              label="Editar" 
          />
          <Button 
              icon="pi pi-trash" 
              className="p-button-danger p-button-sm" 
              onClick={() => handleEliminar(user.id)} 
              label="Eliminar" 
          />         
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateUser;
