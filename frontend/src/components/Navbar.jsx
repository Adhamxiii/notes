/* eslint-disable react/prop-types */
import ProfileInfo from "./ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";

const Navbar = ({ userInfo, onSearchNote, clearSearchHandler }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const searchHandler = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-2 drop-shadow">
      <h2 className="py-2 text-xl font-medium text-black">Notes</h2>

      <SearchBar
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        searchHandler={searchHandler}
        onClearSearch={() => {
          setSearchQuery("");
          clearSearchHandler();
        }}
      />

      <ProfileInfo onLogout={onLogout} userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
