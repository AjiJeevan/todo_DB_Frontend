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

  const getTask = ()=>{
    axios.get(api_domain)
    .then(res =>{
      setTasks(res.data)
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

  // Adding new Task
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
  const deleteHandler = async(index)=>{
    console.log(index)
    axios.delete(`${api_domain}/task/${index}`)
    .then(res =>{
      console.log("deleted")
      getTask()
      console.log(tasks)
    })
    .catch(err =>{
      alert(err.response.data.message)
    })
    // getTask()
  }

  // Edit and Save Button Function
  const editTask = (event,id,task)=>{
    const button = event.target
    const li = event.target.parentNode

    //Edit Button Press
    if( button.textContent == "Edit" ){
      const span = li.firstElementChild
      let item = span.textContent
      
      const input = document.createElement("input")
      input.type = "text"
      // input.style.width = "400px"
      input.value = span.textContent
      li.insertBefore(input,span)
      li.removeChild(span)
      button.textContent = "Save"
    }
    // Save Button Press
    else if( button.textContent == "Save" ){
      const span = document.createElement("span")
      const input = li.firstElementChild
      span.textContent = input.value
      // span.style.width = "400px"
      li.insertBefore(span,input)
      li.removeChild(input)

      axios.patch(api_domain, {id: id, task : span.textContent })
      .then((res)=>{
        getTask()
      })
      .catch((err) =>{
        console.log("error....")
      })
      button.textContent = "Edit"
      location.reload()
    }
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
        
        {/* <form onSubmit={formSubmitHandler}>
          <input type='text' placeholder='Enter task' value={taskInput} onChange={changeHandler}/> <br/><br/>
          <input type='submit' value='Add Task'/>
        </form> */}
        {/* <ul>
          {tasks.map((task,index)=>{
            return(
              <>
                <li key={index}>
                  <span>{task.task}</span>
                  <button onClick={(event)=>{editTask(event,index,task.task)}}>Edit</button>
                  <button onClick={()=>{deleteHandler(index)}}>Delete</button>
              </li> 
              </>
            )
          })}
        </ul> */}

        <ListGroup as="ul">
          {tasks.map((task,index)=>{
            return(
              <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={index}>
                <span className="ms-2 me-auto">{task.task}</span>
                <Button variant="primary" onClick={(event)=>{editTask(event,index,task.task)}} >Edit</Button>
                <Button variant="danger" onClick={()=>{deleteHandler(index)}}>Delete</Button>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Container>
    </>
  )
}

export default App