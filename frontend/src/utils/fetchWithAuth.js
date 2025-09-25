import { signOutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
export const fetchWithAuth = async(url,options={})=>{
  
    try{
        let res = await fetch(url,options);
        
        if(res.status === 401){
            const newAccessToken = await fetch("/api/user/getAccess", {
          method: "get",
         });

         if(newAccessToken.ok){
              res = await fetch(url,options);
         }
         else{
          console.log(res);
            store.dispatch(signOutSuccess());
            return null;
         }

        }
       return res.json();
    }catch(error){
      console.log("fetchWithAuth error:", error.message);
    return null;
    }
}