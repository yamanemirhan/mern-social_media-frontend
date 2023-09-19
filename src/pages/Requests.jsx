import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { logoutUser } from "../features/auth/authSlice";
import {
  getFollowerRequests,
  getSentRequests,
} from "../features/user/userService";
import { toast } from "react-toastify";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  acceptFollowRequest,
  cancelFollowRequest,
  dismissFollowRequest,
  follow,
  unfollow,
} from "../features/user/userSlice";

function Requests() {
  const [sentRequests, setSentRequests] = useState([]);
  const [followerRequests, setFollowerRequests] = useState([]);

  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSentRequests();
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setSentRequests(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };

    fetchData();
  }, [dispatch, user?.sentRequests]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFollowerRequests();
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setFollowerRequests(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };
    fetchData();
  }, [dispatch, user?.followerRequests]);

  const handleFollowButton = async (id) => {
    await dispatch(follow(id));
  };
  const handleUnfollowButton = async (id) => {
    await dispatch(unfollow(id));
  };
  const handleCancelRequestButton = async (id) => {
    await dispatch(cancelFollowRequest(id));
  };
  const handleAcceptRequestButton = async (id) => {
    await dispatch(acceptFollowRequest(id));
  };
  const handleDismissRequestButton = async (id) => {
    await dispatch(dismissFollowRequest(id));
  };

  return (
    <div>
      <div className="max-w-[1200px] mx-auto bg-black-main p-4 flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-12 text-xl">
          <NavLink
            to="/requests?type=sent"
            className={location.search.includes("sent") ? "text-red-500" : ""}
          >
            Sent Requests
          </NavLink>
          <NavLink
            to="/requests?type=follower"
            className={
              location.search.includes("follower") ? "text-red-500" : ""
            }
          >
            Follower Requests
          </NavLink>
        </div>
        <h3 className="text-2xl">
          {location.search.includes("sent")
            ? "Sent Requests"
            : "Follower Requests"}
        </h3>
        <div className="flex flex-col space-y-4">
          {sentRequests?.length > 0 &&
            location.search.includes("sent") &&
            sentRequests.map((sentRequestUser) => (
              <div
                key={sentRequestUser._id}
                className="flex items-center justify-between w-96 py-4 px-2"
              >
                <div className="flex items-center space-x-2">
                  {sentRequestUser?.profilePicture ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/images/${sentRequestUser?.profilePicture}`}
                      alt={sentRequestUser?.name}
                      className="sm:w-12 sm:h-12 w-9 h-9 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <AiOutlineUser
                      size={50}
                      className="mx-auto border rounded-full"
                    />
                  )}
                  <Link to={`/profile?id=${sentRequestUser?._id}`}>
                    <p>{sentRequestUser?.name}</p>
                  </Link>
                </div>
                <div>
                  {user?._id === sentRequestUser._id ? null : (
                    <div className="text-center">
                      {user?.sentRequests?.includes(sentRequestUser._id) ? (
                        <button
                          onClick={() =>
                            handleCancelRequestButton(sentRequestUser._id)
                          }
                          className="border bg-white-main text-black font-semibold rounded-md w-fit ml-auto"
                        >
                          Cancel Request
                        </button>
                      ) : user?.sentRequestUserRequests?.includes(
                          sentRequestUser._id
                        ) ? (
                        <div className="w-fit mx-auto space-x-2">
                          <button
                            onClick={() =>
                              handleAcceptRequestButton(sentRequestUser._id)
                            }
                            className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                          >
                            Accept
                          </button>
                          {
                            <button
                              onClick={() =>
                                handleDismissRequestButton(sentRequestUser._id)
                              }
                              className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                            >
                              Dismiss
                            </button>
                          }
                        </div>
                      ) : user?.followings?.find(
                          (u) => u._id === sentRequestUser._id
                        ) ? (
                        <button
                          onClick={() =>
                            handleUnfollowButton(sentRequestUser._id)
                          }
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Unfollow
                        </button>
                      ) : user?.sentRequestUsers?.includes(
                          sentRequestUser._id
                        ) ? (
                        <button
                          onClick={() =>
                            handleFollowButton(sentRequestUser._id)
                          }
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Follow Back
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleFollowButton(sentRequestUser._id)
                          }
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

          {followerRequests?.length > 0 &&
            location.search.includes("follower") &&
            followerRequests.map((followerRequestUser) => (
              <div
                key={followerRequestUser._id}
                className="flex items-center justify-between w-96 py-4 px-2"
              >
                <div className="flex items-center space-x-2">
                  {followerRequestUser?.profilePicture ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/images/${followerRequestUser?.profilePicture}`}
                      alt={followerRequestUser?.name}
                      className="sm:w-12 sm:h-12 w-9 h-9 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <AiOutlineUser
                      size={50}
                      className="mx-auto border rounded-full"
                    />
                  )}
                  <Link to={`/profile?id=${followerRequestUser?._id}`}>
                    <p>{followerRequestUser?.name}</p>
                  </Link>
                </div>
                <div>
                  {user?._id === followerRequestUser._id ? null : (
                    <div className="text-center">
                      {user?.followerRequests?.includes(
                        followerRequestUser._id
                      ) ? (
                        <div className="ml-auto space-x-2 flex">
                          <button
                            onClick={() =>
                              handleAcceptRequestButton(followerRequestUser._id)
                            }
                            className="border px-3 bg-green-500 text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleDismissRequestButton(
                                followerRequestUser._id
                              )
                            }
                            className="border px-3 bg-red-500 text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Requests;
