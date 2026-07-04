"use client";

import { useState, useCallback } from "react";

interface FieldRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

export function useFormValidation<T extends Record<string, string>>(
  rules: Record<keyof T, FieldRules>
) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback(
    (values: T) => {
      const nextErrors: Partial<Record<keyof T, string>> = {};
      let valid = true;

      for (const key in rules) {
        const value = values[key];
        const rule = rules[key];
        let error: string | undefined;

        if (rule.required && (!value || value.trim() === "")) {
          error = "필수 입력 항목이에요";
        } else if (rule.minLength && value.length < rule.minLength) {
          error = `${rule.minLength}자 이상 입력해주세요`;
        } else if (rule.maxLength && value.length > rule.maxLength) {
          error = `${rule.maxLength}자 이하로 입력해주세요`;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          error = "형식이 올바르지 않아요";
        } else if (rule.custom) {
          error = rule.custom(value);
        }

        if (error) {
          nextErrors[key] = error;
          valid = false;
        }
      }

      setErrors(nextErrors);
      return valid;
    },
    [rules]
  );

  const touch = useCallback((key: keyof T) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const clear = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return { errors, touched, validate, touch, clear };
}
