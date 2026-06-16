// src/pages/Cms/Views/Postulantes/PostulantesView.jsx
import { useState, useEffect, useCallback } from "react";
import ApplicationsTable from "../../../../components/Cms/ApplicationsTable";
import "./PostulantesView.scss";

/**
 * Componente PostulantesView.
 * Vista para revisar las aplicaciones a las vacantes de trabajo.
 */
const PostulantesView = () => {
	const [applications, setApplications] = useState([]);

	const getAuthHeaders = useCallback(() => {
		const token = localStorage.getItem("cms_token");
		return {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		};
	}, []);

	const fetchApplications = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/applications`,
				{
					headers: getAuthHeaders(),
				},
			);
			if (response.ok) setApplications(await response.json());
		} catch (error) {
			console.error("Error cargando postulaciones:", error);
		}
	};

	useEffect(() => {
		fetchApplications();
	}, [getAuthHeaders]);

	return (
		<div className='view-container'>
			<header className='cms-main-content__header'>
				<div>
					<h1>Base de Postulantes</h1>
					<p>
						Revisa y descarga los perfiles de los talentos que han postulado.
					</p>
				</div>
			</header>

			<ApplicationsTable applications={applications} />
		</div>
	);
};

export default PostulantesView;
