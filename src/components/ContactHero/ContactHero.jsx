// src/components/ContactHero/ContactHero.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import BlurText from "../BlurText/BlurText";
import ContactForm from "./ContactForm";
import "./ContactHero.scss";

/**
 * Componente ContactHero.
 * Renderiza la sección superior de la vista de contacto, incluyendo los títulos
 * principales y el formulario de ingreso.
 * Contiene la lógica visual de retroalimentación ("Water drop overlay")
 * tras el envío exitoso del formulario.
 */
const ContactHero = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [showOverlay, setShowOverlay] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	/**
	 * Orquesta la secuencia de animación y redirección al completar exitosamente el formulario.
	 */
	const handleFormSuccess = () => {
		setShowOverlay(true);

		setTimeout(() => {
			setIsClosing(true);
		}, 4700);

		setTimeout(() => {
			navigate("/");
			window.scrollTo(0, 0);
		}, 5500);
	};

	return (
		<section className='contact-hero'>
			{/* Overlay de Éxito */}
			{showOverlay && (
				<div
					className={`water-drop-overlay ${isClosing ? "fade-out-sequence" : ""}`}
				>
					<div className='water-drop-content'>
						<h2>{t("contactHero.form.feedback.success")}</h2>
					</div>
				</div>
			)}

			<div className='contact-hero__container'>
				{/* Columna Izquierda: Títulos e información */}
				<div className='contact-hero__content'>
					<div className='contact-hero__title-group'>
						<BlurText
							text={t("contactHero.title1")}
							delay={30}
							animateBy='words'
							direction='top'
							as='h1'
							className='contact-hero__title contact-hero__title--light'
						/>
						<div className='contact-hero__line'>
							<BlurText
								text={t("contactHero.title2")}
								delay={45}
								animateBy='words'
								direction='top'
								as='span'
								className='contact-hero__highlight'
							/>
							<BlurText
								text={t("contactHero.title3")}
								delay={60}
								animateBy='words'
								direction='top'
								as='h1'
								className='contact-hero__title'
							/>
						</div>
					</div>

					<div className='contact-hero__fade-in contact-hero__fade-in--delay-1'>
						<p className='contact-hero__subtitle'>
							{t("contactHero.subtitle")}
						</p>
					</div>
				</div>

				{/* Columna Derecha: Formulario */}
				<div className='contact-hero__form-wrapper contact-hero__fade-in contact-hero__fade-in--delay-2'>
					<ContactForm onSuccess={handleFormSuccess} />
				</div>
			</div>
		</section>
	);
};

export default ContactHero;
