import { SORT_OPTIONS } from "../../lib/students.js";

export default function SortSelect({ label, value, onChange }) {
  return (
    <label>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {SORT_OPTIONS.map(([id, text]) => (
          <option key={id} value={id}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}
