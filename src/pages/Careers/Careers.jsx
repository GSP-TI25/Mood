// src/pages/Careers/Careers.jsx
import Navbar from "../../components/Navbar/Navbar";
import CareersHero from "../../components/Careers/CareersHero";
import CareersJobs from "../../components/Careers/CareersJobs";
import Footer from "../../components/Footer/Footer";
import "./Careers.scss";

/**
 * Componente principal de la página Careers (Bolsa de Trabajo).
 * Orquesta la vista integrando la navegación, el banner principal (Hero),
 * la lista dinámica de empleos y el pie de página.
 */
const Careers = () => {
	return (
		<>
			<Navbar />

			<main className='careers-page'>
				<CareersHero />
				<CareersJobs />
			</main>
			<Footer />
		</>
	);
};

export default Careers;
