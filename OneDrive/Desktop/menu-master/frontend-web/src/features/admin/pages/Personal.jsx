import React, { useState } from 'react';
import Modal from 'react-modal';
import { mockUsuarios } from '../data/mock-data'; // Crearemos este archivo a continuación
import '../styles/Personal.css';

// Estilos personalizados para el modal
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#1C242B',
    border: '1px solid #2D3748',
    borderRadius: '20px',
    padding: '35px',
    maxWidth: '500px',
    width: '100%',
  },
  overlay: {
    backgroundColor: 'rgba(11, 15, 19, 0.85)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
  },
};

Modal.setAppElement('#root');

const Personal = () => {
  const [users, setUsers] = useState(mockUsuarios);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.nombre}</td>
                <td><span className={`role-badge ${user.rol.toLowerCase()}`}>{user.rol}</span></td>
                <td><span className={`status-badge ${user.estado.toLowerCase()}`}>{user.estado}</span></td>
                <td>{new Date(user.fecha_creacion).toLocaleDateString()}</td>
                <td className="actions">
                  <button className="btn-action btn-edit">Editar</button>
                  <button className="btn-action btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Añadir Nuevo Empleado"
      >
        <div className="modal-header-modern">
          <h3>Añadir Nuevo Empleado</h3>
          <button onClick={closeModal} className="btn-close-modern">×</button>
        </div>
        <form className="modal-form-modern">
          <div className="input-group-modern">
            <label>Nombre Completo</label>
            <input type="text" placeholder="Ej: Juan Pérez" />
          </div>
          <div className="input-group-modern">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="ej: juan.perez@email.com" />
          </div>
          <div className="form-row-2col">
            <div className="input-group-modern">
              <label>Rol</label>
              <div className="select-wrapper">
                <select>
                  <option value="MESERO">Mesero</option>
                  <option value="COCINERO">Cocinero</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="input-group-modern">
                <label>Estado</label>
                 <div className="select-wrapper">
                    <select>
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                    </select>
                </div>
            </div>
          </div>
          <div className="input-group-modern">
            <label>Contraseña</label>
            <input type="password" placeholder="Mínimo 8 caracteres" />
          </div>
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
