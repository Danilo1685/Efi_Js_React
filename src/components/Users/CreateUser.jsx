import { Formik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from 'yup';

const CreateUser = () => {
  const [users, setUsers] = useState([]);
  const token = ''; 

  const ValidationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Este campo es requerido')
      .min(5, 'El username debe tener mínimo 5 caracteres')
      .max(50, 'El username no debe ser mayor a 50 caracteres'),
    password: Yup.string()
      .required('Este campo es requerido')
      .min(5, 'La contraseña debe tener mínimo 5 caracteres')
      .max(50, 'La contraseña no debe ser mayor a 50 caracteres'),
    admin: Yup.number()
      .required('Este campo es requerido')
      .oneOf([0, 1], 'Debe ser 1 para admin o 0 para usuario')
  });

  const fetchUsers = async () => {
    const response = await fetch('http://127.0.0.1:5000/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const RegisterUser = async (values, { resetForm }) => {
    const bodyRegisterUser = {
      username: values.username,
      password: values.password,
      is_admin: values.admin === 1,
    };

    const response = await fetch('http://127.0.0.1:5000/users', {
      method: 'POST',
      body: JSON.stringify(bodyRegisterUser),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      fetchUsers();
      resetForm();
    }
  };

  return (
    <div className="container">
      <h4>Crear Nuevo Usuario</h4>
      <Formik
        initialValues={{
          username: '',
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
            <button type="submit" disabled={!isValid}>
              Crear Usuario
            </button>
          </form>
        )}
      </Formik>

      <h4>Lista de Usuarios</h4>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <span>{user.username} - {user.is_admin ? "Admin" : "Usuario"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateUser;
