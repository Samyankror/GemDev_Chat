import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { signOutSuccess, updateSuccess } from "../redux/user/userSlice";

function Profile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currUser } = useSelector((state) => state.user);
  const { projects } = location.state || { projects: [] };

  const [collaborators, setCollaborators] = useState(0);
  const [editProfile, setEditProfile] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    id: currUser._id,
    username: currUser.username,
    email: currUser.email,
    password: "",
  });

  const handleLogOut = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: currUser._id }),
      });
      const data = await res.json();
      if (data?.success) {
        dispatch(signOutSuccess(data.user));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = await fetchWithAuth("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log("helo");
      console.log(data);

      if (data?.success) {
        dispatch(updateSuccess(data.user));
        setEditProfile(false);
        setError("");
        setFormData((prev) => ({ ...prev, password: "" }));
      } else {
        setError(data?.message || "Something went wrong");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < projects.length; i++) {
      sum += projects[i].users.length;
    }
    setCollaborators(sum);
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-3xl font-bold text-blue-600 shadow-md">
            U
          </div>

          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {currUser.username}
          </h2>
          <p className="text-gray-500">{currUser.email}</p>

          {!editProfile && (
            <div className="w-full mt-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Total Projects</span>
                <span className="font-medium">{projects.length}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Collaborators</span>
                <span className="font-medium">{collaborators}</span>
              </div>
            </div>
          )}

          {editProfile && (
            <div className="w-full mt-6 space-y-4">
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password"
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditProfile(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}
            </div>
          )}

          {!editProfile && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setEditProfile(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
