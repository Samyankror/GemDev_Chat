import { useSelector} from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'

function UserAuth({}){
  const {currUser} = useSelector(state => state.user)
    return(
     
        currUser ? <Outlet /> : <Navigate to='/login' />
    
    )
}

export default UserAuth;