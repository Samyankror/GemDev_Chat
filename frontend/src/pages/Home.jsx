import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils/fetchWithAuth.js";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithAuth("/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName, description }),
      });

      if (data.success) {
        setIsModalOpen(false);
        setError("");
        setProjectName("");
        setDescription("");
        setProjects((prev) => [...prev, data.newProject]);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const openProfile = () => {
    navigate("/profile", { state: { projects } });
  };

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const data = await fetchWithAuth("/api/project/all");
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {}
    };
    getAllProjects();
  }, []);

  return (
    <main className="px-16 py-2">
      <header className="flex  justify-between border-b-3 border-b-indigo-200  pb-2">
        <h1 className="text-4xl font font-semibold">My Dashboard</h1>
        <div className="flex  gap-6">
          <button
            className="p-2 bg-slate-200 text-2xl  rounded-md font-semibold cursor-pointer hover:bg-slate-300"
            onClick={() => setIsModalOpen(true)}
          >
            New Project
            <i className="ri-link"></i>
          </button>
          <button
            onClick={() => openProfile()}
            className=" px-4 py-2 bg-slate-200 text-2xl rounded-md font-semibold cursor-pointer hover:bg-slate-300"
          >
            Profile
          </button>
        </div>
      </header>

      {projects && (
        <div className="pt-6">
          <h2 className="text-3xl font-semibold ">My Projects</h2>
          <div className="py-4 flex gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="w-80 p-4 text-xl border-slate-300 border-2 rounded-md font-semibold cursor-pointer hover:bg-slate-200"
                onClick={() => navigate("project", { state: { project } })}
              >
                <h2>{project.name} </h2>
                <p className="break-words">{project.description}</p>
                <div className="pt-1">
                  <p>
                    {" "}
                    <small>
                      {" "}
                      <i className="ri-user-line"></i> Collaborators
                    </small>{" "}
                    : {project.users.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-slate-100">
          <div className="flex flex-col gap-5 bg-slate-200 p-7 rounded-2xl w-[350px]">
            <h1 className="text-3xl  font-bold">Create new Project</h1>
            <form onSubmit={createProject}>
              <div className="flex flex-col gap-2 mb-5">
                <label
                  htmlFor="projectName"
                  className="text-[20px] font-semibold text-slate-500"
                >
                  Project Name
                </label>
                <input
                  className=" p-3 bg-white  rounded-lg  outline-blue-400 focus:outline-[2px] "
                  type="text"
                  id="projectName"
                  value={projectName}
                  placeholder="Enter project name..."
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <label
                  htmlFor="description"
                  className="text-[20px] font-semibold text-slate-500"
                >
                  Description
                </label>
                <input
                  className=" p-3 bg-white  rounded-lg  outline-blue-400 focus:outline-[2px] "
                  type="text"
                  id="description"
                  value={description}
                  placeholder="Describe your project in 10-15 words"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-6 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setProjectName("");
                  }}
                  className="py-2 px-4 bg-slate-500 rounded-lg text-white cursor-pointer font-semibold text-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-400 rounded-lg cursor-pointer text-white font-semibold text-xl"
                >
                  Create
                </button>
              </div>
            </form>
            {error && <p className="text-red-700 mt-2">{error}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
