// src/components/Cms/ConfirmModal/ConfirmModal.jsx
import { AlertTriangle } from "lucide-react";
import "./ConfirmModal.scss";

/**
 * Componente ConfirmModal.
 * Modal genérico para confirmar acciones destructivas o cambios de estado.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal es visible.
 * @param {string} props.message - Mensaje de advertencia a mostrar.
 * @param {Function} props.onConfirm - Acción a ejecutar si el usuario acepta.
 * @param {Function} props.onCancel - Acción a ejecutar si el usuario cancela.
 */
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
	if (!isOpen) return null;

	return (
		<div className='cms-confirm-overlay' onClick={onCancel}>
			<div className='cms-confirm-modal' onClick={(e) => e.stopPropagation()}>
				<div className='cms-confirm-modal__icon'>
					<AlertTriangle size={32} strokeWidth={2} />
				</div>
				<h3>Confirmar Acción</h3>
				<p>{message}</p>

				<div className='cms-confirm-modal__actions'>
					<button className='btn-cancel' onClick={onCancel}>
						Cancelar
					</button>
					<button
						className='btn-confirm'
						onClick={() => {
							onConfirm();
							onCancel();
						}}
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;
