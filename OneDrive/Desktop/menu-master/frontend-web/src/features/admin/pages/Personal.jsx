import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../styles/Personal.css';
import { COLORES_RESTO } from '../../../constants/theme';

const customModalStyles = {
  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    backgroundColor: COLORES_RESTO.tarjeta, border: `1px solid ${COLORES_RESTO.borde}`,
    borderRadius: '20px', padding: '35px', maxWidth: '500px', width: '100%',
    color: COLORES_RESTO.textoBlanco,
  },
  overlay: { backgroundColor: 'rgba(11, 15, 19, 0.85)', backdropFilter: 'blur(4px)', zIndex: 1000 },
};

Modal.setAppElement('#root');

const Personal = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: '', email: '', password_hash: '', rol: 'MESERO', estado: 'ACTIVO'
  });

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const openModal = (user = null) => {
    if (user && user._id) {
      setEmpleadoEditando(user);
      setForm({
        nombre: user.nombre || '',
        email: user.email || '',
        password_hash: user.password_hash || '',
        rol: user.rol || 'MESERO',
        estado: user.estado || 'ACTIVO'
      });
    } else {
      setEmpleadoEditando(null);
      setForm({ nombre: '', email: '', password_hash: '', rol: 'MESERO', estado: 'ACTIVO' });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const guardarEmpleado = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.password_hash) {
      return alert("El nombre, correo y contraseña son obligatorios.");
    }

    setGuardando(true);
    const url = empleadoEditando
      ? `http://localhost:3000/usuarios/${empleadoEditando._id}`
      : `http://localhost:3000/usuarios`;
    const method = empleadoEditando ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        closeModal();
        cargarUsuarios();
        alert(empleadoEditando ? "✅ Empleado actualizado." : "✅ Nuevo empleado añadido.");
      } else {
        const errorText = await res.text();
        alert(`Error al guardar: ${errorText}`);
      }
    } catch (error) {
      alert(`Error de conexión: ${error.message}`);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarEmpleado = async (id, nombre) => {
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar al empleado "${nombre}"?\nYa no tendrá acceso al sistema.`);
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        cargarUsuarios();
      } else {
        alert("Hubo un error al intentar eliminar al empleado.");
      }
    } catch (error) {
      alert(`Error de conexión: ${error.message}`);
    }
  };

  const totalUsuarios = users.length;
  const usuariosActivos = users.filter(u => u.estado === 'ACTIVO').length;

  return (
    <div className="personal-layout">
      <div className="personal-header">
        <h1 style={{ color: 'var(--color-primario)' }}>Gestión de Personal</h1>
        <p>Añade, edita y gestiona los roles y accesos de tu equipo.</p>
      </div>

      <div className="kpi-grid-personal">
        <div className="kpi-card-personal" style={{ border: '1px solid var(--color-primario)' }}>
          <h3>Total de Empleados</h3>
          <div className="value">{totalUsuarios}</div>
        </div>
        <div className="kpi-card-personal" style={{ border: '1px solid var(--color-primario)' }}>
          <h3>Empleados Activos</h3>
          <div className="value">{usuariosActivos}</div>
        </div>
      </div>

      <div className="personal-management-header">
        <h2>Lista de Empleados</h2>
        <button
          className="btn-add-personal"
          onClick={() => openModal()}
          style={{ backgroundColor: 'var(--color-primario)', color: '#000', fontWeight: 'bold' }}
        >
          <span className="icon">+</span> Añadir Personal
        </button>
      </div>

      <div className="personal-table-container">
        <table className="personal-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Miembro Desde</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Cargando personal...</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: 'bold', color: '#FFF' }}>{user.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#8B98A5' }}>{user.email}</div>
                  </td>

                  {/* colores */}
                  <td>
                    <span className={`role-badge ${user.rol?.toLowerCase()}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.estado?.toLowerCase()}`}>
                      {user.estado}
                    </span>
                  </td>

                  <td>{user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString() : 'N/A'}</td>

                  <td className="actions" style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-action btn-edit"
                      onClick={() => openModal(user)}
                      style={{ backgroundColor: 'transparent', color: 'var(--color-primario)', border: '1px solid var(--color-primario)', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => eliminarEmpleado(user._id, user.nombre)}
                      style={{ backgroundColor: 'transparent', color: '#F56565', border: '1px solid #F56565', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles}>
        <div className="modal-header-modern" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'var(--color-primario)' }}>
            {empleadoEditando ? 'Editar Empleado' : 'Añadir Nuevo Empleado'}
          </h2>
          <button onClick={closeModal} className="btn-close-modern" style={{ background: 'transparent', border: 'none', color: '#FFF', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <form className="modal-form-modern" onSubmit={guardarEmpleado} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#8B98A5', fontSize: '14px' }}>
            Nombre Completo:
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#0B1014', border: '1px solid #2D3748', color: '#FFF' }}
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#8B98A5', fontSize: '14px' }}>
            Correo Electrónico / Usuario:
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#0B1014', border: '1px solid #2D3748', color: '#FFF' }}
              required
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#8B98A5', fontSize: '14px' }}>
            Contraseña de acceso:
            <input
              type="text"
              value={form.password_hash}
              onChange={e => setForm({ ...form, password_hash: e.target.value })}
              style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#0B1014', border: '1px solid #2D3748', color: '#FFF' }}
              required
            />
          </label>

          <div style={{ display: 'flex', gap: '15px' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#8B98A5', fontSize: '14px', flex: 1 }}>
              Rol en el sistema:
              <select
                value={form.rol}
                onChange={e => setForm({ ...form, rol: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#0B1014', border: '1px solid #2D3748', color: '#FFF' }}
              >
                <option value="ADMIN">Administrador</option>
                <option value="MESERO">Mesero</option>
                <option value="COCINERO">Cocinero</option>
              </select>
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: '#8B98A5', fontSize: '14px', flex: 1 }}>
              Estado actual:
              <select
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}
                style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#0B1014', border: '1px solid #2D3748', color: '#FFF' }}
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </label>
          </div>

          <div className="modal-actions-modern" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn-cancel-modern" onClick={closeModal} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #2D3748', backgroundColor: 'transparent', color: '#8B98A5', cursor: 'pointer' }}>
              Cancelar
            </button>
            <button type="submit" className="btn-create-modern" disabled={guardando} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--color-primario)', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
              {guardando ? 'Guardando...' : (empleadoEditando ? 'Guardar Cambios' : 'Crear Empleado')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Personal;