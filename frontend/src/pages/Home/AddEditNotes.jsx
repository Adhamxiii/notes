/* eslint-disable react/prop-types */
import { useState } from "react";
import TagInput from "../../components/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  onClose,
  noteData,
  type,
  getAllNotes,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);

  const editNote = async () => {
    try {
      const res = await axiosInstance.put(`/edit-note/${noteData._id}`, {
        title,
        content,
        tags,
      });
      if (res.data && res.data.note) {
        getAllNotes();
        showToastMessage("Note updated successfully","success");
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
      setError("An error occurred. Please try again later.");
    }
  };

  const addNewNote = async () => {
    try {
      const res = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (res.data && res.data.note) {
        getAllNotes();
        showToastMessage("Note added successfully","success");
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const addNoteHandler = () => {
    if (!title) {
      setError("Title is required");
      return;
    }

    if (!content) {
      setError("Content is required");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label htmlFor="" className="input-label">
          TITLE
        </label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <label htmlFor="" className="input-label">
          CONTENT
        </label>
        <textarea
          className="rounded bg-slate-50 p-2 text-sm text-slate-950 outline-none"
          placeholder="Content"
          rows={10}
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </div>

      <div className="mt-3">
        <label htmlFor="" className="input-label">
          TAGS
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="pt-4 text-xs text-red-500">{error}</p>}

      <button
        type="button"
        className="btn-primary mt-5 p-3 font-medium"
        onClick={addNoteHandler}
      >
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNotes;
