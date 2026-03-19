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
  const [users, setUsers] = useState([]); // Inicia vacío
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // --- 🌐 LLAMADA A TU API ---
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

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const totalUsuarios = users.length;
  const usuariosActivos = users.filter(u => u.estado === 'ACTIVO').length;

  return (
    <div className="personal-layout">
      <div className="personal-header">
        <h1>Gestión de Personal</h1>
        <p>Añade, edita y gestiona los roles y accesos de tu equipo.</p>
      </div>

      <div className="kpi-grid-personal">
        <div className="kpi-card-personal">
          <h3>Total de Empleados</h3>
          <div className="value">{totalUsuarios}</div>
        </div>
        <div className="kpi-card-personal">
          <h3>Empleados Activos</h3>
          <div className="value">{usuariosActivos}</div>
        </div>
      </div>

      <div className="personal-management-header">
        <h2>Lista de Empleados</h2>
        <button className="btn-add-personal" onClick={openModal}>
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
                  <td>{user.nombre}</td>
                  <td><span className={`role-badge ${user.rol?.toLowerCase()}`}>{user.rol}</span></td>
                  <td><span className={`status-badge ${user.estado?.toLowerCase()}`}>{user.estado}</span></td>
                  <td>{user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString() : 'N/A'}</td>
                  <td className="actions">
                    <button className="btn-action btn-edit">Editar</button>
                    <button className="btn-action btn-delete">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customModalStyles}>
        {/* Tu formulario de modal actual se mantiene igual */}
        <div className="modal-header-modern">
          <h3>Añadir Nuevo Empleado</h3>
          <button onClick={closeModal} className="btn-close-modern">×</button>
        </div>
        <form className="modal-form-modern">
          {/* ... inputs del formulario ... */}
          <div className="modal-actions-modern">
            <button type="button" className="btn-cancel-modern" onClick={closeModal}>Cancelar</button>
            <button type="submit" className="btn-create-modern">Crear Empleado</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Personal;