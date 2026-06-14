// src/components/Hero/Hero.jsx
import {
	Palette,
	Monitor,
	TrendingUp,
	Share2,
	Video,
	MessageCircle,
	Briefcase,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BlurText from "../BlurText/BlurText";
import "./Hero.scss";

/**
 * Componente Hero.
 * Representa la sección principal (above the fold) de la página de inicio.
 */
const Hero = () => {
	const { t } = useTranslation();

	const skills = [
		{ nameKey: "branding", icon: Palette },
		{ nameKey: "web", icon: Monitor },
		{ nameKey: "marketing", icon: TrendingUp },
		{ nameKey: "social", icon: Share2 },
		{ nameKey: "av", icon: Video },
	];

	return (
		<section className='hero'>
			<div className='hero__container'>
				<BlurText
					text={t("hero.title")}
					delay={100}
					animateBy='words'
					direction='top'
					as='h1'
					highlightWords={[t("hero.highlight")]}
					className='hero__title hero__title-text'
				/>

				<BlurText
					text={t("hero.paragraph")}
					delay={40}
					animateBy='words'
					direction='top'
					as='p'
					className='hero__paragraph'
				/>

				<div className='hero__skills'>
					{skills.map((skill, index) => (
						<div key={index} className='hero__skill-item'>
							<skill.icon
								size={18}
								className='hero__skill-icon'
								strokeWidth={1.5}
							/>
							<span className='hero__skill-text'>
								{t(`hero.skills.${skill.nameKey}`)}
							</span>
						</div>
					))}
				</div>

				<div className='hero__actions'>
					<Link to='/contacto' className='btn-hero btn-hero--primary'>
						<span>{t("hero.buttons.talk")}</span>
						<MessageCircle size={20} strokeWidth={2} />
					</Link>
					<Link to='/mood-print' className='btn-hero btn-hero--secondary'>
						<span>{t("hero.buttons.projects")}</span>
						<Briefcase size={20} strokeWidth={2} />
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Hero;
