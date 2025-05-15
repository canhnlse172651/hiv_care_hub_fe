import React, { createContext, useContext, useEffect, useState } from "react";

const RadioContext = createContext();

const RadioGroup = ({
  defaultValue,
  disable,
  className,
  onChange,
  children,
}) => {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onCheckChange = (e) => {
    const value = e.target.value;
    setValue(value);
    onChange?.(value);
  };

  return (
    <div className={`radio-group ${className}`}>
      <RadioContext.Provider value={{ value, disable, onCheckChange }}>
        {children}
      </RadioContext.Provider>
    </div>
  );
};

const RadioItem = ({ children, disable = false, value }) => {
  const {
    value: selectedValue,
    onCheckChange,
    disable: groupDisable,
  } = useContext(RadioContext);

  // Ưu tiên `disable` từ RadioGroup nếu có
  const isDisabled = groupDisable || disable;

  return (
    <div>
      <input
        type="radio"
        id={value}
        name="radio-group"
        value={value}
        checked={selectedValue === value}
        disabled={isDisabled}
        onChange={onCheckChange}
        className="custom-control-input"
      />
      <label
        htmlFor={value}
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
      >
        {children}
      </label>
    </div>
  );
};

RadioGroup.Item = RadioItem;

export default RadioGroup;
