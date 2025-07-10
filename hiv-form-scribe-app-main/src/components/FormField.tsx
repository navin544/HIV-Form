
import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, children, tooltip }) => {
  return (
    <div className="mb-3">
      <label className="block mb-2 font-semibold text-gray-700">
        {label}
        {tooltip && (
          <span 
            className="ml-2 text-blue-600 cursor-help border-b border-dotted border-gray-500"
            title={tooltip}
          >
            ?
          </span>
        )}
      </label>
      {children}
    </div>
  );
};

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  onChange?: (value: string) => void;
  value?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  name, 
  options, 
  required = false, 
  onChange,
  value 
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer font-normal">
          <input
            type="radio"
            name={name}
            value={option.value}
            required={required}
            onChange={(e) => onChange?.(e.target.value)}
            checked={value === option.value}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

interface CheckboxGroupProps {
  name: string;
  options: { value: string; label: string }[];
  onChange?: (values: string[]) => void;
  values?: string[];
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ 
  name, 
  options, 
  onChange,
  values = [] 
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    let newValues = [...values];
    if (checked) {
      newValues.push(optionValue);
    } else {
      newValues = newValues.filter(v => v !== optionValue);
    }
    onChange?.(newValues);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer font-normal">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            checked={values.includes(option.value)}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
