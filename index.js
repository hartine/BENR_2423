const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(express.json())

// user login api 
app.post('/login', async (req, res) => {
  // step #1: req.body.username ??
  if (req.body.username != null && req.body.password != null) {
    let result = await client.db("maybank2u").collection("users").findOne({
      username: req.body.username
    })

    if (result) {
      // step #2: if user exist, check if password is correct
      if (bcrypt.compareSync(req.body.password, result.password) == true) {
        // password is correct
        var token = jwt.sign(
          { _id: result._id, username: result.username, name: result.name },
          'passwordorangsusahnakhack'
        );
        res.send(token)
      } else {
        // password is incorrect
        res.status(401).send('wrong password')
      }

    } else {
      // step #3: if user not found
      res.status(401).send("username is not found")
    }
  } else {
    res.status(400).send("missing username or password")
  }
})

// new user registration
app.post('/user', async (req, res) => {
  // check if username already exist ??

  // insertOne the registration data to mongo
  const hash = bcrypt.hashSync(req.body.password, 10);

  let result = await client.db("maybank2u").collection("users").insertOne(
    {
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email
    }
  )
  res.send(result)

})

// get user profile
app.get('/user/:id', verifyToken, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  let decoded = wt.verify(token, 'passwordorangsusahnakhack');

  if (decoded) {//if user is login
  if (decoded._id == req.params.id){//if the user is accessing his own profile
   let result = await client.db("maybank2u").collection("users").findOne({
    _id: new ObjectId(req.params.id)
   })
  res.send(result)
  }else {
    res.status(401).send('Unauthorized Access')
  }}
  if (req.identify._id != req.params.id) {
    res.status(401).send('Unauthorized Access')
  } else {
    let result = await client.db("maybank2u").collection("users").findOne({
      _id: new ObjectId(req.params.id)
    })
    res.send(result)
  }
})

// update user account
app.patch('/user/:id', verifyToken, async (req, res) => {
  if (req.identify._id != req.params.id) {
    res.send('Unauthorized')
  } else {
    let result = await client.db("maybank2u").collection("users").updateOne(
      {
        _id: new ObjectId(req.params.id)
      },
      {
        $set: {
          name: req.body.name
        }
      }
    )
    res.send(result)
  }
})

// delete user account
app.delete('/user/:id', verifyToken, async (req, res) => {
  let result = await client.db("maybank2u").collection("users").deleteOne(
    {
      _id: new ObjectId(req.params.id)
    }
  )
  res.send(result)
})

app.post('/buy', async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]

  var decoded = jwt.verify(token, 'mysupersecretpasskey');
  console.log(decoded)
})

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://b022210196:gjass3YaeDXQfOhv@cluster0.d7k674t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, "passwordorangsusahnakhack", (err, decoded) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.identify = decoded

    next()
  })
}

async function run() {
  try {
    // Connect the client to the server  (optional starting in v4.7)
    await client.connect();
    console.log('Connected successfully to MongoDB')
  } finally {
  }
}
run().catch(console.dir);