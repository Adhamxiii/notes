/* eslint-disable react/prop-types */
import { getInitials } from "../utils/helper";

const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-900">
        {getInitials(userInfo?.fullName)}
      </div>

      <div>
        <p className="text-sm font-medium capitalize">{userInfo?.fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
