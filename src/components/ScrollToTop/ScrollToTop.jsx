// src/components/ScrollToTop/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente utilitario ScrollToTop.
 * Escucha los cambios de ruta (`pathname`) de la aplicación.
 * Al detectar un cambio, reinicia las alturas del documento y fuerza la
 * ventana a volver a la posición superior (0,0) de forma instantánea.
 * * Esto previene bugs visuales donde la nueva vista hereda la posición de
 * scroll anterior o alturas fijas residuales calculadas por bibliotecas
 * de animación (ej. GSAP ScrollTrigger).
 */
const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		// 1. Limpieza de dimensiones residuales en el DOM
		document.documentElement.style.height = "auto";
		document.body.style.height = "auto";

		// 2. Micro-retraso para asegurar que el nuevo componente ya está montado
		// antes de forzar la posición del scroll al inicio.
		const timeoutId = setTimeout(() => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: "instant",
			});
		}, 10);

		return () => clearTimeout(timeoutId);
	}, [pathname]);

	return null;
};

export default ScrollToTop;
