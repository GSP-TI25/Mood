// src/pages/Cms/Views/Usuarios/UsuariosView.jsx
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import UsersTable from "../../../../components/Cms/UsersTable";
import UserForm from "../../../../components/Cms/UserForm";
import "./UsuariosView.scss";

/**
 * Componente UsuariosView.
 * Vista administrativa para gestionar los accesos y usuarios del CMS.
 */
const UsuariosView = () => {
	const [usersList, setUsersList] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState(null);

	const getAuthHeaders = useCallback(() => {
		const token = localStorage.getItem("cms_token");
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users`,
				{
					headers: getAuthHeaders(),
				},
			);
			if (response.ok) {
				setUsersList(await response.json());
			} else if (response.status === 403) {
				toast.error("Sesión expirada o sin permisos.");
			}
		} catch (error) {
			console.error("Error cargando usuarios:", error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [getAuthHeaders]);

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
				{/* La cabecera visual principal se gestiona dentro de UsersTable por diseño original,
            pero se mantiene la estructura por consistencia */}
			</header>

			<UsersTable
				users={usersList}
				onAddUser={openCreateForm}
				onEdit={openEditForm}
			/>

			{isFormOpen && (
				<div className='cms-sheet-overlay' onClick={() => setIsFormOpen(false)}>
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
		</div>
	);
};

export default UsuariosView;
