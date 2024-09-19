interface InputProps {
  type: string;
  id: string;
  onChange: (e: any) => void;
  value: string;
  max?: string;
  options?: Array<{value: string; label: string}>;
  pattern?: string;
  placeholder?: string;
}

export default function Input({
  type,
  id,
  onChange,
  value,
  max,
  options,
  pattern,
  placeholder,
}: InputProps) {
  if (type === "select") {
    return (
      <select
        id={id}
        className="block w-full p-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 md:text-base"
        onChange={onChange}
        value={value}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      type={type}
      id={id}
      required
      className="block w-full p-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 md:text-base"
      onChange={onChange}
      value={value}
      {...(type === "date" ? {max} : {})}
      {...(type === "tel" ? {pattern, placeholder} : {})}
    />
  );
}
