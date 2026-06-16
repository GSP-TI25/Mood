// src/pages/Cms/Views/Proyectos/ProyectosView.jsx
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import ProjectsTable from "../../../../components/Cms/ProjectsTable";
import ProjectForm from "../../../../components/Cms/ProjectForm";
import ConfirmModal from "../../../../components/Cms/ConfirmModal/ConfirmModal";
import "./ProyectosView.scss";

/**
 * Componente ProyectosView.
 * Vista para la gestión del portafolio (MoodPrint).
 */
const ProyectosView = () => {
	const [projects, setProjects] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [projectToEdit, setProjectToEdit] = useState(null);

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

	const fetchProjects = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects`,
			);
			if (response.ok) setProjects(await response.json());
		} catch (error) {
			console.error("Error cargando proyectos:", error);
		}
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	const handleToggleStatus = (projectId) => {
		setConfirmDialog({
			isOpen: true,
			message: "¿Seguro que deseas cambiar la visibilidad de este proyecto?",
			onConfirm: async () => {
				try {
					const response = await fetch(
						`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/projects/${projectId}/status`,
						{ method: "PATCH", headers: getAuthHeaders() },
					);
					if (response.ok) {
						toast.success("Visibilidad del proyecto actualizada");
						fetchProjects();
					} else {
						toast.error("Error al actualizar el proyecto");
					}
				} catch (error) {
					toast.error("Error de conexión");
				}
			},
		});
	};

	const openCreateForm = () => {
		setProjectToEdit(null);
		setIsFormOpen(true);
	};

	const openEditForm = (project) => {
		setProjectToEdit(project);
		setIsFormOpen(true);
	};

	const handleSuccess = () => {
		setIsFormOpen(false);
		fetchProjects();
	};

	return (
		<div className='view-container'>
			<header className='cms-main-content__header'>
				<div>
					<h1>Portafolio MoodPrint</h1>
					<p>Sube y organiza los casos de éxito de la agencia.</p>
				</div>
				<button className='cms-btn-primary' onClick={openCreateForm}>
					<Plus size={16} strokeWidth={3} /> Nuevo Proyecto
				</button>
			</header>

			<ProjectsTable
				projects={projects}
				onToggleStatus={handleToggleStatus}
				onEdit={openEditForm}
			/>

			{isFormOpen && (
				<div className='cms-sheet-overlay' onClick={() => setIsFormOpen(false)}>
					<div
						className='cms-sheet-content'
						onClick={(e) => e.stopPropagation()}
					>
						<ProjectForm
							projectToEdit={projectToEdit}
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

export default ProyectosView;
