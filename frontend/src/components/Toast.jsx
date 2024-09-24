/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShow, type, message, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div
      className={`absolute right-6 top-20 transition-all duration-300 ${
        isShow ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`min-w-52 rounded-md border bg-white shadow-2xl after:h-full after:w-[5px] ${type === "delete" ? "after:bg-red-500" : "after:bg-green-500"} after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          <div
            className={`flex size-10 items-center justify-center rounded-full ${type === "delete" ? "bg-red-50" : "bg-green-50"}`}
          >
            {type === "delete" ? (
              <MdDeleteOutline className="text-xl text-red-500" />
            ) : (
              <LuCheck className="text-xl text-green-500" />
            )}
          </div>

          <p className="text-sm text-slate-800">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
