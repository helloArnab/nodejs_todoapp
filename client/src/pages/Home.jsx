import axios from "axios";
import { useContext, useEffect, useState } from "react"
import { Context, server } from "../main";
import { toast } from "react-hot-toast";
import ToDoItems from "../components/ToDoItems";
import { Navigate } from "react-router-dom";

const Home = () => {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [loading,setLoading] = useState(false);
  const [tasks,setTasks] = useState([]);
  const [refresh,setRefresh] = useState(false);

  const {isAuthenticated} = useContext(Context);

  const updateHandler = async (id) => {
    try {
      const {data} = await axios.put(
        `${server}/tasks/${id}`,
        {},
        {
          withCredentials: true,
        }
      )

      toast.success(data.message)
      setRefresh((prev) => !prev)
    } 
    catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const {data} = await axios.delete(
        `${server}/tasks/${id}`,
        {
          withCredentials: true,
        }
      )

      toast.success(data.message)
      setRefresh((prev) => !prev)
    } 
    catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const submitHandler = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {
      const {data} = await axios.post(
        `${server}/tasks/new`,
        {
          title,description
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type" : "application/json"
          }
        }
      )

      setTitle("")
      setDescription("")
      toast.success(data.message);
      setLoading(false);
      setRefresh((prev) => !prev)
    } 
    catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    axios.get(`${server}/tasks/my`,{
      withCredentials: true,
    })
    .then((res) => {
      setTasks(res.data.tasks)
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
  },[refresh])

  if(!isAuthenticated) return (
    <Navigate to={"/login"}/>
  )
  
  return (
    <div className="container">
      <div className='login'>
          <section>
              <form onSubmit={submitHandler}>
                <input 
                  type="text" 
                  placeholder='Title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <input 
                  type="text" 
                  placeholder='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <button disabled={loading} type='submit'>Add Task</button>
              </form>
          </section>
      </div>
      <section className="todosContainer">
        {tasks.map((task) => (
          <ToDoItems 
            key={task._id} 
            title={task.title}
            description={task.description}
            isCompleted={task.isCompleted}
            updateHandler = {updateHandler}
            deleteHandler = {deleteHandler}
            id = {task._id}
          />
        ))}
      </section>
    </div>
  )
}

export default Home