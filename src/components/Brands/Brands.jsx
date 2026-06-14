// src/components/Brands/Brands.jsx
import { useTranslation } from "react-i18next";
import LogoLoop from "../LogoLoop/LogoLoop";
import brandLogos from "../../data/brands.json"; // Ajusta la ruta según donde guardes el JSON
import "./Brands.scss";

/**
 * Componente Brands.
 * Renderiza una sección con carruseles infinitos de logos de clientes/marcas.
 * Los datos se extraen de un JSON estático para mejorar la escalabilidad y legibilidad.
 */
const Brands = () => {
	const { t } = useTranslation();

	// Dividimos el array de logos en dos mitades para alimentar ambos carruseles
	const half = Math.ceil(brandLogos.length / 2);
	const firstRowLogos = brandLogos.slice(0, half);
	const secondRowLogos = brandLogos.slice(half);

	return (
		<section className='brands'>
			<div className='brands__container'>
				<p className='brands__subtitle'>{t("brands.subtitle")}</p>

				<div className='brands__carousel-wrapper'>
					<LogoLoop
						logos={firstRowLogos}
						speed={30}
						direction='left'
						logoHeight={45}
						gap={60}
						hoverSpeed={10}
						scaleOnHover={true}
						fadeOut={false}
					/>

					<LogoLoop
						logos={secondRowLogos}
						speed={30}
						direction='right'
						logoHeight={45}
						gap={60}
						hoverSpeed={10}
						scaleOnHover={true}
						fadeOut={false}
					/>
				</div>
			</div>
		</section>
	);
};

export default Brands;
