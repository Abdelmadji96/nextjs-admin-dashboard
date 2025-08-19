"use client";

import React from "react";

interface InputGroupProps {
  label: string;
  type: string;
  placeholder: string;
  className?: string;
  customClasses?: string;
  value: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function InputGroup({
  label,
  type,
  placeholder,
  className = "",
  customClasses = "",
  value,
  name,
  onChange,
  handleChange,
  icon,
  children,
}: InputGroupProps) {
  const handleInputChange = handleChange || onChange;

  return (
    <div className={`${className} ${customClasses}`}>
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
        />
        {icon && (
          <span className="absolute right-4.5 top-4">
            {icon}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
