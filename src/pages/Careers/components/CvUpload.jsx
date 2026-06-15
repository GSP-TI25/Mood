// src/pages/Careers/components/CvUpload.jsx
import { UploadCloud, FileText } from "lucide-react";
import "./CvUpload.scss";

/**
 * Componente CvUpload.
 * Renderiza la interfaz de carga de archivos para el Curriculum Vitae.
 * Muestra el estado vacío o la previsualización del archivo cargado.
 *
 * @param {Object} props
 * @param {File|null} props.file - El archivo seleccionado actualmente.
 * @param {Function} props.onChange - Función que maneja el evento de carga.
 */
const CvUpload = ({ file, onChange }) => {
	return (
		<div className='cv-upload-area'>
			<input
				type='file'
				id='cv-upload'
				accept='.pdf,application/pdf'
				onChange={onChange}
				required
				className='cv-upload-input'
			/>
			<label
				htmlFor='cv-upload'
				className={`cv-upload-label ${file ? "has-file" : ""}`}
			>
				{file ? (
					<>
						<FileText size={28} className='icon-success' />
						<div className='file-info'>
							<span className='file-name'>{file.name}</span>
							<span className='file-size'>
								{(file.size / 1024 / 1024).toFixed(2)} MB
							</span>
						</div>
						<span className='file-change-text'>Haz clic para cambiar</span>
					</>
				) : (
					<>
						<UploadCloud size={32} className='icon-upload' />
						<span className='upload-text'>
							Haz clic para subir tu CV o arrástralo aquí
						</span>
						<span className='upload-hint'>
							Formatos soportados: PDF (Máx. 5MB)
						</span>
					</>
				)}
			</label>
		</div>
	);
};

export default CvUpload;
