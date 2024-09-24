/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const inputChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const addNewTag = () => {
    if (inputValue.trim !== "") {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === "Enter") {
      addNewTag();
    }
  };

  const deleteTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-2 rounded bg-slate-100 px-3 py-1 text-sm text-slate-900"
            >
              # {tag}
              <button onClick={() => deleteTag(tag)}>
                <MdClose className="" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-4">
        <input
          type="text"
          className="rounded border bg-transparent px-3 py-2 text-sm outline-none"
          placeholder="Add tags"
          value={inputValue}
          onChange={inputChangeHandler}
          onKeyDown={keyDownHandler}
          
        />

        <button
          className="flex size-8 items-center justify-center rounded border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white"
          onClick={() => addNewTag()}
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;
