

// components/TextArea/index.jsx
const TextArea = ({ error, ...rest }) => {
    return (
      <textarea className={`form__input ${error ? "formerror" : ""}`} {...rest} />
    );
  };
  export default TextArea;