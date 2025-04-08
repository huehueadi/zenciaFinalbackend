import mongoose from "mongoose";

const connectionDatabase = async()=>{
   try {
      await mongoose.connect("mongodb+srv://zfintechpvtltd:sMCG5UFvbXzdHrVK@cluster0.zvosn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
         serverSelectionTimeoutMS: 5000000,
      })
    console.log("Database connected")
   
   } catch (error) {
      console.log("Error while connecting the Database")
   }
}
export default connectionDatabase