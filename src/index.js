import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import DBConnection from './Database/db.js'
import FileRoutes from './routes/routes.js'
dotenv.config({path:'./env'});




const app = express();
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials :true,
    methods: ['POST', 'GET', 'DELETE', 'PUT'],
    exposedHeaders: ["set-cookie"],
}));

app.use(express.json({limit :"20kb"}));
app.use(express.urlencoded({extended : true}));

DBConnection()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is Running at port:${process.env.PORT}`);
        app.on("error",(error)=>{
          console.log("Error:",error);
          throw error;
        })
  })
})
.catch((error) => {
    console.log("MongoDB Connection Error !!!",error);
})

app.use("/api/v1/",FileRoutes)