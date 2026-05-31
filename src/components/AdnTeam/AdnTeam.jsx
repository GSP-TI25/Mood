import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import Linkedin from "../Icons/Linkedin";
import FadeContent from "../FadeContent/FadeContent";
import "./AdnTeam.scss";

const AdnTeam = () => {
	const { t } = useTranslation();
	const sliderRef = useRef(null);
	const [scrollProgress, setScrollProgress] = useState(0);

	// 🌟 ESTADOS DINÁMICOS
	const [teamMembers, setTeamMembers] = useState([]);
	const [generalTeam, setGeneralTeam] = useState([]);

	useEffect(() => {
		const fetchTeam = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/team");
				const data = await response.json();

				// Filtramos solo los activos
				const activeMembers = data.filter((member) => member.is_active);

				// 🌟 DIVIDIMOS POR LÓGICA DE IMAGEN
				setTeamMembers(
					activeMembers.filter(
						(m) => m.image_url !== null && m.image_url !== "",
					),
				);
				setGeneralTeam(
					activeMembers.filter(
						(m) => m.image_url === null || m.image_url === "",
					),
				);
			} catch (error) {
				console.error("Error al cargar equipo:", error);
			}
		};
		fetchTeam();
	}, []);

	const handleScroll = () => {
		if (!sliderRef.current) return;
		const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
		const maxScroll = scrollWidth - clientWidth;
		const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
		setScrollProgress(progress);
	};

	const scroll = (direction) => {
		if (!sliderRef.current) return;
		const { scrollLeft, scrollWidth, clientWidth, children } =
			sliderRef.current;
		const cardWidth = children[0] ? children[0].offsetWidth + 24 : 300;
		const maxScroll = scrollWidth - clientWidth;

		if (direction === "right") {
			if (scrollLeft >= maxScroll - 10) {
				sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
			} else {
				sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
			}
		} else {
			if (scrollLeft <= 10) {
				sliderRef.current.scrollTo({ left: maxScroll, behavior: "smooth" });
			} else {
				sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
			}
		}
	};

	return (
		<section className='adn-team'>
			<div className='adn-team__content-wrapper'>
				<div className='adn-team__container'>
					<FadeContent duration={0.8} delay={0.1}>
						<div className='adn-team__main-title'>
							<h2>
								{t("adnTeam.title1")} <span>{t("adnTeam.title2")}</span>
							</h2>
						</div>
					</FadeContent>

					<div className='adn-team__layout'>
						<div className='adn-team__info-column'>
							<FadeContent duration={0.8} delay={0.2}>
								<div className='adn-team__badge-wrapper'>
									<div className='adn-team__badge'>
										<span className='adn-team__badge-dot'></span>
										{t("adnTeam.badgeLeadership")}
									</div>
								</div>
								<p className='adn-team__description'>
									{t("adnTeam.descLeadership")}
								</p>
							</FadeContent>
						</div>

						<div className='adn-team__grid'>
							{/* 🌟 RENDERIZAMOS LÍDERES DINÁMICAMENTE */}
							{teamMembers.map((member, index) => (
								<FadeContent
									key={member.id || index}
									duration={0.6}
									delay={0.3 + index * 0.1}
								>
									<div className='team-card'>
										<div className='team-card__image-wrapper'>
											<img
												src={member.image_url}
												alt={member.name}
												className='team-card__image'
												crossOrigin='anonymous'
												referrerPolicy='no-referrer'
											/>
											<a
												href={member.linkedin || "#"}
												className='team-card__linkedin'
												aria-label={`LinkedIn de ${member.name}`}
												target='_blank'
												rel='noreferrer'
											>
												<Linkedin size={18} />
											</a>
										</div>
										<div className='team-card__info-wrapper'>
											<div className='team-card__info'>
												<h3 className='team-card__name'>{member.name}</h3>
												<p className='team-card__role'>{member.role_key}</p>
											</div>
											<button
												className='team-card__action-btn'
												aria-label='Ver perfil completo'
											>
												<ChevronRight size={20} strokeWidth={2.5} />
											</button>
										</div>
									</div>
								</FadeContent>
							))}
						</div>
					</div>

					<div className='team-slider'>
						<FadeContent duration={0.8} delay={0.2}>
							<div className='team-slider__header'>
								<div className='team-slider__badge-wrapper'>
									<div className='adn-team__badge'>
										<span className='adn-team__badge-dot'></span>
										{t("adnTeam.badgeTeam")}
									</div>
								</div>
								<h3 className='team-slider__title'>{t("adnTeam.descTeam")}</h3>
							</div>
						</FadeContent>

						<FadeContent duration={0.8} delay={0.4}>
							<div
								className='team-slider__track'
								ref={sliderRef}
								onScroll={handleScroll}
							>
								{/* 🌟 RENDERIZAMOS EL RESTO DEL EQUIPO DINÁMICAMENTE */}
								{generalTeam.map((member, index) => (
									<div className='member-card' key={member.id || index}>
										<div className='member-card__info'>
											<h4 className='member-card__name'>{member.name}</h4>
											<p className='member-card__role'>{member.role_key}</p>
										</div>
										<div className='member-card__footer'>
											<a
												href={member.linkedin || "#"}
												className='member-card__link'
												target='_blank'
												rel='noreferrer'
											>
												LINKEDIN
											</a>
											<a
												href={member.linkedin || "#"}
												className='member-card__btn'
												aria-label={`LinkedIn de ${member.name}`}
												target='_blank'
												rel='noreferrer'
											>
												<ChevronRight size={18} strokeWidth={2.5} />
											</a>
										</div>
									</div>
								))}
							</div>

							<div className='team-slider__controls'>
								<div className='team-slider__progress'>
									<div
										className='team-slider__progress-bar'
										style={{ width: `${scrollProgress * 100}%` }}
									></div>
								</div>
								<div className='team-slider__arrows'>
									<button onClick={() => scroll("left")} aria-label='Anterior'>
										<ChevronLeft size={22} strokeWidth={2} />
									</button>
									<button
										onClick={() => scroll("right")}
										aria-label='Siguiente'
									>
										<ChevronRight size={22} strokeWidth={2} />
									</button>
								</div>
							</div>
						</FadeContent>
					</div>
				</div>
			</div>

			<div className='adn-team__footer-overlap'></div>
		</section>
	);
};

export default AdnTeam;
