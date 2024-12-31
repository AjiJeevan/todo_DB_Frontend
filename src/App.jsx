import { useEffect, useState } from 'react'
import axios, { Axios } from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import './App.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';

const api_domain = "http://localhost:3000"

function App() {

  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")
  const [editId, setEditId] = useState(false)
  const [editedTask, setEditedTask] = useState("")

  const getTask = ()=>{
    axios.get(api_domain)
    .then(res =>{
      setTasks(res.data.todoList)
      console.log(res.data)
      console.log("getTask")
    })
    .catch(err => {
      console.log("Error")
    })
  }

  useEffect(()=>{
    getTask()
  },[])

  const changeHandler = (event)=>{
    setTaskInput(event.target.value)
  }

  // Adding a new Task
  const formSubmitHandler = (event)=>{
     event.preventDefault()
     if(taskInput){
        axios.post(api_domain,{task : taskInput})
        .then(res =>{
          setTaskInput("")
          getTask()
        })
        .catch(()=>{
          console.log("Error...")
        })
     }
     else{
        alert("Please fill the task field...")
     }
    
    console.log(taskInput)
  }

  // Delete Button Function
  const deleteHandler = async(id)=>{
    console.log(id)
    axios.delete(`${api_domain}/task/${id}`)
    .then(res =>{
      console.log("deleted")
      getTask()
      console.log(tasks)
    })
    .catch(err =>{
      alert(err.response.data.message)
    })
  }

  // Save Edited Task
  const saveNewTask = () =>{
    axios.patch(api_domain, {id: editId, task : editedTask })
    .then((res)=>{
      getTask()
      setEditId(false)
    })
    .catch((err) =>{
      console.log("error....")
    })
  }



  return ( 
    <>
        <Container className='todo-container bg-secondary text-white'>
        <h1 className='title-todo'>To-Do List</h1>
        <Form>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter new task here"
              aria-label="newTask"
              aria-describedby="basic-addon2"
              value={taskInput}
              onChange={changeHandler}
            />
            <Button variant="outline-light" id="button-add" onClick={formSubmitHandler}>
              Add Task
            </Button>
        </InputGroup>
        </Form>

        <ListGroup as="ul">
          {tasks.map((task,index)=>{
            return(
              <>
              <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={index}>
                {editId == task._id ?
                <>
                  <Form.Control type="text" defaultValue={editedTask} onChange={(e)=>setEditedTask(e.target.value)} />
                  <Button variant="primary" onClick={()=>saveNewTask(task._id)}>Save</Button> 
                </>:
                <>
                  <span className="ms-2 me-auto">{task.task}</span>
                  <Button variant="primary" onClick={(event)=>{
                    setEditId(task._id)
                    setEditedTask(task.task)
                  }} >Edit</Button>
                  <Button variant="danger" onClick={()=>{deleteHandler(task._id)}}>Delete</Button>
                </>
                }
              </ListGroup.Item>
              </>
            )
          })}
        </ListGroup>
      </Container>
    </>
  )
}

export default App