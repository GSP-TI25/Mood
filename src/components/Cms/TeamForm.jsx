import { useState, useRef } from "react";
import { ArrowRight, Image as ImageIcon, Trash2, Info } from "lucide-react";
import "./TeamForm.scss";

const TeamForm = ({ onSubmitSuccess, onCancel, memberToEdit }) => {
	const fileInputRef = useRef(null);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState(
		memberToEdit?.image_url || "",
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		name: memberToEdit?.name || "",
		role_key: memberToEdit?.role_key || "", // Seguirá llamándose role_key en BD, pero lo trataremos como 'Cargo'
		linkedin: memberToEdit?.linkedin || "",
	});

	const handleInputChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (file.size / (1024 * 1024) > 2) {
			alert("⚠️ La foto no debe superar los 2MB.");
			e.target.value = "";
			return;
		}
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const clearImage = () => {
		setImageFile(null);
		setImagePreview("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleFinalSubmit = async (e) => {
		e.preventDefault();

		const confirmPublish = window.confirm(
			memberToEdit
				? "¿Guardar cambios del miembro?"
				: "¿Agregar este miembro al equipo?",
		);
		if (!confirmPublish) return;

		setIsSubmitting(true);
		const token = localStorage.getItem("cms_token");

		const dataToSend = new FormData();
		dataToSend.append("name", formData.name);
		// 🌟 AHORA LO ENVIAMOS TAL CUAL LO ESCRIBE EL USUARIO (sin toLowerCase)
		dataToSend.append("role_key", formData.role_key.trim());
		dataToSend.append("linkedin", formData.linkedin);

		if (imageFile) {
			dataToSend.append("image_url", imageFile);
		}

		try {
			const url = memberToEdit
				? `http://localhost:5000/api/team/${memberToEdit.id}`
				: "http://localhost:5000/api/team";
			const method = memberToEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method: method,
				headers: { Authorization: `Bearer ${token}` },
				body: dataToSend,
			});

			if (response.ok) {
				alert("✅ ¡Equipo actualizado!");
				onSubmitSuccess();
			} else {
				alert("❌ Error al guardar el miembro.");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='cms-team-form'>
			<div className='cms-team-form__header-fixed'>
				<h2>{memberToEdit ? "Editar Miembro" : "Nuevo Miembro"}</h2>
			</div>

			<form
				className='cms-team-form__step-wrapper'
				onSubmit={handleFinalSubmit}
			>
				<div className='cms-team-form__scroll-area'>
					<div className='cms-team-form__info-box'>
						<Info size={18} />
						<p>
							<strong>Regla de visualización:</strong> Si subes una foto, el
							miembro aparecerá en la sección superior de{" "}
							<strong>Liderazgo</strong>. Si lo dejas sin foto, aparecerá en el
							carrusel inferior del <strong>Equipo</strong>.
						</p>
					</div>

					<div
						className='cms-team-form__section'
						style={{ alignItems: "center" }}
					>
						{imagePreview ? (
							<div
								style={{
									position: "relative",
									width: "160px",
									height: "160px",
									borderRadius: "50%",
									overflow: "hidden",
									backgroundColor: "#f1f5f9",
									border: "2px solid #e2e8f0",
									margin: "0 auto",
								}}
							>
								<img
									src={imagePreview}
									alt='Preview'
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
								<button
									type='button'
									onClick={clearImage}
									style={{
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: "translate(-50%, -50%)",
										backgroundColor: "rgba(255,255,255,0.9)",
										border: "none",
										borderRadius: "50%",
										padding: "12px",
										cursor: "pointer",
										boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
										color: "#ef4444",
									}}
									title='Eliminar foto'
								>
									<Trash2 size={24} />
								</button>
							</div>
						) : (
							<button
								type='button'
								onClick={() => fileInputRef.current.click()}
								style={{
									width: "160px",
									height: "160px",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									borderRadius: "50%",
									border: "2px dashed #cbd5e1",
									backgroundColor: "#fafafa",
									cursor: "pointer",
									transition: "background-color 0.2s",
									gap: "0.5rem",
									color: "#334155",
									margin: "0 auto",
								}}
							>
								<ImageIcon size={32} color='#64748b' />
								<span
									style={{
										fontSize: "0.75rem",
										fontWeight: 600,
										textAlign: "center",
										padding: "0 10px",
									}}
								>
									Subir Foto (Opcional)
								</span>
							</button>
						)}
						<input
							type='file'
							accept='image/jpeg, image/png, image/webp'
							ref={fileInputRef}
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</div>

					<div className='cms-team-form__section'>
						<div className='cms-team-form__group'>
							<label>Nombre y Apellido</label>
							<input
								type='text'
								name='name'
								value={formData.name}
								onChange={handleInputChange}
								required
								placeholder='Ej. Matthias Stimman'
							/>
						</div>

						<div className='cms-team-form__group-row'>
							<div className='cms-team-form__group'>
								{/* 🌟 CAMBIADO EL TÍTULO */}
								<label>Cargo / Rol</label>
								<input
									type='text'
									name='role_key'
									value={formData.role_key}
									onChange={handleInputChange}
									required
									placeholder='Ej. Director Creativo'
								/>
							</div>
							<div className='cms-team-form__group'>
								<label>Enlace de LinkedIn (Opcional)</label>
								<input
									type='url'
									name='linkedin'
									value={formData.linkedin}
									onChange={handleInputChange}
									placeholder='https://linkedin.com/in/...'
								/>
							</div>
						</div>
					</div>
				</div>

				<div className='cms-team-form__actions-fixed'>
					<button
						type='button'
						className='btn-cancel'
						onClick={onCancel}
						disabled={isSubmitting}
					>
						Cancelar
					</button>
					<button type='submit' className='btn-submit' disabled={isSubmitting}>
						{isSubmitting ? "Guardando..." : "Guardar Miembro"}{" "}
						<ArrowRight size={16} />
					</button>
				</div>
			</form>
		</div>
	);
};

export default TeamForm;
