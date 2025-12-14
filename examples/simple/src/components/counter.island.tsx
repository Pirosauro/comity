import type { ButtonHTMLAttributes, FunctionComponent } from "react";
import { useState } from "react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <button {...props} onClick={handleClick}>
      Count: {count}
    </button>
  );
};

export default Button;
