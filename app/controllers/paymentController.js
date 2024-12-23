const TransactionModel = require("../models/TransactionModel");
const path = require('path');
const crypto = require('crypto');
const Logger = require("../utils/logger");
exports.callback = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Invalid Transaction"
        });
    }

    const ResponseModel = function(model){
        this.MSPReferenceID= model.MSPReferenceID,
        this.Message= model.Message,
        this.MerchantOrderID= model.MerchantOrderID,
        this.TransactionType= model.TransactionType,
        this.ResponseCode= model.ResponseCode,
        this.PaymentMode= model.PaymentMode,
        this.Amount= model.Amount,
        this.secure_hash= model.secure_hash
       
    }

    let model = new ResponseModel({
        MSPReferenceID: req.body.MSPReferenceID,
        Message: req.body.Message,
        MerchantOrderID: req.body.MerchantOrderID,
        TransactionType: req.body.TransactionType,
        ResponseCode: req.body.ResponseCode,
        PaymentMode: req.body.PaymentMode,
        Amount: req.body.Amount,
        secure_hash: req.body.secure_hash
    })

    console.log(model);
    
    TransactionModel.UpdateTransactionResponse(model,(err,data)=>{
        if(model.ResponseCode == 200 || model.ResponseCode == 100){
            res.sendFile(path.join(__dirname, '../screen/success-msg.html'));
        }
        else
            res.sendFile(path.join(__dirname, '../screen/failure-msg.html'));
    })
};

exports.CreatePayment = (req,res)=>{

    const PaymentModel = function(model){
        this.userid = model.userid,
        this.bid = model.bid,
        this.amount = model.amount,
        this.description = model.description,
        this.paymenttype = model.paymenttype
       
    }

    let model = new PaymentModel({
        userid:req.body.userid,
        bid:req.body.bid,
        amount:req.body.amount,
        description:req.body.description,
        paymenttype:req.body.paymenttype
    })
    
    console.log(model)
    TransactionModel.CreatePayment(model,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.GetPaymentDetails = (req,res)=>{

   
   
    TransactionModel.getPaymentDetails(req.body.transactionId,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}
exports.GetTransactions = (req,res)=>{

   
   
    TransactionModel.getTransactions(req.body.userid,req.body.bid,req.body.type,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.TestInstant = (req,res)=>{

   
   
    TransactionModel.InitBillPayment(req.body.txnid,req.body.billid,(err,data)=>{
        if(err){
            res.status(400).send(data);
        }
        else
            res.status(200).send(data);
    })
}


exports.pay = (req,res)=>{

   
    let orderID =  req.query.orderId;  
    
    TransactionModel.getDetails(orderID,(err,rows)=>{
       
        if(err){
            console.log("Error Occured while creating payment page ==>"+err);
                   
             res.writeHead(404, { 'Content-Type': 'text/html' });
             res.end('<h1>404 Not Found</h1>');
             return;
        }
        let amount = rows[0]['amount'].toString();
        if(amount){

            amount = "`"+Buffer.from(amount).toString('base64');
            let secretKey =  'vMVOg9wxslEUlvX3IjYDXAgVL9vUk+n0zvrA3fG/9sg4ZTdXST8=';  
            let QPayID = 'qpyerapiacc'+amount;
            let QPayPWD = 'qpyer!123';
            let Mode = 'dasd';
            let ResponseURL = 'http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080/api/pay/callback';
            let TransactionType = 'PURCHASE';
            let Currency = 'INR';
            let secure_hash = '';
           
            secure_hash = calculateSHA512Hash(secretKey+ "|" + ResponseURL + "|" +QPayID + "|" + QPayPWD + "|"+ TransactionType+ "|" + orderID + "|" + Currency + "|" + Mode + "|"+ ''+ "|" + ''+ "|"+'' )

           
            res.writeHead(200, { 'Content-Type': 'text/html' });
          
                res.write(`
                    <html>
                    <body>
                   <form id="payFrm" action="https://pg.qpayindia.com/wwws/Payment/PaymentDetails.aspx" method="post">
            
            <input type="hidden" name="ResponseURL" value="`+ResponseURL+`">
            <input type="hidden" name="QPayID" value="qpyerapiacc`+amount+`">
            <input type="hidden" name="QPayPWD" value="`+QPayPWD+`">
            <input type="hidden" name="TransactionType" value="`+TransactionType+`">
            <input type="hidden" name="OrderID" value="`+orderID+`">
            <input type="hidden" name="Currency" value="`+Currency+`">
            <input type="hidden" name="Mode" value="`+Mode+`">
            <input type="hidden" name="Paymentoption" value="C,D,N,U">
            <input type="hidden" name="secure_hash" value="`+secure_hash+`">
            
            
            
        </form>
         <script>
            window.onload = function() {
              document.getElementById('payFrm').submit();
            };
          </script>
          
                    </body>
                    </html>
                `);
        
               
                res.end();
            } 
    });

  


    function calculateSHA512Hash(input) {
                // Create a SHA-512 hash
                const hash = crypto.createHash('sha512');
                
                // Update the hash with the input data
                hash.update(input);
                
                // Return the hash in hexadecimal format
                return hash.digest('hex');
              }

    
};


