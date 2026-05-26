import { useState } from 'react';
import Select from 'react-select';
import { Plus, Trash2, X } from 'lucide-react';
import './FilterQuestions.scss';

const typeOptions = [
  { value: 'text', label: 'Respuesta Abierta' },
  { value: 'multiple', label: 'Opción Múltiple' },
  { value: 'number', label: 'Numérica (Años, Salario)' },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: state.isFocused ? '#000000' : 'rgba(0, 0, 0, 0.15)',
    boxShadow: state.isFocused ? '0 0 0 1px #000000' : 'none',
    borderRadius: '6px',
    fontSize: '0.875rem',
    minHeight: '36px',
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected
      ? '#000000'
      : state.isFocused
        ? '#f1f5f9'
        : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#000000',
  }),
};

const FilterQuestions = ({ questions, onChange }) => {
  const [tempOptionText, setTempOptionText] = useState({});

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: 'text',
      label: '',
      isRequired: true,
      options: [],
    };
    onChange([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const handleUpdateQuestion = (id, field, value) => {
    const updated = questions.map((q) => {
      if (q.id === id) {
        if (field === 'type') {
          return { ...q, [field]: value, options: [] };
        }
        return { ...q, [field]: value };
      }
      return q;
    });
    onChange(updated);
  };

  const handleAddOption = (questionId) => {
    const optionText = tempOptionText[questionId];
    if (!optionText || !optionText.trim()) return;

    const updated = questions.map((q) => {
      if (q.id === questionId) {
        return { ...q, options: [...q.options, optionText.trim()] };
      }
      return q;
    });

    onChange(updated);
    setFormDataOptionText(questionId, '');
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    const updated = questions.map((q) => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions.splice(optionIndex, 1);
        return { ...q, options: newOptions };
      }
      return q;
    });
    onChange(updated);
  };

  const setFormDataOptionText = (questionId, text) => {
    setTempOptionText({ ...tempOptionText, [questionId]: text });
  };

  return (
    <div className='cms-filter-questions'>
      {/* HEADER LIMPIO (Sin el botón) */}
      <div className='cms-filter-questions__header'>
        <div className='cms-filter-questions__header-text'>
          <h3>Preguntas de Filtrado</h3>
          <p>
            Define las preguntas clave que responderán los candidatos al
            postularse.
          </p>
        </div>
      </div>

      <div className='cms-filter-questions__list'>
        {/* LISTA DE PREGUNTAS CREADAS */}
        {questions.map((q, index) => (
          <div
            key={q.id}
            className='question-card'
          >
            <div className='question-card__header'>
              <span className='question-card__badge'>Pregunta {index + 1}</span>
              <button
                type='button'
                className='question-card__delete-btn'
                onClick={() => handleRemoveQuestion(q.id)}
                title='Eliminar pregunta'
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className='question-card__body'>
              <div className='question-card__row'>
                <div className='question-card__group flex-3'>
                  <label>Enunciado / Pregunta</label>
                  <input
                    type='text'
                    value={q.label}
                    onChange={(e) =>
                      handleUpdateQuestion(q.id, 'label', e.target.value)
                    }
                    placeholder='Ej. ¿Cuántos años de experiencia tienes manejando React?'
                    required
                  />
                </div>

                <div className='question-card__group flex-2'>
                  <label>Tipo de Respuesta</label>
                  <Select
                    options={typeOptions}
                    value={typeOptions.find((opt) => opt.value === q.type)}
                    onChange={(opt) =>
                      handleUpdateQuestion(q.id, 'type', opt.value)
                    }
                    styles={customSelectStyles}
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className='question-card__settings-row'>
                <label className='checkbox-setting'>
                  <input
                    type='checkbox'
                    checked={q.isRequired}
                    onChange={(e) =>
                      handleUpdateQuestion(q.id, 'isRequired', e.target.checked)
                    }
                  />
                  <span>Pregunta obligatoria</span>
                </label>
              </div>

              {q.type === 'multiple' && (
                <div className='question-card__options-section'>
                  <label>Opciones de selección</label>
                  <div className='options-grid'>
                    {q.options.map((option, optIdx) => (
                      <div
                        key={optIdx}
                        className='option-tag'
                      >
                        <span>{option}</span>
                        <button
                          type='button'
                          onClick={() => handleRemoveOption(q.id, optIdx)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className='question-card__add-option-bar'>
                    <input
                      type='text'
                      value={tempOptionText[q.id] || ''}
                      onChange={(e) =>
                        setFormDataOptionText(q.id, e.target.value)
                      }
                      placeholder='Ej. Más de 3 años'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption(q.id);
                        }
                      }}
                    />
                    <button
                      type='button'
                      onClick={() => handleAddOption(q.id)}
                    >
                      Agregar Opc.
                    </button>
                  </div>
                </div>
              )}

              {(q.type === 'text' || q.type === 'number') && (
                <div className='question-card__preview'>
                  <div className='preview-textarea'>
                    {q.type === 'number'
                      ? 'El candidato ingresará un valor numérico (Ej: 3, 5000, etc.)'
                      : 'El candidato responderá en un campo de texto abierto...'}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 🌟 NUEVO BOTÓN ANCHO AL FINAL */}
        <button
          type='button'
          className='cms-btn-add-block'
          onClick={handleAddQuestion}
        >
          <Plus size={18} />
          <span>Añadir Pregunta</span>
        </button>
      </div>
    </div>
  );
};

export default FilterQuestions;
