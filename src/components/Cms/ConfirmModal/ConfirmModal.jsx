// src/components/Cms/ConfirmModal/ConfirmModal.jsx
import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.scss';

/**
 * Componente ConfirmModal.
 * Interfaz modal genérica para confirmar acciones críticas antes de ejecutarlas.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla la visibilidad del modal.
 * @param {string} props.message - Mensaje de advertencia principal.
 * @param {Function} props.onConfirm - Función ejecutada al aceptar.
 * @param {Function} props.onCancel - Función ejecutada al cancelar.
 */
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div
      className='cms-confirm-overlay'
      onClick={onCancel}
    >
      <div
        className='cms-confirm-modal'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='cms-confirm-modal__icon'>
          <AlertTriangle
            size={32}
            strokeWidth={2}
          />
        </div>
        <h3>Confirmar Acción</h3>
        <p>{message}</p>

        <div className='cms-confirm-modal__actions'>
          <button
            className='btn-cancel'
            onClick={onCancel}
          >
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
