import { signOutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
export const fetchWithAuth = async (url, options = {}) => {
  console.log(url, "j");
  try {
    let res = await fetch(url, options);

    if (res.status === 400 || res.status === 401) {
      const newAccessToken = await fetch("/api/user/getAccess", {
        method: "get",
      });
      console.log(newAccessToken.ok);
      if (newAccessToken.ok) {
        console.log(url);
        res = await fetch(url, options);
      } else {
        console.log(res);
        store.dispatch(signOutSuccess());
        return null;
      }
    }
    return res.json();
  } catch (error) {
    console.log("fetchWithAuth error:", error.message);
    return null;
  }
};
