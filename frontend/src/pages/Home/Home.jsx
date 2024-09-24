import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import NoteCard from "../../components/NoteCard";
import axiosInstance from "../../utils/axiosInstance";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/Toast";
import EmptyCard from "../../components/EmptyCard";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShow: false,
    type: "add",
    message: "Noted Successfully",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const editHandler = (noteDetails) => {
    setOpenAddEditModal({
      isShow: true,
      type: "edit",
      data: noteDetails,
    });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShow: true,
      message: message,
      type: type,
    });
  };

  const closeToastHandler = () => {
    setShowToastMsg({
      isShow: false,
      message: "",
    });
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteHandler = async (data) => {
    try {
      const response = await axiosInstance.delete(`/delete-note/${data._id}`);
      if (response.data && !response.data.error) {
        showToastMessage("Deleted successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const pinNote = async (data) => {
    try {
      const response = await axiosInstance.put(`/update-isPinned/${data._id}`,{
        isPinned: !data.isPinned,
      });
      if (response.data && response.data.note) {
        showToastMessage("Pinned successfully", "success");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axiosInstance.get("/search", {
        params: {
          searchTerm: query,
        },
      });

      if (res.data && res.data.notes) {
        setIsSearch(true);
        setAllNotes(res.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const clearSearchHandler = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        if (error.response.statue === 401) {
          localStorage.clear();
          navigate("/login");
        }
      }
    };

    getUserInfo();
    getAllNotes();
    return () => {};
  }, [navigate]);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        clearSearchHandler={clearSearchHandler}
      />

      <div className="container mx-auto">
        {allNotes.length > 0 ? (
          <div className="mt-8 grid grid-cols-3 gap-4">
            {allNotes.map((item) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => editHandler(item)}
                onDelete={() => deleteHandler(item)}
                onPinNote={() => pinNote(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard
            message={
              isSearch
                ? "No results found for your search."

                : "You don't have any notes yet. Let's create your first note!"
            }
          />
        )}
      </div>

      <button
        className="absolute bottom-10 right-10 flex size-16 items-center justify-center rounded-2xl bg-primary hover:bg-blue-600"
        onClick={() =>
          setOpenAddEditModal({
            isShow: true,
            type: "add",
            data: null,
          })
        }
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="mx-auto mt-14 max-h-[75%] w-[40%] overflow-auto rounded-md bg-white p-5"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({ ...openAddEditModal, isShow: false })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShow={showToastMsg.isShow}
        type={showToastMsg.type}
        message={showToastMsg.message}
        onClose={closeToastHandler}
      />
    </>
  );

};
export default Home;
