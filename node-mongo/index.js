const express = require('express');
const { getMongoDBConnection } = require('./db-connection');
const { ObjectId } = require('mongodb');
const app = express();

let db;

async function init() {
  try {
    db = await getMongoDBConnection(); // Await the connection
    console.log('MongoDB connected...');
    
    app.listen(8080, () => {
      console.log('Server is running on port: 8080');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err); // Log error
    process.exit(1); // Exit process with failure code
  }
}

init();


// Fetch all the movies
app.get('/movies', async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' }); // Check if db is initialized
    }

    const movies = await db.collection('movies').find({}).toArray(); // Combine find and toArray
    res.status(200).json(movies);
  } catch (err) {
    console.error('Error fetching movies:', err); // Log error details
    res.status(500).json({ error: 'Internal server error' });
  }
});
//fetch by id

app.get('/movies/:id', async (req,res)=>{
    try{
        if (!db) {
            return res.status(500).json({ error: 'Database not initialized' }); // Check if db is initialized
          }
        const id=req.params.id;
        const result=await db.collection('movies').findOne({_id:new ObjectId(id)});
        res.status(200).json(result);
    }catch(err){
        console.error('Error fetching movies:', err); // Log error details
        res.status(500).json({ error: 'Internal server error' });

    }
})