interface LabelProps {
  html: string;
  value: string;
}

export default function Label({html, value}: LabelProps) {
  return (
    <label
      htmlFor={html}
      className="block text-sm font-medium text-gray-700 md:text-base"
    >
      {value}
    </label>
  );
}
