//Imports:
const express = require('express'); 
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

//Server definitions:
const app = express();
const port = process.env.PORT || 3000;

//AI definitions:
const geminiKey = process.env.GEMINI_KEY;
const genAI = new GoogleGenerativeAI(geminiKey)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const supportedLanguages = ['hebrew', 'german', 'russian', 'spanish', 'french']


app.use(cors());

app.get('', (req, res)=>{
    res.send('hi')
})

app.get('/language/:languageName', async(req, res)=>{

    const language = req.params.languageName.toLowerCase()

    if (!(supportedLanguages.includes(language))){
        return res.status(400).send({error: `Language '${language}' not supported.`})
    }

    res.send({
        message: language
    })

})


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
