// src/components/MoodMindFeatures/MoodMindFeatures.jsx
import FadeContent from "../FadeContent/FadeContent";
import DotGrid from "../DotGrid/DotGrid";
import { useTranslation } from "react-i18next";
import "./MoodMindFeatures.scss";

/**
 * Componente MoodMindFeatures.
 * Muestra la visión actual y futura de la agencia utilizando tarjetas con efecto
 * Glassmorphism sobre un fondo interactivo (DotGrid).
 */
const MoodMindFeatures = () => {
	const { t } = useTranslation();

	return (
		<section className='mood-mind-features' id='moodmind-features'>
			<div className='mood-mind-features__container'>
				<FadeContent duration={0.8} delay={0.2} direction='bottom'>
					<div className='mood-mind-features__main-card'>
						{/* Capa Base: Fondo interactivo de malla de puntos */}
						<div className='mood-mind-features__bg'>
							<DotGrid
								dotSize={3}
								gap={10}
								baseColor='#2a2a2c'
								activeColor='#4ade80'
								proximity={100}
								shockRadius={200}
								shockStrength={5}
								resistance={750}
								returnDuration={1.5}
							/>
						</div>

						{/* Capa Superior: Contenido de la visión */}
						<div className='mood-mind-features__content'>
							{/* Columna Izquierda: Visión actual */}
							<div className='mood-mind-features__section'>
								<div className='mood-mind-features__badge'>
									<span className='mood-mind-features__badge-dot'></span>
									{t("moodMindFeatures.badgeToday")}
								</div>

								<div className='mood-mind-features__glass-card'>
									<p className='mood-mind-features__text'>
										{t("moodMindFeatures.descToday")}
									</p>
								</div>
							</div>

							{/* Columna Derecha: Visión futura */}
							<div className='mood-mind-features__section'>
								<div className='mood-mind-features__badge'>
									<span className='mood-mind-features__badge-dot'></span>
									{t("moodMindFeatures.badgeFuture")}
								</div>

								<div className='mood-mind-features__glass-card mood-mind-features__glass-card--highlight'>
									<h3 className='mood-mind-features__hero-text'>
										{t("moodMindFeatures.heroText")}
									</h3>
									<p className='mood-mind-features__text'>
										{t("moodMindFeatures.descFuture")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</FadeContent>
			</div>
		</section>
	);
};

export default MoodMindFeatures;
