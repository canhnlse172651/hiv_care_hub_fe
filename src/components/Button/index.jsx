import { Link } from "react-router-dom";
function Button({ variant = "primary", className, disable, children, link, ...rest }) {
  let variantClass = "";

  switch (variant) {
    case "primary":
      variantClass = "btn btn--primary";
      break;
    case "border":
      variantClass = "btn btn--border --black";
      break;

    case "grey":
      variantClass = "btn btn--grey";
    default:
      break;
  }

  if (!!link) {
    return (
      <Link to={link} className={`${variantClass} ${className || ""}`} {...rest}>
        {children}{" "}
      </Link>
    );
  }

  if(disable){
    variantClass = "btn btn--grey";
    rest.onClick = () => {}
  }

  return (
    <button className={`${variantClass} ${className || ""}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;
