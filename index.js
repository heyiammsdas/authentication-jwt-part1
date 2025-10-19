
const express = require('express') ;
const jwt = require('jsonwebtoken') ;
const JWT_SECRET = "ilovemonkey" ;
const app = express() ;
const port = 3000 ;

app.use(express.json()) ;

const users = [] ;

app.post('/signup' , (req , res)=>{

    const username = req.body.username ;
    const password = req.body.password ;

    users.push({
        username: username ,
        password: password 
    })

    res.json({
        message: "You have signed up" 
    })

}) ;

app.post('/signin' , (req , res)=> {

    const username = req.body.username ;
    const password = req.body.password ;

    const user = users.find(user => user.username === username && user.password === password) ;
    if(user) {
         const token = jwt.sign({
            username: username 
         } , JWT_SECRET ) ; 

        res.send({
            token
        })
    }
    else {
        res.status(403).send({
            message:"Invalid username or password " 
        })
    }
});

app.get('/me', (req, res) => {
    const auth = req.headers.token;
    try {
        const userDetails = jwt.verify(auth, JWT_SECRET);
        const username = userDetails.username;
        const user = users.find((user) => user.username === username);

        if (user) {
            res.send({
                username: user.username,
                password: user.password
            });
        } else {
            res.status(401).send({
                message: "User not found"
            });
        }
    } catch (err) {
        res.status(401).send({
            message: "Invalid Token"
        });
    }
});

app.listen(port,()=> {
    console.log("server is running on port " + port ) ;
})