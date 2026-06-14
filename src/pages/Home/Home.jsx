// src/pages/Home/Home.jsx
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Brands from "../../components/Brands/Brands";
import Services from "../../components/Services/Services";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";
import SocialFloating from "../../components/SocialFloating/SocialFloating";
import bgVideo from "../../assets/VideoFondoMood.webm";
import "./Home.scss";

/**
 * Componente principal de la página de inicio (Landing Page).
 * Orquesta la carga del video de fondo, navegación y secciones clave.
 */
const Home = () => {
	return (
		<main className='home'>
			<SocialFloating />

			<div className='home__hero-frame'>
				<video className='home__hero-video' autoPlay loop muted playsInline>
					<source src={bgVideo} type='video/webm' />
				</video>

				<div className='home__hero-overlay'></div>

				<div className='home__hero-content'>
					<Navbar />
					<Hero />
				</div>
			</div>

			<Brands />
			<Services />

			<div className='home__footer-area'>
				<Testimonials />
				<Footer />
			</div>
		</main>
	);
};

export default Home;
