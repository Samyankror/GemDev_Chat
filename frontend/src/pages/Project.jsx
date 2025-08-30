import { useLocation } from "react-router-dom";
import { useState } from "react";

function Project(){
   const location = useLocation();
   const [project, setProject] = useState(location.state?.project);
   console.log(project);

   return (
    <div>project</div>
   )
}

export default Project;