import React, { useEffect, useState } from "react";
import { getUserPosts } from "../features/post/postService";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineUser } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../features/auth/authSlice";
import Posts from "../components/Posts";
import {
  acceptFollowRequest,
  cancelFollowRequest,
  dismissFollowRequest,
  follow,
  unfollow,
} from "../features/user/userSlice";
import { getFollowers, getFollowings } from "../features/user/userService";

function Profile() {
  const [profile, setProfile] = useState({});
  const [profilePosts, setProfilePosts] = useState([]);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followerUserProfiles, setFollowerUserProfiles] = useState([]);
  const [followingUserProfiles, setFollowingUserProfiles] = useState([]);

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const openFollowingsModal = () => {
    setShowFollowingsModal(true);
  };
  const openFollowersModal = () => {
    setShowFollowersModal(true);
  };

  const closeModals = () => {
    setShowFollowingsModal(false);
    setShowFollowersModal(false);
  };

  useEffect(() => {
    if (user?._id === id) {
      setProfile(user);
    } else {
      setProfile(user?.followings.find((following) => following?._id === id));
    }
  }, [id, dispatch, user]);

  const fetchData = async () => {
    try {
      const response = await getUserPosts(id);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message);
      }
      setProfilePosts(result.data.posts);
      setProfile(result.data.user);
    } catch (error) {
      toast.error(error.message);
      if (error.message === "You are not authorized to access this route") {
        dispatch(logoutUser());
      }
    }
  };

  useEffect(() => {
    closeModals();

    if (
      user?._id === id ||
      posts?.find((post) => (post?.author || post?.author?._id) === id)
    ) {
      const filteredPosts = posts.filter((post) => post?.author?._id === id);
      setProfilePosts(filteredPosts);
    } else {
      fetchData();
    }
  }, [id, user, posts]);

  const handleFollowButton = async (id) => {
    await dispatch(follow(id)).then(() => {
      setProfilePosts([]);
      fetchData();
    });
  };
  const handleUnfollowButton = async (id) => {
    await dispatch(unfollow(id)).then(() => {
      setProfilePosts([]);
      fetchData();
    });
  };
  const handleCancelRequestButton = async (id) => {
    await dispatch(cancelFollowRequest(id)).then((res) => {
      if (res.payload.success) {
        setProfilePosts([]);
        fetchData();
      }
    });
  };
  const handleAcceptRequestButton = async (id) => {
    await dispatch(acceptFollowRequest(id)).then((res) => {
      if (res.payload.success) {
        setProfilePosts([]);
        fetchData();
      }
    });
  };
  const handleDismissRequestButton = async (id) => {
    await dispatch(dismissFollowRequest(id)).then((res) => {
      if (res.payload.success) {
        setProfilePosts([]);
        fetchData();
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFollowers(id);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setFollowerUserProfiles(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };

    fetchData();
  }, [id, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFollowings(id);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        setFollowingUserProfiles(result.data);
      } catch (error) {
        toast.error(error.message);
        if (error.message === "You are not authorized to access this route") {
          dispatch(logoutUser());
        }
      }
    };

    fetchData();
  }, [id, user]);

  return (
    <div>
      <div className="relative max-w-[1200px] mx-auto bg-black-main p-4">
        {profile?.profilePicture ? (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/images/${profile?.profilePicture}`}
            alt={profile?.name}
            className="sm:w-28 sm:h-28 w-28 h-28 object-cover rounded-full mx-auto"
          />
        ) : (
          <AiOutlineUser size={140} className="mx-auto border rounded-full" />
        )}
        <p className="text-2xl text-center my-2">{profile?.name}</p>
        <div className="flex items-center gap-2 justify-center">
          {profile?.private && user?._id !== id ? (
            <>
              <p>{profile?.followersCount} followers</p>
              <p>{profile?.followingsCount} followings</p>
              <p>{profile?.postsCount} posts</p>
            </>
          ) : (
            <>
              <p className="cursor-pointer" onClick={openFollowersModal}>
                {profile?.followers?.length} followers
              </p>
              <p className="cursor-pointer" onClick={openFollowingsModal}>
                {profile?.followings?.length} followings
              </p>
              <p>{profilePosts?.length} posts</p>
            </>
          )}
        </div>
        {user?._id === id ? null : (
          <div className="text-center">
            {user?.sentRequests?.includes(id) ? (
              <button
                onClick={() => handleCancelRequestButton(id)}
                className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
              >
                Cancel Request
              </button>
            ) : user?.followerRequests?.includes(id) ? (
              <div className="w-fit mx-auto space-x-2">
                <button
                  onClick={() => handleAcceptRequestButton(id)}
                  className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
                >
                  Accept
                </button>
                {
                  <button
                    onClick={() => handleDismissRequestButton(id)}
                    className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
                  >
                    Dismiss
                  </button>
                }
              </div>
            ) : user?.followings?.find((u) => u._id === id) ? (
              <button
                onClick={() => handleUnfollowButton(id)}
                className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
              >
                Unfollow
              </button>
            ) : user?.followers?.includes(id) ? (
              <button
                onClick={() => handleFollowButton(id)}
                className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
              >
                Follow Back
              </button>
            ) : (
              <button
                onClick={() => handleFollowButton(id)}
                className="border px-8 bg-white-main text-black font-semibold text-lg rounded-md my-3 mx-auto w-fit ml-auto"
              >
                Follow
              </button>
            )}
          </div>
        )}

        <h3 className="text-xl mt-5 mb-2">Posts</h3>
        <Posts posts={profilePosts} />

        {showFollowersModal && followerUserProfiles.length > 0 && (
          <div className="absolute z-50 top-0 bottom-0 left-0 right-0 w-96 h-96 overflow-auto scrollbar-hide mx-auto bg-black-navbar m-4 p-2 rounded-md flex flex-col space-y-4">
            <GiCancel
              onClick={closeModals}
              size={30}
              className="absolute right-2 top-2 cursor-pointer"
            />
            {followerUserProfiles.map((follower) => (
              <div
                key={follower._id}
                className="flex items-center justify-between pt-3"
              >
                <div className="flex items-center space-x-2">
                  {follower?.profilePicture ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/images/${follower?.profilePicture}`}
                      alt={follower?.name}
                      className="sm:w-12 sm:h-12 w-9 h-9 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <AiOutlineUser
                      size={50}
                      className="mx-auto border rounded-full"
                    />
                  )}
                  <Link to={`/profile?id=${follower?._id}`}>
                    <p>{follower?.name}</p>
                  </Link>
                </div>
                <div>
                  {user?._id === follower._id ? null : (
                    <div className="text-center">
                      {user?.sentRequests?.includes(follower._id) ? (
                        <button
                          onClick={() =>
                            handleCancelRequestButton(follower._id)
                          }
                          className="border bg-white-main text-black font-semibold rounded-md w-fit ml-auto"
                        >
                          Cancel Request
                        </button>
                      ) : user?.followerRequests?.includes(follower._id) ? (
                        <div className="w-fit mx-auto space-x-2">
                          <button
                            onClick={() =>
                              handleAcceptRequestButton(follower._id)
                            }
                            className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                          >
                            Accept
                          </button>
                          {
                            <button
                              onClick={() =>
                                handleDismissRequestButton(follower._id)
                              }
                              className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                            >
                              Dismiss
                            </button>
                          }
                        </div>
                      ) : user?.followings?.find(
                          (u) => u._id === follower._id
                        ) ? (
                        <button
                          onClick={() => handleUnfollowButton(follower._id)}
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Unfollow
                        </button>
                      ) : user?.followers?.includes(follower._id) ? (
                        <button
                          onClick={() => handleFollowButton(follower._id)}
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Follow Back
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollowButton(follower._id)}
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
          </div>
        )}

        {showFollowingsModal && followingUserProfiles.length > 0 && (
          <div className="absolute z-50 top-0 bottom-0 left-0 right-0 w-96 h-96 overflow-auto scrollbar-hide mx-auto bg-black-navbar m-4 p-2 rounded-md flex flex-col space-y-4">
            <GiCancel
              onClick={closeModals}
              size={30}
              className="absolute right-2 top-2 cursor-pointer"
            />
            {followingUserProfiles.map((following) => (
              <div
                key={following._id}
                className="flex items-center justify-between pt-3"
              >
                <div className="flex items-center space-x-2">
                  {following?.profilePicture ? (
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}/images/${following?.profilePicture}`}
                      alt={following?.name}
                      className="sm:w-12 sm:h-12 w-9 h-9 object-cover rounded-full mx-auto"
                    />
                  ) : (
                    <AiOutlineUser
                      size={50}
                      className="mx-auto border rounded-full"
                    />
                  )}
                  <Link to={`/profile?id=${following?._id}`}>
                    <p>{following?.name}</p>
                  </Link>
                </div>
                <div>
                  {user?._id === following._id ? null : (
                    <div className="text-center">
                      {user?.sentRequests?.includes(following._id) ? (
                        <button
                          onClick={() =>
                            handleCancelRequestButton(following._id)
                          }
                          className="border bg-white-main text-black font-semibold rounded-md w-fit ml-auto"
                        >
                          Cancel Request
                        </button>
                      ) : user?.followingRequests?.includes(following._id) ? (
                        <div className="w-fit mx-auto space-x-2">
                          <button
                            onClick={() =>
                              handleAcceptRequestButton(following._id)
                            }
                            className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                          >
                            Accept
                          </button>
                          {
                            <button
                              onClick={() =>
                                handleDismissRequestButton(following._id)
                              }
                              className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                            >
                              Dismiss
                            </button>
                          }
                        </div>
                      ) : user?.followings?.find(
                          (u) => u._id === following._id
                        ) ? (
                        <button
                          onClick={() => handleUnfollowButton(following._id)}
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Unfollow
                        </button>
                      ) : user?.followings?.includes(following._id) ? (
                        <button
                          onClick={() => handleFollowButton(following._id)}
                          className="border px-8 bg-white-main text-black font-semibold rounded-md my-3 mx-auto w-fit ml-auto"
                        >
                          Follow Back
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollowButton(following._id)}
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
