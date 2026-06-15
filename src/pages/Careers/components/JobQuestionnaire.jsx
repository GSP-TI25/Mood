// src/pages/Careers/components/JobQuestionnaire.jsx
import "./JobQuestionnaire.scss";

/**
 * Componente JobQuestionnaire.
 * Renderiza dinámicamente las preguntas filtro configuradas para la vacante.
 *
 * @param {Object} props
 * @param {Array} props.questions - Lista de preguntas a renderizar.
 * @param {Object} props.answers - Estado actual de las respuestas.
 * @param {Function} props.onTextAnswer - Handler para inputs de texto/número.
 * @param {Function} props.onCheckboxAnswer - Handler para inputs de selección múltiple.
 */
const JobQuestionnaire = ({
	questions,
	answers,
	onTextAnswer,
	onCheckboxAnswer,
}) => {
	if (!questions || questions.length === 0) return null;

	return (
		<section className='app-section'>
			<h2>Cuestionario</h2>
			<div className='app-questions'>
				{questions.map((q, index) => (
					<div key={q.id} className='app-group'>
						<label>
							{index + 1}. {q.label}{" "}
							{q.isRequired && <span className='required-asterisk'>*</span>}
						</label>

						{(q.type === "text" || q.type === "number") && (
							<textarea
								rows={q.type === "number" ? "1" : "3"}
								required={q.isRequired}
								value={answers[q.id] || ""}
								onChange={(e) => onTextAnswer(q.id, e.target.value)}
								placeholder={
									q.type === "number"
										? "Ingresa un número..."
										: "Tu respuesta..."
								}
							/>
						)}

						{q.type === "multiple" && (
							<div className='checkbox-grid'>
								{q.options.map((opt, i) => (
									<label key={i} className='checkbox-label'>
										<input
											type='checkbox'
											value={opt}
											checked={(answers[q.id] || []).includes(opt)}
											onChange={(e) =>
												onCheckboxAnswer(q.id, opt, e.target.checked)
											}
										/>
										<span>{opt}</span>
									</label>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default JobQuestionnaire;
