const express = require('express')
const app = express()
const port = 3000
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");
initializeApp({
  credential : cert(serviceAccount),
});

const db = getFirestore();


app.set("view engine","ejs");

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/signin', (req, res) => {
    res.render('sin')
  })

app.get('/sinsub',(req,res)=>{
  const email=req.query.email;
  //  console.log("email:", email);
    const pwd=req.query.pwd;
  //  console.log("pwd:", pwd);
   
   db.collection("users")
   .where("email","==",email)
   .where("password","==",pwd)
   .get()
   .then((docs)=>{
      if(docs.size>0){
  //Query database with the Users when the login is successfull.
        const usersData = [];      
        db.collection('users')
          .get()
          .then((docs)=>{
            docs.forEach((doc)=>{
              usersData.push(doc.data());
            });
          })
          .then(()=>{
              res.render("Website",{userData:usersData})
        });
      }
      else{
        res.send("Login Failed ")
      }
   })
});

app.get('/supsub', (req,res)=>{
    const fullnam  = req.query.fullnam;
  //  console.log("fullnam:", fullnam);
    const fnam=req.query.fnam;
  // console.log("fnam:", fnam);
    const mnam=req.query.mnam;
  //  console.log("mnam:", mnam);
    const lnam=req.query.lnam;
  // console.log("lnam:", lnam);
    const email=req.query.email;
  //  console.log("email:", email);
    const pwd=req.query.pwd;
  //  console.log("pwd:", pwd);

//Adding new data to collection
db.collection('users').add({
  name:fullnam,
  email:email,
  password: pwd,
}).then(()=>{
  res.send("Sign Up Successfully");
});
});
app.get('/signup', (req, res) => {
    res.render('sup')
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})