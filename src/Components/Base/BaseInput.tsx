import { useState } from "react";
import { Label, Input, FormFeedback } from "reactstrap";
import BaseButton from "./BaseButton";

const BaseInput = ({
  label,
  name,
  type,
  className,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  maxLength,
  min,
  max,
  passwordToggle,
  disabled
}: any) => {
  const [passwordShow, setPasswordShow] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}
      {type !== "password" ? (
        <Input
          name={name}
          type={type}
          className={className ? className : "form-control"}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          value={value || ""}
          invalid={!!(touched && error)}
          maxLength={maxLength}
          min={0}
        />
      ) : (
        <div className="position-relative auth-pass-inputgroup mb-3">
          <Input
            name={name}
            value={value || ""}
            type={passwordShow ? "text" : "password"}
            className="form-control pe-5"
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            invalid={!!(touched && error)}
            disabled={disabled}
          />
          <BaseButton
            color="link"
            onClick={togglePasswordVisibility}
            className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
            type="button"
            id="password-addon"
          >
            <i
              className={
                passwordShow
                  ? "ri-eye-off-fill align-middle p-3"
                  : "ri-eye-fill align-middle p-3"
              }
            ></i>
          </BaseButton>
          {touched && error ? (
            <FormFeedback type="invalid">{error}</FormFeedback>
          ) : null}
        </div>
      )}
      {touched && error ? (
        <FormFeedback type="invalid">{error}</FormFeedback>
      ) : null}
    </>
  );
};

export default BaseInput;
