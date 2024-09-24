import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-3 flex items-center rounded border-[1.5px] bg-transparent px-5">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        className="mr-3 w-full rounded bg-transparent py-3 text-sm outline-none"
        onChange={onChange}
        placeholder={placeholder || "password"}
      />

      {isShowPassword ? (
        <FaRegEye
          onClick={() => togglePasswordVisibility()}
          className="text-primary cursor-pointer"
          size={22}
        />
      ) : (
        <FaRegEyeSlash
          onClick={() => togglePasswordVisibility()}
          className="text-primary cursor-pointer"
          size={22}
        />
      )}
    </div>
  );
};

export default PasswordInput;
