// src/components/Testimonials/Testimonials.jsx
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import reviewsData from "../../data/testimonials.json"; // Importación dinámica
import "./Testimonials.scss";

/**
 * Componente de Testimonios.
 * Renderiza un carrusel 3D infinito con reseñas de clientes, con soporte responsivo para móviles.
 */
const Testimonials = () => {
	const { t } = useTranslation();
	const [activeIndex, setActiveIndex] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

	// Escucha del viewport para adaptar los márgenes del carrusel en pantallas pequeñas
	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 475);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Rotación automática del carrusel cada 4.5s
	useEffect(() => {
		const timer = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % reviewsData.length);
		}, 4500);
		return () => clearInterval(timer);
	}, []);

	// Configuraciones de animación y profundidad (Eje Z y X)
	const cardVariants = {
		active: { x: "0%", scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 3 },
		prev: {
			x: isMobile ? "-35%" : "-55%",
			scale: isMobile ? 0.75 : 0.7,
			opacity: 0.5,
			filter: "blur(0px)",
			zIndex: 2,
		},
		next: {
			x: isMobile ? "35%" : "55%",
			scale: isMobile ? 0.75 : 0.7,
			opacity: 0.55,
			filter: "blur(0px)",
			zIndex: 2,
		},
		hidden: {
			x: "0%",
			scale: 0.5,
			opacity: 0,
			filter: "blur(10px)",
			zIndex: 1,
		},
	};

	return (
		<section className='testimonials' id='agencia'>
			<div className='testimonials__container'>
				{/* Columna de Texto */}
				<div className='testimonials__seo-column'>
					<h2 className='testimonials__title'>
						{t("testimonials.title1")} <span>{t("testimonials.title2")}</span>
					</h2>
					<p className='testimonials__paragraph'>
						{t("testimonials.desc1")}
						<strong>{t("testimonials.descStrong")}</strong>
						{t("testimonials.desc2")}
					</p>
				</div>

				{/* Columna de Carrusel 3D */}
				<div className='testimonials__carousel-column'>
					<div className='testimonials__carousel'>
						{reviewsData.map((review, i) => {
							// Lógica de cálculo posicional infinito
							let offset = i - activeIndex;
							if (offset < -2) offset += reviewsData.length;
							if (offset > 2) offset -= reviewsData.length;

							let position = "hidden";
							if (offset === 0) position = "active";
							else if (
								offset === -1 ||
								(offset === reviewsData.length - 1 && activeIndex === 0)
							)
								position = "prev";
							else if (
								offset === 1 ||
								(offset === -(reviewsData.length - 1) &&
									activeIndex === reviewsData.length - 1)
							)
								position = "next";

							return (
								<motion.div
									key={review.id}
									className='review-card'
									variants={cardVariants}
									initial='hidden'
									animate={position}
									transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}
									onClick={() => setActiveIndex(i)}
								>
									<img
										src={review.image}
										alt={t(`testimonials.reviews.${review.id}.name`)}
										className='review-card__background'
										loading='lazy'
										width={400}
										height={600}
										crossOrigin='anonymous'
										referrerPolicy='no-referrer'
									/>
									<div className='review-card__content'>
										<div className='review-card__meta'>
											<h3 className='review-card__name'>
												{t(`testimonials.reviews.${review.id}.name`)}
											</h3>
											<span className='review-card__company'>
												{t(`testimonials.reviews.${review.id}.company`)}
											</span>
										</div>
										<p className='review-card__text'>
											{t(`testimonials.reviews.${review.id}.text`)}
										</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
