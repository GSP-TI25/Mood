// src/pages/Cms/Views/Usuarios/UsuariosView.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import UsersTable from '../../../../components/Cms/UsersTable';
import UserForm from '../../../../components/Cms/UserForm';
import ConfirmModal from '../../../../components/Cms/ConfirmModal/ConfirmModal'; // 🌟 NUEVO
import './UsuariosView.scss';

const UsuariosView = () => {
  const [usersList, setUsersList] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // 🌟 ESTADO PARA EL MODAL DE CONFIRMACIÓN
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('cms_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (response.ok) {
        setUsersList(await response.json());
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [getAuthHeaders]);

  // 🌟 LÓGICA PARA DAR DE BAJA
  const handleToggleStatus = (userId) => {
    setConfirmDialog({
      isOpen: true,
      message: '¿Seguro que deseas cambiar el acceso de este usuario al CMS?',
      onConfirm: async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userId}/status`,
            { method: 'PATCH', headers: getAuthHeaders() },
          );
          if (response.ok) {
            toast.success('Estado del usuario actualizado');
            fetchUsers();
          } else {
            const err = await response.json();
            toast.error(err.message || 'Error al actualizar el usuario');
          }
        } catch (error) {
          toast.error('Error de conexión');
        }
      },
    });
  };

  const openCreateForm = () => {
    setUserToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (user) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchUsers();
  };

  return (
    <div className='view-container'>
      <header className='cms-main-content__header'>
        {/* Cabecera manejada internamente por UsersTable */}
      </header>

      <UsersTable
        users={usersList}
        onAddUser={openCreateForm}
        onEdit={openEditForm}
        onToggleStatus={handleToggleStatus} // 🌟 PASAMOS LA FUNCIÓN
      />

      {isFormOpen && (
        <div
          className='cms-sheet-overlay'
          onClick={() => setIsFormOpen(false)}
        >
          <div
            className='cms-sheet-content'
            onClick={(e) => e.stopPropagation()}
          >
            <UserForm
              userToEdit={userToEdit}
              onSubmitSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 🌟 MODAL GENÉRICO DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
    </div>
  );
};

export default UsuariosView;
