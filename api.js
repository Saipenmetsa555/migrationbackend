const {MongoClient}=require('mongodb');
const express=require('express');
const cors=require('cors');
const app=express();

const port=4000;

app.use(cors());
app.use(express.json());

let newClient;

//mongodb+srv://mdmadmin:sss@migmdbcluster-1.dlb5ekt.mongodb.net/?retryWrites=true&w=majority
app.post('/testConnectionAPI', async (req, res) => {
    const {selectDBAPI,connectUrlAPI } = req.body;
    console.log(selectDBAPI,connectUrlAPI);
    try {
      // Attempt to create a new MongoDB connection with the provided URL
       newClient = new MongoClient(connectUrl);
      await newClient.connect(); 
      //await newClient.close();
  
      res.json({ status: 'Connected successfully' });
    } catch (error) {
      //console.error('Error:', error);
      res.status(500).json({ status: 'Connection failed' }); 
    }
  });


app.listen(port,()=>{
    console.log(`Server Running at ${port}`);
})