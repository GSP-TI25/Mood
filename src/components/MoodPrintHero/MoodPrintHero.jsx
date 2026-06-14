// src/components/MoodPrintHero/MoodPrintHero.jsx
import { useTranslation } from "react-i18next";
import BlurText from "../BlurText/BlurText";
import "./MoodPrintHero.scss";

// Categorías estáticas para filtrar el portafolio (Se mantienen las llaves originales para lógica interna)
const CATEGORIES = [
	"Todos",
	"Branding",
	"Diseño Web",
	"Marketing Digital",
	"Social Media",
	"Contenido Audiovisual",
];

/**
 * Componente MoodPrintHero.
 * Encabezado de la vista de Portafolio. Presenta los títulos animados
 * y renderiza las píldoras (botones) de filtrado por categoría.
 * * @param {Object} props
 * @param {string} props.activeCategory - Categoría seleccionada actualmente.
 * @param {Function} props.onCategoryClick - Función despachada al cambiar de categoría.
 */
const MoodPrintHero = ({ activeCategory, onCategoryClick }) => {
	const { t } = useTranslation();

	return (
		<section className='mood-print-hero'>
			<div className='mood-print-hero__container'>
				<div className='mood-print-hero__header'>
					<div className='mood-print-hero__title-group'>
						{/* Primera línea del título */}
						<div className='mood-print-hero__line'>
							<BlurText
								text={t("moodPrintHero.title1")}
								delay={30}
								animateBy='words'
								direction='top'
								as='h1'
								className='mood-print-hero__title mood-print-hero__title--light'
							/>
						</div>

						{/* Segunda línea del título con palabra destacada */}
						<div className='mood-print-hero__line'>
							<BlurText
								text={t("moodPrintHero.title2")}
								delay={45}
								animateBy='words'
								direction='top'
								as='span'
								className='mood-print-hero__highlight'
							/>
							<BlurText
								text={t("moodPrintHero.title3")}
								delay={60}
								animateBy='words'
								direction='top'
								as='h1'
								className='mood-print-hero__title'
							/>
						</div>
					</div>

					<div
						className='mood-print-hero__fade-in'
						style={{ animationDelay: "0.4s" }}
					>
						<p className='mood-print-hero__subtitle'>
							{t("moodPrintHero.subtitle")}
						</p>
					</div>
				</div>

				{/* Filtros de Categorías */}
				<div
					className='mood-print-hero__categories mood-print-hero__fade-in'
					style={{ animationDelay: "0.6s" }}
				>
					<ul className='category-list'>
						{CATEGORIES.map((category, index) => (
							<li
								key={index}
								className={`category-list__item ${activeCategory === category ? "category-list__item--active" : ""}`}
								onClick={() => onCategoryClick(category)}
							>
								<span className='category-list__text'>
									{t(`moodPrintHero.categories.${category}`)}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default MoodPrintHero;
