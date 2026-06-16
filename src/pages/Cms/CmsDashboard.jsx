// src/pages/Cms/CmsDashboard.jsx
import { useState, useEffect } from "react";
import CmsSidebar from "../../components/Cms/CmsSidebar";
import CmsHome from "./Views/CmsHome/CmsHome";
import VacantesView from "./Views/Vacantes/VacantesView";
import ProyectosView from "./Views/Proyectos/ProyectosView";
import EquipoView from "./Views/Equipo/EquipoView";
import PostulantesView from "./Views/Postulantes/PostulantesView";
import UsuariosView from "./Views/Usuarios/UsuariosView";
import Profile from "../../components/Cms/Profile";
import "./CmsDashboard.scss";

const getLoadingPhrase = (tab) => {
	const phrases = {
		inicio: "Preparando tu panel de control...",
		vacantes: "Buscando al próximo talento que rompa el molde...",
		postulantes: "Analizando perfiles, descubriendo estrellas...",
		proyectos: "Renderizando casos de éxito e impacto...",
		equipo: "Sincronizando talento humano e Inteligencia Artificial...",
		configuracion: "Ajustando los engranajes del sistema...",
		perfil: "Cargando tu identidad en el ecosistema Mood...",
	};
	return phrases[tab] || "Cargando...";
};

const CmsDashboard = () => {
	const [activeTab, setActiveTab] = useState(() => {
		return localStorage.getItem("cms_active_tab") || "inicio";
	});

	const [isChangingTab, setIsChangingTab] = useState(false);

	useEffect(() => {
		localStorage.setItem("cms_active_tab", activeTab);
		setIsChangingTab(true);
		const timer = setTimeout(() => setIsChangingTab(false), 800); // 3s es mucho, lo ajusté a 0.8s para mejor UX
		return () => clearTimeout(timer);
	}, [activeTab]);

	const renderActiveView = () => {
		switch (activeTab) {
			case "inicio":
				return <CmsHome setActiveTab={setActiveTab} />;
			case "vacantes":
				return <VacantesView />;
			case "perfil":
				return <Profile />;
			case "proyectos":
				return <ProyectosView />;
			case "equipo":
				return <EquipoView />;
			case "postulantes":
				return <PostulantesView />;
			case "configuracion":
				return <UsuariosView />;
			default:
				return <CmsHome setActiveTab={setActiveTab} />;
		}
	};

	return (
		<div className='cms-layout'>
			<CmsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
			<main className='cms-main-content'>
				{isChangingTab ? (
					<div className='cms-tab-loader'>
						<div className='cms-tab-loader__spinner'></div>
						<p className='cms-tab-loader__phrase'>
							{getLoadingPhrase(activeTab)}
						</p>
					</div>
				) : (
					renderActiveView()
				)}
			</main>
		</div>
	);
};

export default CmsDashboard;
