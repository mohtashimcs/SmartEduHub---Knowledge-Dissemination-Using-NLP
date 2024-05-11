"use client";
import React from "react";
import MultipleSelector, { Option } from "./MultipleSelector";

const OPTIONS: Option[] = [
  { label: "Artificial Intelligence", value: "ai" },
  { label: "Machine Learning", value: "ML" },
  { label: "Development", value: "development" },
  { label: "Networking", value: "networking" },
];
interface Props {
  onDomainChange: (selectedDomains: string[]) => void;
}
const DomainSelection = ({ onDomainChange }: Props) => {
  const [value, setValue] = React.useState<Option[]>([]);
  const handleDomainSelection = (selectedOptions: Option[]) => {
    setValue(selectedOptions);
    onDomainChange(selectedOptions.map((option) => option.value));
  };
  return (
    <div className="flex flex-col w-full">
      <p className="text-xs">
        (Navigate through arrow key and select by pressing "Enter")
        {value.map((val) => val.label).join(", ")}
      </p>
      <MultipleSelector
        value={value}
        onChange={handleDomainSelection}
        defaultOptions={OPTIONS}
        placeholder="Select your domain..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-900">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default DomainSelection;
