import type React from "react"
import { cssm } from "@/lib/css-module-utils"
import styles from "@/styles/design-system/form.module.css"

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  className?: string
  required?: boolean
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
  errorText?: string
  className?: string
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  helperText?: string
  errorText?: string
  className?: string
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
  error?: boolean
  helperText?: string
  errorText?: string
  className?: string
}

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  error?: boolean
  className?: string
}

interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  error?: boolean
  className?: string
}

interface FormSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  error?: boolean
  className?: string
}

interface FormRowProps {
  children: React.ReactNode
  className?: string
}

interface FormColProps {
  children: React.ReactNode
  size?: "auto" | "3" | "4" | "6"
  className?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles["form-group"], className)} {...props}>
      {children}
    </div>
  )
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, required, className, ...props }) => {
  return (
    <label className={cssm(styles["form-label"], className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export const FormInput: React.FC<FormInputProps> = ({ error, helperText, errorText, className, ...props }) => {
  return (
    <>
      <input className={cssm(styles["form-input"], error && styles["form-input-error"], className)} {...props} />
      {helperText && !error && <div className={styles["form-helper-text"]}>{helperText}</div>}
      {errorText && error && <div className={styles["form-error-text"]}>{errorText}</div>}
    </>
  )
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ error, helperText, errorText, className, ...props }) => {
  return (
    <>
      <textarea
        className={cssm(styles["form-input"], styles["form-textarea"], error && styles["form-input-error"], className)}
        {...props}
      />
      {helperText && !error && <div className={styles["form-helper-text"]}>{helperText}</div>}
      {errorText && error && <div className={styles["form-error-text"]}>{errorText}</div>}
    </>
  )
}

export const FormSelect: React.FC<FormSelectProps> = ({
  options,
  error,
  helperText,
  errorText,
  className,
  ...props
}) => {
  return (
    <>
      <select
        className={cssm(styles["form-input"], styles["form-select"], error && styles["form-input-error"], className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && !error && <div className={styles["form-helper-text"]}>{helperText}</div>}
      {errorText && error && <div className={styles["form-error-text"]}>{errorText}</div>}
    </>
  )
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={styles["form-checkbox-container"]}>
      <input type="checkbox" className={cssm(styles["form-checkbox"], className)} {...props} />
      <label htmlFor={props.id} className={styles["form-checkbox-label"]}>
        {label}
      </label>
    </div>
  )
}

export const FormRadio: React.FC<FormRadioProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={styles["form-radio-container"]}>
      <input type="radio" className={cssm(styles["form-radio"], className)} {...props} />
      <label htmlFor={props.id} className={styles["form-radio-label"]}>
        {label}
      </label>
    </div>
  )
}

export const FormSwitch: React.FC<FormSwitchProps> = ({ label, error, className, ...props }) => {
  return (
    <div className={styles["form-switch-container"]}>
      <label className={styles["form-switch"]}>
        <input type="checkbox" className={cssm(styles["form-switch-input"], className)} {...props} />
        <span className={styles["form-switch-slider"]}></span>
      </label>
      <span className={styles["form-switch-label"]}>{label}</span>
    </div>
  )
}

export const FormRow: React.FC<FormRowProps> = ({ children, className, ...props }) => {
  return (
    <div className={cssm(styles["form-row"], className)} {...props}>
      {children}
    </div>
  )
}

export const FormCol: React.FC<FormColProps> = ({ children, size = "auto", className, ...props }) => {
  const colClasses = cssm(size === "auto" ? styles["form-col"] : styles[`form-col-${size}`], className)

  return (
    <div className={colClasses} {...props}>
      {children}
    </div>
  )
}
