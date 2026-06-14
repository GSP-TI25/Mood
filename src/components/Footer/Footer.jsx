// src/components/Footer/Footer.jsx
import { ChevronRight, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.scss";

/**
 * Componente Footer.
 * Layout adaptativo:
 * - Desktop: Dos columnas (Izquierda: Marca/CTA | Derecha: Menús y scroll).
 * - Móvil: Flujo vertical.
 */
const Footer = () => {
	const { t } = useTranslation();
	const currentYear = new Date().getFullYear();

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<footer className='footer'>
			<div className='footer__container'>
				<div className='footer__top'>
					<div className='footer__brand-section'>
						<h2 className='footer__slogan'>{t("footer.slogan")}</h2>

						<div className='footer__jobs'>
							<Link to='/trabaja_con_nosotros' className='btn-jobs'>
								<span className='btn-jobs__text'>{t("footer.btnJoin")}</span>
								<span className='btn-jobs__icon'>
									<ChevronRight size={18} strokeWidth={2} />
								</span>
							</Link>
						</div>
					</div>

					<div className='footer__menus-wrapper'>
						<div className='footer__menus'>
							<div className='footer__nav-group'>
								<h3 className='footer__nav-title'>{t("footer.navTitle")}</h3>
								<ul className='footer__nav-list'>
									<li>
										<Link to='/adn-mood' className='footer__nav-link'>
											{t("navbar.adn")}
										</Link>
									</li>
									<li>
										<Link to='/mood-print' className='footer__nav-link'>
											{t("navbar.print")}
										</Link>
									</li>
									<li>
										<Link to='/mood-mind' className='footer__nav-link'>
											#MoodMind
										</Link>
									</li>
								</ul>
							</div>

							<div className='footer__nav-group'>
								<h4 className='footer__nav-title'>
									{t("footer.connectTitle")}
								</h4>
								<ul className='footer__nav-list'>
									<li>
										<a
											href='https://www.linkedin.com/company/moodagenciacreativa/'
											className='footer__nav-link'
											target='_blank'
											rel='noreferrer'
										>
											LinkedIn
										</a>
									</li>
									<li>
										<a
											href='https://www.instagram.com/mood.advertising/'
											className='footer__nav-link'
											target='_blank'
											rel='noreferrer'
										>
											Instagram
										</a>
									</li>
									<li>
										<a
											href='https://www.facebook.com/moodper'
											className='footer__nav-link'
											target='_blank'
											rel='noreferrer'
										>
											Facebook
										</a>
									</li>
								</ul>
							</div>
						</div>

						<button
							className='footer__scroll-top'
							onClick={scrollToTop}
							aria-label='Volver arriba'
						>
							<ArrowUp size={20} strokeWidth={1.5} />
						</button>
					</div>
				</div>

				<div className='footer__bottom'>
					<p>
						&copy; {currentYear} {t("footer.copyright")}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
