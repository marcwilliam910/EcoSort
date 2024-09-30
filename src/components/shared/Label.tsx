interface LabelProps {
  html: string;
  value: string;
}

export default function Label({html, value}: LabelProps) {
  return (
    <label
      htmlFor={html}
      className="block text-sm font-medium text-light-text dark:text-dark-text md:text-base"
    >
      {value}
    </label>
  );
}
