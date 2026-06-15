// src/pages/Careers/components/SuccessModal.jsx
import { CheckCircle2 } from "lucide-react";
import "./SuccessModal.scss";

/**
 * Componente SuccessModal.
 * Diálogo de confirmación minimalista que informa al usuario que su
 * aplicación ha sido enviada con éxito.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal.
 * @param {Function} props.onClose - Acción a ejecutar al cerrar/volver.
 */
const SuccessModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className='job-app-success-overlay'>
			<div className='job-app-success-modal'>
				<div className='job-app-success-modal__header'>
					<div className='job-app-success-modal__icon'>
						<CheckCircle2 size={26} />
					</div>
					<h3>¡Tu talento está en camino! 🚀</h3>
					<p>
						Hemos recibido tu postulación correctamente en el ecosistema Mood.
						Gestión de Talento revisará tu perfil y se pondrá en contacto
						contigo muy pronto.
					</p>
				</div>
				<button type='button' className='btn-return-home' onClick={onClose}>
					Volver a posiciones
				</button>
			</div>
		</div>
	);
};

export default SuccessModal;
