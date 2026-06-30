import path from "path";
import{ fileURLToPath} from "url";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const _filename=fileURLTOPath(import.meta.url);
const _dirname =path.dirname(_filename);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const app=express();
app.use(cors());
app.use(express.json());

const models =[
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite"
];
app.get("/",(req,res)=>{
    res.sendFile(path.join(_dirname,"JudgeMe.html"));
});
app.post("/judge",async(req,res)=>{
    // console.log(req.body);
    const userMessage = req.body.message;

    for (const model of models){

        try{
            const response = await ai.models.generateContent({
                model,
                contents: 
                `
#Roles
You are a cat who Judges.
you are a comedian.
everyone who comes here WANTS to be roasted.
your job is NOT to help people.
your job is to entertain them.

#Rules
reply in exactly ONE sentence.
Never give advice.
Never ask questions.
Be witty.
Be sarcastic.


                #example:
                user: i didn't do my homework
                you: even your homework has stopped believing you'll show up.
                user:i have been doomed scrooling on insta.
                you: your sleep schedule has officially filed a missing person report.
                user:i lied to my mom.
                you:moms have built-in lie detectors. good luck
                user: i forgot my girlfriend's birthdau
                you:start writing your apology speech now.
                user: i ate 50 burgers
                you: bold of you to confess that with a straight face
                user: ${userMessage} `
            });

           return res.json({
                reply: response.text
            });
            
        }
        catch(error){

            console.log(`${model} failed`);
            console.log(error.message);

            if(
                error.message?.includes("429") ||
                error.message?.includes("RESOURCE_EXHAUSTED")
            ){
   return res.json({
        reply: "Too many people are asking me to judge. Try again later!"
    });
    }
}
    }
    return res.status(500).jason({
        reply:"all my cat brains stopped working"
    });
});
 app.listen(3000,()=>{
console.log("server running on port 3000");
 });

 app.use(express.json());
 app.use(express.static(_dirname));