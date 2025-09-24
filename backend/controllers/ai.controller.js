import { generateContent } from "../services/ai.service.js"

export const getResult = async(req,res)=>{
    try{
     const {prompt} = req.query;
     const result = await generateContent(prompt);
     return res.send(result);
    }catch(error){
       next(error);
    }
}