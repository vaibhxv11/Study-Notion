require("dotenv").config();
const {Suprsend} = require("@suprsend/node-sdk");

const supr_client = new Suprsend(process.env.WORKSPACE_KEY, process.env.WORKSPACE_SECRET);



const response=supr_client.track(
    "balasodudhal775@gmail.com" ,
    "New Ticket Assingn" ,
    {
        user :"Vaibhav" ,
        orderNo:5565,
        task_name:"Heeelo",
        assigned_by:"Vaibhav",
    }

);

response.then((res)=>console.log("response" , res));