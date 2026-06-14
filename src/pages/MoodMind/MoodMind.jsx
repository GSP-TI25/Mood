// src/pages/MoodMind/MoodMind.jsx
import Navbar from "../../components/Navbar/Navbar";
import MoodMindHero from "../../components/MoodMindHero/MoodMindHero";
import MoodMindFeatures from "../../components/MoodMindFeatures/MoodMindFeatures";
import MoodMindWorkflow from "../../components/MoodMindWorkflow/MoodMindWorkflow";
import MoodApproach from "../../components/MoodApproach/MoodApproach";
import Footer from "../../components/Footer/Footer";
import "./MoodMind.scss";

/**
 * Componente principal de la página MoodMind.
 * Orquesta las secciones enfocadas en la metodología, herramientas y el enfoque de la agencia.
 */
const MoodMind = () => {
	return (
		<main className='mood-mind'>
			<Navbar />

			<MoodMindHero />
			<MoodMindFeatures />
			<MoodMindWorkflow />
			<MoodApproach />

			<div className='mood-mind__footer-area'>
				<Footer />
			</div>
		</main>
	);
};

export default MoodMind;
