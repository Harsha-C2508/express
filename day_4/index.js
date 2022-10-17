const express = require("express");
const fs = require("fs");
const app = express();
const dns = express("dns");
app.use(express.json())
// middlewares arranging over here
// 1. validator

const validator = (req,res,next)=>{
    if(req.method === "POST"){
        const payload = req.body;
        if(payload.id && payload.name && payload.rating && payload.description && payload.genre && payload.cast){
            if((typeof(payload.id)=== "number")&&(typeof(payload.name) === "string")&&(typeof(payload.rating)=== "number")&&(typeof(payload.description) === "string")&&(typeof(payload.genre) === "string")&&(typeof(payload.cast) === "string")){
                next()
            }
            else{
                res.send( "Validation Failed")
            }
        }
        else{
            res.send( "Validation Failed")
        }
    }
    else{
        next();
    }
}

// second middleware logger
const logger = (req,res,next)=>{
    const text = `${req.method},${req.status},${req.url},${req.headers['user-agent']}/n`;
    fs.appendFileSync("./log.txt",text,'utf-8')
    next();
}
 app.use(logger)

// getting the data
 app.use(validator)
app.get("/movies",(req,res)=>{
   const data = fs.readFileSync("./posts.json",{encoding:"utf-8"})
   const parsed = JSON.parse(data) 
   const item = parsed.posts
   console.log(item);
   res.send(JSON.stringify(item));
})

// adding new things to the posts
app.post("/movies/create",(req,res)=>{
    const post = req.body
    const add = fs.readFileSync("./posts.json",{encoding:"utf-8"});
    const parsed = JSON.parse(add);
    const posts = parsed.posts
    posts.push(post);
    const lastStringify = JSON.stringify(parsed);
    fs.writeFileSync("./posts.json",lastStringify,"utf-8");
    res.send("Product is added");
})

 // updating the item sended
app.put("/movies/:moviesId",(req,res)=>{
    const id = req.params.moviesId ;
    const post = req.body;
    const prev = fs.readFileSync("./posts.json",{encoding:"utf-8"});
    const parsed = JSON.parse(prev);
    const old = parsed.posts;
    const newDATA = old.map((p)=>{
        if(p.id === Number(id)){
            return post;
        }
        else{
            return p
        }
    })

    parsed.posts = newDATA;

    const latest = JSON.stringify(parsed)
    fs.writeFileSync("./posts.json",latest,"utf-8");
    res.send("Post is modified");
})

// // deleting the item 
app.delete("/movies/:moviesId",(req,res)=>{
    const id = req.params.moviesId ;
    const prev = fs.readFileSync("./posts.json",{encoding:"utf-8"});
    const parsed = JSON.parse(prev);

    const oldData = parsed.posts
    const newDATA = oldData.filter((post)=>{
        post.id === Number(id)
    })
    parsed.posts = newDATA;

    const latestData = JSON.stringify(parsed);
    fs.writeFileSync("./posts.json",latestData,'utf-8');
    res.send("Data is deleted")
})
app.listen(8080,()=>{
  console.log("The running port is 8080")
})