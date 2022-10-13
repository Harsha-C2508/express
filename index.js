const express = require("express")
const fs = require("fs")

const app = express()

app.get("/",(req,res)=>{
    const data = fs.readFileSync("./db.json",{encoding:"utf-8"});
    const parseData = JSON.parse(data);
    const todos = parseData.todos
    console.log(todos);
    res.send(JSON.stringify(todos))
   
})
app.use(express.json());
app.post("/",(req,res)=>{
    const add = fs.readFileSync("./db.json",{encoding:"utf-8"});
    let parsedFile = JSON.parse(add)
    parsedFile.todos.push(req.body)
  let parsedFiles = JSON.stringify(parsedFile);
    fs.writeFileSync("./db.json", parsedFiles, {encoding:"utf-8"})
    res.send("New todo is added succefully")
})



app.put("/:id",(req,res)=>{
    const todo_id = req.params.id;
    const todo = req.body;

    const prev_data = fs.readFileSync("./db.json",{encoding:"utf-8"});
    const parse_prev_data = JSON.parse(prev_data);

    const old = parse_prev_data.todos
    const newtodo = old.map((todo)=>{
        if(todo.id === todo_id){
            return todo
        }
        else{
            return todo
        }
    })
    parse_prev_data.todo = newtodo;
    const latest = JSON.stringify(parse_prev_data);

    fs.writeFileSync("./db.json",latest,"utf-8")

    res.send("todo modified")
})


app.delete("/:id",(req,res)=>{
    const id = req.params.id;
    const prev_data = fs.readFileSync("./db.json",{encoding:"utf-8"})
    const parsed_prev_data = JSON.parse(prev_data);
    const old_todo = parsed_prev_data.todos
    const newtodo = old_todo.filter((todo)=>todo.id !== id)
    parsed_prev_data.todos = newtodo;
    const latest = JSON.stringify(parsed_prev_data);

    fs.writeFileSync("./db.json",latest,"utf-8")
    res.send("todo is deleted")
})
app.listen(8000,()=>{
    console.log("The server port is 8000");
})