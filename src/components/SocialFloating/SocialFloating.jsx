// src/components/SocialFloating/SocialFloating.jsx
import { useState, useEffect } from "react";
import Facebook from "../Icons/Facebook";
import Instagram from "../Icons/Instagram";
import Linkedin from "../Icons/Linkedin";
import "./SocialFloating.scss";

/**
 * Componente flotante de Redes Sociales.
 * En escritorio, se compacta al borde derecho dinámicamente al hacer scroll.
 * En tablet/móvil, permanece anclado al borde derecho por defecto vía CSS.
 */
const SocialFloating = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<aside
			className={`social-floating ${isScrolled ? "social-floating--scrolled" : ""}`}
		>
			<a
				href='https://www.facebook.com/moodper'
				target='_blank'
				rel='noreferrer'
				className='social-floating__link'
				aria-label='Facebook'
			>
				<Facebook size={22} className='social-floating__icon' />
			</a>
			<a
				href='https://www.instagram.com/mood.advertising/'
				target='_blank'
				rel='noreferrer'
				className='social-floating__link'
				aria-label='Instagram'
			>
				<Instagram size={22} className='social-floating__icon' />
			</a>
			<a
				href='https://www.linkedin.com/company/moodagenciacreativa/'
				target='_blank'
				rel='noreferrer'
				className='social-floating__link'
				aria-label='LinkedIn'
			>
				<Linkedin size={22} className='social-floating__icon' />
			</a>
		</aside>
	);
};

export default SocialFloating;
