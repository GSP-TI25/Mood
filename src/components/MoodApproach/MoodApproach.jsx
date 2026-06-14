// src/components/MoodApproach/MoodApproach.jsx
import { Search, Zap, Sparkles } from "lucide-react";
import FadeContent from "../FadeContent/FadeContent";
import BlurText from "../BlurText/BlurText";
import { useTranslation } from "react-i18next";
import approachData from "../../data/approach.json"; // Importación de datos estáticos
import "./MoodApproach.scss";

// Diccionario para mapear los strings del JSON a los componentes de iconos reales de Lucide
const iconMap = {
	Search,
	Zap,
	Sparkles,
};

/**
 * Componente MoodApproach.
 * Renderiza el enfoque y los pilares de la metodología de la agencia mediante
 * un diseño de grilla asimétrica. Destaca el tercer pilar cambiando su esquema de colores.
 */
const MoodApproach = () => {
	const { t } = useTranslation();

	return (
		<section className='mood-approach'>
			<div className='mood-approach__container'>
				{/* Cabecera de la sección */}
				<div className='mood-approach__header'>
					<div className='mood-approach__header-left'>
						<FadeContent duration={0.8} delay={0.1} direction='right'>
							<div className='mood-approach__badge'>
								<span className='mood-approach__badge-dot'></span>
								{t("moodApproach.badge")}
							</div>
						</FadeContent>
					</div>

					<div className='mood-approach__header-right'>
						<h2 className='mood-approach__title'>
							<span className='mood-approach__title-line'>
								<BlurText
									text={t("moodApproach.title1")}
									as='span'
									delay={30}
									animateBy='words'
									direction='top'
								/>
							</span>
							<span className='mood-approach__title-line'>
								<BlurText
									text={t("moodApproach.title2")}
									as='span'
									delay={100}
									animateBy='words'
									direction='top'
								/>
							</span>
						</h2>

						<FadeContent duration={0.8} delay={0.3} direction='bottom'>
							<p className='mood-approach__description'>
								{t("moodApproach.description")}
							</p>
						</FadeContent>
					</div>
				</div>

				{/* Grilla de Tarjetas dinámicas */}
				<div className='mood-approach__grid'>
					{approachData.map((card, index) => {
						const IconComponent = iconMap[card.iconName];

						return (
							<FadeContent
								key={card.id}
								duration={0.8}
								delay={0.2 * (index + 1)}
								direction='bottom'
							>
								<div className='mood-approach__card'>
									<div className='mood-approach__card-icon'>
										{IconComponent && (
											<IconComponent size={32} strokeWidth={1.5} />
										)}
									</div>

									<div className='mood-approach__card-content'>
										<span className='mood-approach__card-overline'>
											{t(`moodApproach.cards.${card.id}.overline`)}
										</span>
										<h3 className='mood-approach__card-title'>
											{t(`moodApproach.cards.${card.id}.title`)}
										</h3>
										<p className='mood-approach__card-desc'>
											{t(`moodApproach.cards.${card.id}.description`)}
										</p>
									</div>
								</div>
							</FadeContent>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default MoodApproach;
