import { Label } from "reactstrap";
import Select from "react-select";

const BaseSelect = ({
  label,
  name,
  className,
  options,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  isDisabled,
}: any) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      <Select
        name={name}
        className={className ? className : "select-border"}
        options={options?.length > 0 ? options : []}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={!!(touched && error)}
        isDisabled={isDisabled}
      />
      {touched && error ? (
        <div className="text-danger error-font">{error}</div>
      ) : null}
    </>
  );
};

const MultiSelect = ({
  value,
  isMulti,
  onChange,
  options,
  styles,
  touched,
  error,
  name,
  handleBlur,
  className,
  isDisabled
}: any) => {
  return (
    <>
      <Select
        value={value}
        className={className ? className : "select-border"}
        isMulti={isMulti}
        onChange={onChange}
        options={options}
        styles={styles}
        name={name}
        onBlur={handleBlur}
        isInvalid={!!(touched && error)}
        isDisabled={isDisabled}
      />
      {touched && error ? (
        <div className="text-danger error-font">{error}</div>
      ) : null}
    </>
  );
};

export { BaseSelect, MultiSelect };
