// src/pages/MoodPrint/MoodPrint.jsx
import { useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import MoodPrintHero from "../../components/MoodPrintHero/MoodPrintHero";
import MoodPrintProjects from "../../components/MoodPrintProjects/MoodPrintProjects";
import "./MoodPrint.scss";

/**
 * Componente principal de la página MoodPrint.
 * Funciona como contenedor global para la sección de proyectos del portafolio.
 * Administra el estado de la categoría seleccionada y la función de scroll automático hacia los resultados.
 */
const MoodPrint = () => {
	const [selectedCategory, setSelectedCategory] = useState("Todos");
	const projectsRef = useRef(null);

	const handleCategoryClick = (category) => {
		setSelectedCategory(category);

		if (projectsRef.current) {
			projectsRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<main className='mood-print'>
			<Navbar />

			<MoodPrintHero
				activeCategory={selectedCategory}
				onCategoryClick={handleCategoryClick}
			/>

			<div className='mood-print__footer-area'>
				<div ref={projectsRef}>
					<MoodPrintProjects selectedCategory={selectedCategory} />
				</div>

				<Footer />
			</div>
		</main>
	);
};

export default MoodPrint;
