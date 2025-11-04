"use client";

import React from "react";

import { Check } from "lucide-react";

interface CheckboxProps {
  id?: string;
  name?: string;
  label: string;
  checked?: boolean;
  withIcon?: string;
  minimal?: boolean;
  radius?: string;
  onChange: (e: any) => void;
}

export function Checkbox({ id, name, label, checked, onChange }: CheckboxProps) {
  const inputId = id || name || 'checkbox';
  
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={inputId}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={inputId}
        className="flex cursor-pointer select-none items-center text-body-sm font-medium text-dark dark:text-white"
      >
        <div className="relative">
          <div className="box mr-3 flex h-5 w-5 items-center justify-center rounded border-[0.5px] border-stroke bg-gray-2 dark:border-dark-3 dark:bg-dark-2">
            <span className={`opacity-0 ${checked && "!opacity-100"}`}>
              <Check className="h-3 w-3 text-primary" strokeWidth={3} />
            </span>
          </div>
        </div>
        {label}
      </label>
    </div>
  );
}
