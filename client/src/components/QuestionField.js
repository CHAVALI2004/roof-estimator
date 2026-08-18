import '../App.css'

function QuestionField({ question, value, onChange }) {
  if (question.type === "number") {
    return (
      <div className="question-field">
        <label>
          {question.label}
          {question.required && <span> *</span>}
        </label>

        <div className="input-with-unit">
          <input
            type="number"
            value={value || ""}
            min={question.min}
            max={question.max}
            onChange={(event) =>
              onChange(event.target.value)
            }
            placeholder={`Enter ${question.unit || "value"}`}
          />

          {question.unit && (
            <span>{question.unit}</span>
          )}
        </div>
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="question-field">
        <label>
          {question.label}
          {question.required && <span> *</span>}
        </label>

        <div className="options">
          {question.options.map((option) => (
            <label
              className={`option ${
                value === option.value
                  ? "selected"
                  : ""
              }`}
              key={option.value}
            >
              <input
                type="radio"
                name={question.key}
                value={option.value}
                checked={value === option.value}
                onChange={(event) =>
                  onChange(event.target.value)
                }
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default QuestionField;