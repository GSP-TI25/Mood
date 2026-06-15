// src/components/Masonry/Masonry.jsx
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PlayCircle } from "lucide-react";
import "./Masonry.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook utilitario que evalúa múltiples Media Queries y retorna el valor correspondiente.
 * @param {Array<string>} queries - Arreglo de Media Queries (ej. '(min-width: 1000px)').
 * @param {Array<any>} values - Valores correspondientes a cada query.
 * @param {any} defaultValue - Valor por defecto si ninguna query coincide.
 * @returns {any} El valor del breakpoint actual.
 */
const useMedia = (queries, values, defaultValue) => {
	const get = () =>
		values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
	const [value, setValue] = useState(get);

	useEffect(() => {
		const handler = () => setValue(get);
		queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
		return () =>
			queries.forEach((q) =>
				matchMedia(q).removeEventListener("change", handler),
			);
	}, [queries]);

	return value;
};

/**
 * Hook para medir dinámicamente las dimensiones de un elemento en el DOM.
 * @returns {[import('react').RefObject, {width: number, height: number}]}
 */
const useMeasure = () => {
	const ref = useRef(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useLayoutEffect(() => {
		if (!ref.current) return;
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setSize({ width, height });
		});
		ro.observe(ref.current);
		return () => ro.disconnect();
	}, []);

	return [ref, size];
};

/**
 * Precarga un listado de imágenes para evitar saltos en la animación.
 * @param {Array<string>} urls - Rutas de las imágenes a precargar.
 */
const preloadImages = async (urls) => {
	await Promise.all(
		urls.map(
			(src) =>
				new Promise((resolve) => {
					const img = new Image();
					img.src = src;
					img.onload = img.onerror = () => resolve();
				}),
		),
	);
};

const getThumbnailUrl = (url) => {
	if (!url) return "";
	if (url.match(/\.(mp4|webm|mov|ogg)$/i)) {
		return url.replace(/\.(mp4|webm|mov|ogg)$/i, ".jpg");
	}
	return url;
};

const isVideoMedia = (url) => {
	if (!url) return false;
	return !!url.match(/\.(mp4|webm|mov|ogg)$/i);
};

/**
 * Componente Masonry.
 * Renderiza una cuadrícula estilo "Masonry" asimétrica, calculando dinámicamente
 * las alturas y columnas mediante GSAP y ScrollTrigger.
 *
 * @param {Object} props
 * @param {Array} props.items - Elementos a renderizar.
 * @param {string} props.ease - Curva de animación GSAP.
 * @param {number} props.duration - Duración de entrada.
 * @param {number} props.stagger - Retardo entre elementos.
 * @param {string} props.animateFrom - Dirección de la animación inicial ('top', 'bottom', 'center', 'random').
 * @param {boolean} props.scaleOnHover - Aplica un escalado al pasar el ratón.
 * @param {number} props.hoverScale - Factor de escala al hacer hover.
 * @param {boolean} props.blurToFocus - Aplica un desenfoque inicial que se aclara al hacer scroll.
 * @param {Function} props.onItemClick - Acción personalizada al clickear una tarjeta.
 */
const Masonry = ({
	items,
	ease = "power3.out",
	duration = 0.6,
	stagger = 0.05,
	animateFrom = "bottom",
	scaleOnHover = true,
	hoverScale = 0.95,
	blurToFocus = true,
	onItemClick = null,
}) => {
	const columns = useMedia(
		[
			"(min-width:1500px)",
			"(min-width:1000px)",
			"(min-width:600px)",
			"(min-width:400px)",
		],
		[4, 3, 2, 1],
		1,
	);

	const [containerRef, { width }] = useMeasure();
	const [imagesReady, setImagesReady] = useState(false);

	const hasMounted = useRef(false);
	const ctxRef = useRef(gsap.context(() => {}));

	const getInitialPosition = (item) => {
		const containerRect = containerRef.current?.getBoundingClientRect();
		if (!containerRect) return { x: item.x, y: item.y };

		let direction = animateFrom;

		if (animateFrom === "random") {
			const directions = ["top", "bottom", "left", "right"];
			direction = directions[Math.floor(Math.random() * directions.length)];
		}

		switch (direction) {
			case "top":
				return { x: item.x, y: item.y - 150 };
			case "bottom":
				return { x: item.x, y: item.y + 150 };
			case "left":
				return { x: item.x - 150, y: item.y };
			case "right":
				return { x: item.x + 150, y: item.y };
			case "center":
				return {
					x: containerRect.width / 2 - item.w / 2,
					y: containerRect.height / 2 - item.h / 2,
				};
			default:
				return { x: item.x, y: item.y + 100 };
		}
	};

	useEffect(() => {
		const imageUrls = items.map((i) => getThumbnailUrl(i.img));
		preloadImages(imageUrls).then(() => setImagesReady(true));
	}, [items]);

	const { grid, finalHeight } = useMemo(() => {
		if (!width) return { grid: [], finalHeight: 0 };

		const colHeights = new Array(columns).fill(0);
		const columnWidth = width / columns;

		const gridItems = items.map((child) => {
			const col = colHeights.indexOf(Math.min(...colHeights));
			const x = columnWidth * col;
			const height = child.height / 2;
			const y = colHeights[col];

			colHeights[col] += height;

			return { ...child, x, y, w: columnWidth, h: height };
		});

		return { grid: gridItems, finalHeight: Math.max(...colHeights) };
	}, [columns, items, width]);

	useLayoutEffect(() => {
		if (!imagesReady || !grid.length) return;

		if (!hasMounted.current) {
			ctxRef.current.add(() => {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: containerRef.current,
						start: "top 85%",
					},
				});

				grid.forEach((item, index) => {
					const selector = `[data-key="${item.id}"]`;
					const initialPos = getInitialPosition(item);

					gsap.set(selector, {
						opacity: 0,
						x: initialPos.x,
						y: initialPos.y,
						width: item.w,
						height: item.h,
						...(blurToFocus && { filter: "blur(10px)" }),
					});

					tl.to(
						selector,
						{
							opacity: 1,
							x: item.x,
							y: item.y,
							width: item.w,
							height: item.h,
							...(blurToFocus && { filter: "blur(0px)" }),
							duration: duration,
							ease: ease,
						},
						index * stagger,
					);
				});

				setTimeout(() => {
					ScrollTrigger.refresh();
				}, 150);
			});

			hasMounted.current = true;
		} else {
			ctxRef.current.add(() => {
				grid.forEach((item) => {
					const selector = `[data-key="${item.id}"]`;
					gsap.to(selector, {
						x: item.x,
						y: item.y,
						width: item.w,
						height: item.h,
						duration: duration,
						ease: ease,
						overwrite: "auto",
					});
				});
			});
		}
	}, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

	useEffect(() => {
		return () => ctxRef.current.revert();
	}, []);

	const handleMouseEnter = (e, item) => {
		if (scaleOnHover) {
			gsap.to(`[data-key="${item.id}"]`, {
				scale: hoverScale,
				duration: 0.3,
				ease: "power2.out",
			});
		}
	};

	const handleMouseLeave = (e, item) => {
		if (scaleOnHover) {
			gsap.to(`[data-key="${item.id}"]`, {
				scale: 1,
				duration: 0.3,
				ease: "power2.out",
			});
		}
	};

	return (
		<div
			ref={containerRef}
			className='masonry-list'
			style={{ height: finalHeight }}
		>
			{grid.map((item) => {
				const thumbUrl = getThumbnailUrl(item.img);
				const isVideo = isVideoMedia(item.img);

				return (
					<div
						key={item.id}
						data-key={item.id}
						className='masonry-wrapper'
						onClick={() =>
							onItemClick
								? onItemClick(item)
								: window.open(item.url, "_blank", "noopener")
						}
						onMouseEnter={(e) => handleMouseEnter(e, item)}
						onMouseLeave={(e) => handleMouseLeave(e, item)}
					>
						<div
							className='masonry-img'
							style={{
								backgroundImage: `url('${thumbUrl}')`,
							}}
						>
							{isVideo && (
								<div className='masonry-play-overlay'>
									<PlayCircle size={36} color='#ffffff' strokeWidth={1.5} />
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Masonry;
