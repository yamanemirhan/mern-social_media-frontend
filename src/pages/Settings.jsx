import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { editProfile } from "../features/user/userSlice";

function Settings() {
  const [formData, setFormData] = useState({
    name: "",
    isPrivate: false,
  });
  const [image, setImage] = useState("");

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const { name, isPrivate } = formData;

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      isPrivate: user?.private || false,
    });
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (image) {
      formData.append("profile_image", image);
    }
    const info = {
      name,
      private: isPrivate,
    };

    formData.append("info", JSON.stringify(info));

    dispatch(editProfile(formData));
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div>
      <div className="max-w-[800px] mx-auto bg-black-main p-4">
        <div className="relative flex items-center w-fit mx-auto space-x-4">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt={user?.name}
              className="sm:w-36 sm:h-36 w-28 h-28 object-cover rounded-full"
            />
          ) : user?.profilePicture ? (
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/images/${user?.profilePicture}`}
              alt={user?.name}
              className="sm:w-36 sm:h-36 w-28 h-28 object-cover rounded-full"
            />
          ) : (
            <AiOutlineUser size={140} className="mx-auto border rounded-full" />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="absolute sm:w-28 sm:h-28 w-28 h-28 rounded-full opacity-0"
          />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-2 rounded-md bg-black-navbar"
          />
        </div>
        <div className="flex items-center space-x-2 mt-12">
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={() => setFormData({ ...formData, isPrivate: !isPrivate })}
          />
          <p>Private Account?</p>
        </div>
        <div className="flex flex-col space-y-4 mt-8">
          <button className="bg-black-navbar w-fit py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500">
            Change Password
          </button>
          <button className="bg-black-navbar w-fit py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500">
            Delete Account
          </button>
        </div>
        <button
          onClick={handleSave}
          className="bg-black-navbar w-fit mx-auto flex justify-center py-2 px-6 mt-8 rounded-md text-xl hover:scale-105 duration-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Settings;
