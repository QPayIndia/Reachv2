

const RequestValidator = function(model){}

RequestValidator.validateRequest = (req,res,data,auth)=>{

    for(const key of data){
      if(req.body[key] == null ||  req.body[key] == "") {
         res.status(400).send({
        status:"failure",
        message:"Invalid Request Body"
    });
    break;
   
    }
    if(key == data[data.length - 1]) auth(true);  
    }


}








module.exports = RequestValidator;