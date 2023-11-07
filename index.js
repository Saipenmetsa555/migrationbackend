const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(express.json());
app.use(cors());
//new one
//mongodb+srv://mdmadmin:skts2023@migmdbcluster-1.dlb5ekt.mongodb.net/?retryWrites=true&w=majority
let newClient; 
app.post('/testConnection', async (req, res) => {
  const { connectUrl,selectDB } = req.body;
  console.log(connectUrl,selectDB);  
  try { 
    // Attempt to create a new MongoDB connection with the provided URL
     newClient = new MongoClient(connectUrl);
    await newClient.connect();   
    //await newClient.close();

    res.json({ status: 'Connected successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'Connection failed' }); 
  }
});

app.get('/loadData', async (req, res) => {
  try {
    // Ensure the client is connected 
    await newClient.connect();

    const db = newClient.db('migmdbcluster-1'); 
    const detailsCollection = db.collection('configurationDatabases');
    const details = await detailsCollection.find({}).toArray();
    res.json(details);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'Failed to retrieve data' });
  } 
}); 

//database services
app.post("/connectMDB",async(req,res)=>{
  const {selectDB,connectUrl,name}=req.body
  console.log(selectDB,connectUrl,name);
  
  try{
    await newClient.connect();
    const db=newClient.db('migmdbcluster-1');
    const collection=db.collection('configurationDatabases');
    const data={
      selectedDB:selectDB,
      connectUrl:connectUrl,
      name:name,
      status:"Tested"
    }
    const result=collection.insertOne(data);
    res.json('Inserted success');
  }catch(e){
    res.json("Insert fail");
  }
   
})

//api services
app.post("/apiData",async(req,res)=>{
    const {selectDB,connectUrl,name}=req.body
    try{
      await newClient.connect();
      const db=newClient.db('migmdbcluster-1');
      const collection=db.collection('configurationAPI');
      const data={
        selectedDB:selectDB,
        connectUrl:connectUrl,
        name:name,
        status:"Tested"
      }
      const result=collection.insertOne(data);
      res.json("Inserted Success");
    }catch(e){
      res.json("Inserted Failed");
    }
})

app.get("/apiDataGet",async(req,res)=>{
    try{
      await newClient.connect();
      const db=newClient.db('migmdbcluster-1');
      const collection=db.collection('configurationAPI');
      const data=await collection.find({}).toArray();
      res.json(data)
    }catch(e){
      res.json({status:"fail to retriev data"});
    }
})


//System connection
app.post('/dropValue', async (req, res) => {
  const { metaValue } = req.body; 
  let collectionName=''
  console.log(metaValue)
  if(metaValue==='API'){
    collectionName="configurationAPI";
  }else{
    collectionName="configurationDatabases"
  }
  try{
    await newClient.connect();
    const db=newClient.db('migmdbcluster-1');
    const collection=db.collection(collectionName);
    const result=await collection.find({}).toArray(); 
    res.json(result); 
   // console.log(result)
  }catch(error){  
    res.status(500).json({error:'Internal Server Error'})
  }
}); 

//system connection
app.post('/saveSystemConnectionData',async(req,res)=>{
    const {profileName, selectOption, contentDataSource}=req.body;
    console.log(profileName,selectOption,contentDataSource)
    try{
      await newClient.connect();
      const db=newClient.db('migmdbcluster-1');
      const collection=db.collection('systemConnection');
      const data ={
        profileName:profileName,
        selectOption:selectOption,
        contentDataSource:contentDataSource
      }
      const result=collection.insertOne(data)
      res.json({status:'added successfully'})
    }catch(err){
      res.json({status:"fail to add"})
    }
})

app.listen(port, () => { 
  console.log(`Server is running on Port:${port}`);
}); 
