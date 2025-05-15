
// components/Select/index.jsx
const Select = ({ options, err, ...rest }) => {

  // rest include name, value, onChange ...
    return (
      <select {...rest} className={`form__input`} 
      style={!!err ? { border: 'solid 1px red' } : {}} >
        {options?.map((option, index) => (
          <option key={option?.value || index} value={option?.value}>
            {option?.label || ""}
          </option>
        ))}
      </select>
    );
  };
  export default Select;