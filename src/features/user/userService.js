import { get, post } from "../request";
const BASE_URL = "http://localhost:4000/api/user";

const getUser = () => get(`${BASE_URL}/profile`);
const follow = (id) => post(`${BASE_URL}/follow/${id}`);
const unfollow = (id) => post(`${BASE_URL}/unfollow/${id}`);
const cancelFollowRequest = (id) => post(`${BASE_URL}/cancel/${id}`);
const acceptFollowRequest = (id) => post(`${BASE_URL}/accept/${id}`);
const dismissFollowRequest = (id) => post(`${BASE_URL}/dismiss/${id}`);
const editProfile = (data) => post(`${BASE_URL}/edit`, data);

export const getSearchUserNames = (search) => get(`${BASE_URL}/get/${search}`);
export const getFollowers = (id) => get(`${BASE_URL}/followers/${id}`);
export const getFollowings = (id) => get(`${BASE_URL}/followings/${id}`);
export const getSentRequests = () => get(`${BASE_URL}/sentRequests`);
export const getFollowerRequests = () => get(`${BASE_URL}/followerRequests`);

const userService = {
  getUser,
  getSearchUserNames,
  follow,
  unfollow,
  cancelFollowRequest,
  acceptFollowRequest,
  dismissFollowRequest,
  editProfile,
};

export default userService;
