// src/components/registro/Field.jsx
export default function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  required,
  as = "input",
  options = [],
  className = "",
}) {
  return (
    <label className={`registro__field ${className}`}>
      <span className="registro__label">{label}</span>
      {as === "select" ? (
        <select
          className="registro__input registro__input--select"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map((opt) =>
            typeof opt === "string" ? (
              <option key={opt} value={opt}>{opt}</option>
            ) : (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )
          )}
        </select>
      ) : (
        <input
          className="registro__input"
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
        />
      )}
    </label>
  );
}
