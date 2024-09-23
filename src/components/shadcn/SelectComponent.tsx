import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectComponentProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  data: string[];
}

export default function SelectComponent({
  value,
  setValue,
  data,
}: SelectComponentProps) {
  return (
    <div>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="h-8 text-xs transition-colors duration-150 outline-none select-none bg-zinc-50 border-slate-500 lg:text-base lg:h-9 focus:ring-0 dark:bg-dark-card dark:text-dark-text dark:border-light-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem
              value={item}
              key={item}
              className="hover:!bg-slate-200 dark:hover:!bg-dark-primaryHover dark:text-dark-text transition-colors duration-150"
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
