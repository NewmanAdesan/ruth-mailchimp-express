const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require('express');
const cors = require('cors');  

const app = express();
app.use(express.json()); // For parsing JSON request bodies
app.use(cors());  // Enable CORS 

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_DATA_CENTER = process.env.MAILCHIMP_DATA_CENTER;

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_DATA_CENTER,
});

async function getLists() {
    try {
      const response = await mailchimp.lists.getAllLists();
      console.log(response);
      // This will print out your lists and their corresponding IDs
    } catch (error) {
      console.error(error);
    }
  }
  
  getLists();

// Route that accepts listId as a path parameter
app.post("/subscribe/:listId", async (req, res) => {
    const { listId } = req.params; 
    const { email_address, status, merge_fields } = req.body; 

    console.log (req.body, req.params)
    if (!email_address || !status || !merge_fields) {
        console.log(email_address, status, merge_fields)
        return
    }
  
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address,
        status,
        merge_fields
      });
   
      console.log("Successfully added contact:", response);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error adding contact:", error);
      res.status(500).json({ error: error.message });
      
    }
});

app.get("/testing", async (req, res) => {
    res.send("Testing Successful");
});
  
// Start the server
const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});