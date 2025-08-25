import { useContext } from 'react';
import { UserContext } from '../context/User.Context.jsx';


function Home(){
    const {user} = useContext(UserContext);
    console.log(user);
    return (
       <div>
      <p>ID: {user._id}</p>
      <p>Email: {user.email}</p>
    </div>
    )
}

export default Home;