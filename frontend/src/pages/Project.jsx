import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import {
  initializeSocket,
  recieveMessage,
  sendMessage,
} from "../config/socket.js";
import Markdown from "markdown-to-jsx";
import { useSelector } from "react-redux";
import { fetchWithAuth } from "../utils/fetchWithAuth.js";
import Editor from "@monaco-editor/react";

function Project() {
  const location = useLocation();
  const navigate = useNavigate();
  const messageBoxRef = useRef();
  const [project, setProject] = useState(location.state?.project);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [fileTree, setFileTree] = useState({});
  const { currUser } = useSelector((state) => state.user);
  const [openFiles, setOpenFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [createFile, setCreateFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [query, setQuery] = useState("");

  const handleUserClick = (id) => {
    setSelectedUserId((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  const addCollaborators = async () => {
    try {
      const data = await fetchWithAuth("/api/project/add-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: location.state.project._id,
          users: Array.from(selectedUserId),
        }),
      });
      if (data.success) {
        setIsModalOpen(false);
        setProject(data.project);
        setUsers(filterAvailableUsers(users));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const removeCollaboratos = async () => {
    try {
      const data = await fetchWithAuth("/api/project/remove-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project._id,
          userId: currUser._id,
        }),
      });
      if (data.success) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filterAvailableUsers = (allUsers) => {
    const projectUserIds = new Set(project.users.map((u) => u._id));
    return allUsers.filter((u) => !projectUserIds.has(u._id));
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      getAllUsers();
      return;
    }
    try {
      const data = await fetchWithAuth(
        `/api/user/search?username=${query.trim()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        setUsers(filterAvailableUsers(data.users));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const send = () => {
    sendMessage("project-message", {
      message,
      sender_id: currUser._id,
    });
    setMessages((prevMessages) => [
      ...prevMessages,
      { username: currUser.username, email: currUser.email, message },
    ]);
    setMessage("");
  };
  function writeAiMessage(message) {
    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2 ">
        <Markdown children={message} />
      </div>
    );
  }

  const saveFileTree = async (ft) => {
    try {
      const data = await fetchWithAuth("/api/project/update-file-tree", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project._id, fileTree: ft }),
      });
      if (data.success) {
        console.log(project);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFile = (fileName) => {
    setFileTree((prev) => {
      const newTree = { ...prev };
      delete newTree[fileName];
      saveFileTree(newTree);
      return newTree;
    });
  };

  const removeFromOpenFiles = (file) => {
    console.log(openFiles);
    setOpenFiles((prev) => prev.filter((f) => f !== file));
  };

  const getAllUsers = async () => {
    try {
      const data = await fetchWithAuth("/api/user/all");
      if (data.success) {
        setUsers(filterAvailableUsers(data.allUsers));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const projectData = await fetchWithAuth(
          `/api/project/get-project/${project._id}`
        );
        if (projectData.success) {
          setProject(projectData.project);
          setFileTree(projectData.project?.fileTree);
        }

        await initializeSocket(project._id);

        recieveMessage("project-message", (data) => {
          if (data.email === "ai") {
            const inMessage = JSON.parse(data.message);
            if (inMessage?.fileTree)
              setFileTree((prev) => ({ ...prev, ...inMessage.fileTree }));
            setMessages((prev) => [
              ...prev,
              { message: inMessage.text, username: "ai", email: "ai" },
            ]);
          } else {
            setMessages((prev) => [...prev, data]);
          }
        });

        getAllUsers();
      } catch (error) {
        console.error("Init error:", error);
      }
    };

    init();
  }, []);

  console.log(users);

  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className={`w-screen h-screen flex`}>
      <section className="left relative flex flex-col min-w-96 h-screen bg-slate-300">
        <header className="flex justify-between items-center p-3  bg-rose-200 flex-0.5 ">
          <button
            className="flex font-semibold cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill mr-1"></i>
            <p>Add Collaborator</p>
          </button>
          <button
            className="text-xl cursor-pointer"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div
          ref={messageBoxRef}
          className="message-box flex mt-1 flex-col px-1 pt-1 pb-3 gap-2 overflow-auto  flex-10 "
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1 p-2 max-w-80 bg-slate-50 rounded-md  ${
                currUser.email === msg.email ? "ml-auto" : "mr-auto"
              }`}
            >
              <small className="text-sm opacity-70">{msg.username}</small>

              {msg.email === "ai" ? (
                writeAiMessage(msg.message)
              ) : (
                <p className="text-sm font-semibold">{msg.message}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex    flex-0.5">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message"
            className="p-3 px-4 bg-white outline-none  flex-grow"
          />
          <button
            onClick={() => send()}
            className="px-4 bg-slate-950 text-white cursor-pointer"
          >
            <i className="ri-send-plane-fill text-2xl"></i>
          </button>
        </div>

        <div
          className={`w-full h-full absolute bg-slate-100 transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-between py-2 px-3 bg-slate-200">
            <h1 className="font-semibold text-lg">Collaborators</h1>
            <button
              className="p-1 cursor-pointer"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-close-fill text-xl font-bold"></i>
            </button>
          </header>

          <div className="flex flex-col p-2 gap-4">
            {project.users &&
              project.users.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-2 cursor-pointer relative hover:bg-slate-200 items-center"
                >
                  <div className="bg-slate-700  relative aspect-square w-fit h-fit rounded-full p-4 flex justify-center items-center">
                    <i className="ri-user-fill text-white absolute"></i>
                  </div>
                  <h1 className="font-semibold  bgtext-lg">{user.username}</h1>
                </div>
              ))}
          </div>

          <div className="flex justify-between py-2 px-3 w-full bg-slate-200 absolute bottom-0">
            <p className="font-semibold   text-lg">Leave Group</p>
            <button
              className="bg-red-500 px-1 text-white font-semibold rounded-md  cursor-pointer"
              onClick={() => removeCollaboratos()}
            >
              <i className="ri-user-minus-line font-semibold text-xl"></i>
            </button>
          </div>
        </div>
      </section>

      <section className="right   flex-grow h-full flex">
        <div className="explorer h-full max-w-64 min-w-52  bg-slate-200">
          <div className="file-tree">
            {fileTree &&
              Object.keys(fileTree).map((file, index) => (
                <div
                  key={index}
                  className="tree-element  p-2 bg-slate-300 flex justify-between"
                >
                  <p
                    onClick={() => {
                      setCurrentFile(file);
                      setOpenFiles([...new Set([...openFiles, file])]);
                    }}
                    className=" cursor-pointer font-semibold text-lg"
                  >
                    {file}
                  </p>

                  <button
                    onClick={() => deleteFile(file)}
                    className="cursor-pointer"
                  >
                    <i className="ri-delete-bin-5-line"></i>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {openFiles && (
          <div className="code-editor flex flex-col flex-grow">
            <div className="flex justify-between">
              <div className="flex flex-8">
                {openFiles.map((file, index) => (
                  <div
                    key={file}
                    className={`flex justify-between ${
                      file == currentFile ? "bg-slate-400" : "bg-slate-200"
                    }`}
                  >
                    <button
                      onClick={() => setCurrentFile(file)}
                      className={`text-lg  p-2 px-4 padding font-semibold cursor-pointer `}
                    >
                      {file}
                    </button>
                    <button onClick={() => removeFromOpenFiles(file)}>
                      <i className="ri-close-line text-md font-semibold cursor-pointer"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-2 gap-2">
                {createFile && (
                  <div className="flex bg-slate-200">
                    <input
                      type="text"
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder=" Enter file Name"
                      className="px-2 focus:outline-none   rounded-md"
                    />
                    <button
                      onClick={() => {
                        setCreateFile(false);
                        const newft = {
                          ...fileTree,
                          [fileName]: {
                            file: {
                              contents: "",
                            },
                          },
                        };
                        setFileTree(newft);
                        saveFileTree(newft);
                        setFileName("");
                      }}
                      className="text-[30px] rounded-md cursor-pointer"
                    >
                      <i class="ri-file-add-line"></i>
                    </button>
                    <button
                      onClick={() => {
                        setCreateFile(false);
                        setFileName("");
                      }}
                      className="text-[30px] rounded-md cursor-pointer"
                    >
                      <i class="ri-file-reduce-line"></i>
                    </button>
                  </div>
                )}
                {!createFile && (
                  <button
                    onClick={() => setCreateFile(true)}
                    className="bg-slate-700 text-white p-2 font-semibold rounded-md cursor-pointer"
                  >
                    Create New File
                  </button>
                )}
                <button
                  onClick={() => saveFileTree(fileTree)}
                  className="bg-green-500 text-white p-2 font-semibold rounded-md cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="bottom flex flex-grow bg-white">
              {fileTree && fileTree[currentFile] && (
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={fileTree[currentFile].file.contents}
                  onChange={(updatedContent) => {
                    const ft = {
                      ...fileTree,
                      [currentFile]: {
                        file: { contents: updatedContent },
                      },
                    };
                    setFileTree(ft);
                    // saveFileTree(ft);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 z-50">
          <div className="flex flex-col gap-4  p-7 rounded-2xl w-[350px] bg-white ">
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg ">Select User</h2>
              <button
                className="p-1 cursor-pointer"
                onClick={() => {
                  getAllUsers();
                  setQuery("");
                  setIsModalOpen(!isModalOpen);
                }}
              >
                <i className="ri-close-fill text-xl font-bold"></i>
              </button>
            </div>
            <div className="flex border-2 p-2 border-slate-400 rounded-md">
              <input
                type="text"
                className="w-full outline-none"
                placeholder="Search here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="cursor-pointer" onClick={() => handleSearch()}>
                <i class="ri-search-line font-semibold text-xl"></i>
              </button>
            </div>
            <ul className="max-h-96 overflow-auto flex flex-col gap-1.5">
              {users.map((user) => (
                <li
                  onClick={() => handleUserClick(user._id)}
                  key={user._id}
                  className={`flex gap-3 p-1 rounded-md cursor-pointer ${
                    selectedUserId.has(user._id) ? "bg-slate-300" : ""
                  }`}
                >
                  <div className="bg-slate-700 relative aspect-square w-fit h-fit rounded-full p-4 flex justify-center items-center">
                    <i className="ri-user-fill text-white absolute"></i>
                  </div>
                  <p className="font-semibold text-lg">{user.username}</p>
                </li>
              ))}
            </ul>
            <button
              className="font-semibold text-lg cursor-poiter bg-blue-400 p-1 text-white cursor-pointer rounded-md mx-auto py-2 px-3"
              onClick={() => addCollaborators()}
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Project;
