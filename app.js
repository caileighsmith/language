//Imports:
const express = require('express'); 
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config();

//Server definitions:
const app = express();
const port = process.env.PORT || 3000;

//Enabling cross origin resource sharing (cors):
app.use(cors())

//AI definitions:
const geminiKey = process.env.GEMINI_KEY
const genAI = new GoogleGenerativeAI(geminiKey)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const supportedLanguages = ['hebrew', 'german', 'russian', 'spanish', 'french']

const startClass = async(language)=>{
    try {
        const prompt = `Hi, your job is to be a language tutor. This is the first ever lesson that our student will take, assume they know nothing. The language chosen is: ${language}. Introduce the first 10 words for the user and return it in a list, with english meanings, and nothing else. Your response should JUST be the list. Provide transliterations too, so we know what the words sound like`
        const result = await model.generateContent(prompt)
        const response = result.response.text()
        return response
    } catch (error){
        console.error(`Error generating content: ${error}`)
    }
}

const generateAiTheme = async(language, languageTheme, learningLevel) => {

    try{
        const prompt = `Based on the theme '${languageTheme}', your job is to be a language tutor. This is the first ever lesson that our student will take, assume they know nothing. The language chosen is: ${language}. Introduce the first 10 words for the user and return it in a list, with english meanings, and nothing else. Your response should JUST be the list. Provide transliterations too, so we know what the words sound like.`;
        const result = await model.generateContent(prompt);
        const response = result.response.text()
        return response;
    } catch (error){
        console.error(`Error generating content: ${error}`)
    }

}

const createFlashCard = async (wordsArray)=>{
    //In this function, we take in an array of words, and allow the user to create flashcards for each word in the array
}

app.get('/', async (req, res)=>{
    
    //Testing the generateAiTheme function:
    const data = await generateAiTheme("russian", "sports")
    if (!data){
        return res.status(400).send({error: `No data provided.`})
    }
    
    res.send({
        response: data
    })
})

app.get('/learn/:languageName', async(req, res)=>{

    const language = req.params.languageName.toLowerCase()

    if (!(supportedLanguages.includes(language))){
        return res.status(400).send({error: `Language '${language}' not supported.`})
    }

    const response = await startClass(language)
    console.log(response)
    res.send({
        message: `${language} is supported!`,
        firstClass: response
    })

})

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})
