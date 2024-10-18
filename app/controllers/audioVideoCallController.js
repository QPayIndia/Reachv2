const AudioVideoCallModel = require("../models/audioVideoCallModel");



exports.createCall = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Content cannot be Empty"
        });
    }

    
    const model = new AudioVideoCallModel({
        hostid :req.body.hostid,
        hosttype :req.body.hosttype,
        guestid :req.body.guestid,
        guesttype :req.body.guesttype,
        createdby :req.body.hostid,
        calltype :req.body.calltype
        // hostprofile :req.body.hostprofile,
        // hostname :req.body.hostname
        
    });

    AudioVideoCallModel.create(model,"","",(err,data)=>{
        if(err){
            res.status(500).send({
                message:
                  err.message || "Something went wrong."
              });
        }
        else
            res.status(200).send(data);
    });

   
};

