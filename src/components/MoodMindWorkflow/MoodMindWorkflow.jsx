// src/components/MoodMindWorkflow/MoodMindWorkflow.jsx
import { useRef, useState } from "react";
import {
	motion,
	useScroll,
	useMotionValueEvent,
	AnimatePresence,
} from "motion/react";
import BlurText from "../BlurText/BlurText";
import { useTranslation } from "react-i18next";
import workflowData from "../../data/workflow.json"; // Importación de los datos
import "./MoodMindWorkflow.scss";

/**
 * Componente MoodMindWorkflow.
 * Representa la metodología de trabajo de la agencia utilizando un diseño "Sticky Scroll".
 * A medida que el usuario hace scroll, la vista se mantiene fija y el contenido
 * (textos e imágenes) se actualiza dinámicamente en base al progreso.
 */
const MoodMindWorkflow = () => {
	const { t } = useTranslation();
	const containerRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(0);

	// Calcula el progreso de scroll dentro del contenedor (valores de 0 a 1)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	// Mapea el progreso del scroll al índice de los datos disponibles
	useMotionValueEvent(scrollYProgress, "change", (latest) => {
		const newIndex = Math.floor(latest * 3.99);
		if (newIndex !== activeIndex) {
			setActiveIndex(newIndex);
		}
	});

	// Variables dinámicas para la traducción del slide activo
	const currentSlideId = workflowData[activeIndex].id;
	const currentTitle = t(`moodMindWorkflow.slides.${currentSlideId}.title`);
	const currentBullets =
		t(`moodMindWorkflow.slides.${currentSlideId}.bullets`, {
			returnObjects: true,
		}) || [];

	return (
		<section className='mood-mind-workflow' ref={containerRef}>
			<div className='mood-mind-workflow__sticky'>
				<div className='mood-mind-workflow__container'>
					<div className='mood-mind-workflow__header'>
						<div className='mood-mind-workflow__badge'>
							<span className='mood-mind-workflow__badge-dot'></span>
							{t("moodMindWorkflow.badge")}
						</div>
						<h2 className='mood-mind-workflow__title'>
							{t("moodMindWorkflow.title")}
						</h2>
					</div>

					<div className='mood-mind-workflow__split'>
						{/* Columna Izquierda: Imágenes animadas */}
						<div className='mood-mind-workflow__image-wrapper'>
							<AnimatePresence mode='popLayout'>
								<motion.img
									key={activeIndex}
									src={workflowData[activeIndex].image}
									alt={currentTitle}
									className='mood-mind-workflow__image'
									initial={{
										clipPath: "inset(50% round 16px)",
										scale: 1.3,
										opacity: 0,
									}}
									animate={{
										clipPath: "inset(0% round 16px)",
										scale: 1,
										opacity: 1,
									}}
									exit={{ opacity: 0, transition: { duration: 0.3 } }}
									transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
								/>
							</AnimatePresence>
						</div>

						{/* Columna Derecha: Barra de progreso y textos */}
						<div className='mood-mind-workflow__content'>
							<div className='mood-mind-workflow__progress-track'>
								<motion.div
									className='mood-mind-workflow__progress-fill'
									style={{ scaleX: scrollYProgress }}
								/>
							</div>

							<div className='mood-mind-workflow__info'>
								<div className='mood-mind-workflow__number'>
									0{activeIndex + 1}
								</div>

								<div className='mood-mind-workflow__details'>
									<div className='mood-mind-workflow__slide-title'>
										<BlurText
											key={`title-${activeIndex}`}
											text={currentTitle}
											delay={30}
											animateBy='words'
											direction='top'
										/>
									</div>

									<AnimatePresence mode='wait'>
										<motion.ul
											key={`desc-${activeIndex}`}
											className='mood-mind-workflow__bullets'
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.4, delay: 0.2 }}
										>
											{currentBullets.map((bullet, i) => (
												<li key={i}>{bullet}</li>
											))}
										</motion.ul>
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MoodMindWorkflow;
