// src/pages/Cms/Views/Equipo/EquipoView.jsx
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import TeamTable from "../../../../components/Cms/TeamTable";
import TeamForm from "../../../../components/Cms/TeamForm";
import ConfirmModal from "../../../../components/Cms/ConfirmModal/ConfirmModal";
import "./EquipoView.scss";

/**
 * Componente EquipoView.
 * Vista para gestionar los perfiles de los miembros del equipo.
 */
const EquipoView = () => {
	const [team, setTeam] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [teamMemberToEdit, setTeamMemberToEdit] = useState(null);

	const [confirmDialog, setConfirmDialog] = useState({
		isOpen: false,
		message: "",
		onConfirm: null,
	});

	const getAuthHeaders = useCallback(() => {
		const token = localStorage.getItem("cms_token");
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}, []);

	const fetchTeam = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/team`,
			);
			if (response.ok) setTeam(await response.json());
		} catch (error) {
			console.error("Error cargando equipo:", error);
		}
	};

	useEffect(() => {
		fetchTeam();
	}, []);

	const handleToggleStatus = (memberId) => {
		setConfirmDialog({
			isOpen: true,
			message: "¿Seguro que deseas cambiar la visibilidad de este miembro?",
			onConfirm: async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/team/${memberId}/status`,
						{ method: "PATCH", headers: getAuthHeaders() },
					);
					if (response.ok) {
						toast.success("Estado del miembro actualizado");
						fetchTeam();
					} else {
						toast.error("Error al actualizar el miembro");
					}
				} catch (error) {
					toast.error("Error de conexión");
				}
			},
		});
	};

	const openCreateForm = () => {
		setTeamMemberToEdit(null);
		setIsFormOpen(true);
	};

	const openEditForm = (member) => {
		setTeamMemberToEdit(member);
		setIsFormOpen(true);
	};

	const handleSuccess = () => {
		setIsFormOpen(false);
		fetchTeam();
	};

	return (
		<div className='view-container'>
			<header className='cms-main-content__header'>
				<div>
					<h1>Equipo Mood</h1>
					<p>Administra a los líderes y miembros de la agencia.</p>
				</div>
				<button className='cms-btn-primary' onClick={openCreateForm}>
					<Plus size={16} strokeWidth={3} /> Nuevo Miembro
				</button>
			</header>

			<TeamTable
				team={team}
				onToggleStatus={handleToggleStatus}
				onEdit={openEditForm}
			/>

			{isFormOpen && (
				<div className='cms-sheet-overlay' onClick={() => setIsFormOpen(false)}>
					<div
						className='cms-sheet-content'
						onClick={(e) => e.stopPropagation()}
					>
						<TeamForm
							memberToEdit={teamMemberToEdit}
							onSubmitSuccess={handleSuccess}
							onCancel={() => setIsFormOpen(false)}
						/>
					</div>
				</div>
			)}

			<ConfirmModal
				isOpen={confirmDialog.isOpen}
				message={confirmDialog.message}
				onConfirm={confirmDialog.onConfirm}
				onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
			/>
		</div>
	);
};

export default EquipoView;
