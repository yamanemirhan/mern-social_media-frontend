import React, { useEffect, useState } from "react";
import { RiAddCircleLine } from "react-icons/ri";
import { AiOutlineUser, AiOutlineUserAdd, AiFillHeart } from "react-icons/ai";
import { CiSettings } from "react-icons/ci";
import { BiLogOutCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { logout, logoutUser } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSearchUserNames } from "../features/user/userService";

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSearchUserNames(searchQuery);
        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message);
        }
        setUsers(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };
    if (searchQuery) {
      fetchData();
    } else {
      setUsers([]);
    }
  }, [searchQuery, dispatch]);

  const dropdownList = [
    {
      icon: <AiOutlineUser size={30} color="white" />,
      title: "Profile",
      to: `/profile?id=${user?._id}`,
    },
    {
      icon: <AiOutlineUserAdd size={30} color="white" />,
      title: "Requests",
      to: "/requests?type=sent",
    },
    {
      icon: <AiFillHeart size={30} color="white" />,
      title: "Favs",
      to: "/favs",
    },
    {
      icon: <CiSettings size={30} color="white" />,
      title: "Settings",
      to: "/settings",
    },
  ];

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-black-navbar text-white-main p-5 z-40">
      <nav className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="relative flex sm:gap-12 gap-2 items-center">
          <Link to={"/"}>
            <h1 className="sm:text-3xl text-xl cursor-pointer">LOGO</h1>
          </Link>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="bg-white-main placeholder:text-black p-1 rounded-md text-black"
          />
          {users?.length > 0 && (
            <div className="absolute bg-dropdown z-50 top-12 left-32 p-1 rounded-md flex flex-col gap-2">
              {users?.map((u, index) => (
                <Link key={index} to={`/profile?id=${u?._id}`}>
                  <div className="flex items-center gap-1">
                    {u?.profilePicture ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}/images/${u?.profilePicture}`}
                        alt={u?.name}
                        className="sm:w-10 sm:h-10 w-9 h-9 object-cover rounded-full"
                      />
                    ) : (
                      <AiOutlineUser size={30} />
                    )}
                    <p>{u.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className=" flex sm:gap-12 gap-4 items-center">
          <RiAddCircleLine
            onClick={() => navigate("/create")}
            size={40}
            color="white"
            className="cursor-pointer"
          />
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative flex items-center gap-2 cursor-pointer"
          >
            {user?.profilePicture ? (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/images/${user?.profilePicture}`}
                alt={user?.name}
                className="sm:w-10 sm:h-10 w-9 h-9 object-cover rounded-full"
              />
            ) : (
              <AiOutlineUser size={40} />
            )}

            <p className="sm:flex hidden">{user?.name}</p>
            {showDropdown && (
              <div className="absolute z-50 bg-dropdown top-12 sm:-left-6 -left-20 w-32 p-2 rounded-md">
                <li className="list-none">
                  {dropdownList.map((item, index) => (
                    <ul key={index}>
                      <Link
                        to={item.to}
                        className="flex items-center gap-2 mt-2 cursor-pointer"
                      >
                        {item.icon}
                        <h2>{item.title}</h2>
                      </Link>
                    </ul>
                  ))}
                  <ul>
                    <button
                      onClick={() => {
                        dispatch(logout());
                      }}
                      className="flex items-center gap-2 mt-2 cursor-pointer"
                    >
                      <BiLogOutCircle size={30} color="white" />
                      <h2>Logout</h2>
                    </button>
                  </ul>
                </li>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
