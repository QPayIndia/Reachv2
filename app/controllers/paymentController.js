
exports.callback = (req,res)=>{
    if(!req.body){
        res.status(400).send({
            message:"Invalid Transaction"
        });
    }

// Sample JSON response (parsed)
const jsonResponse = {
    MSPReferenceID: req.body.MSPReferenceID,
    Message: req.body.Message,
    MerchantOrderID: req.body.MerchantOrderID,
    TransactionType: req.body.TransactionType,
    ResponseCode: req.body.ResponseCode,
    PaymentMode: req.body.PaymentMode,
    Amount: req.body.Amount,  // Note: This value seems to be base64 encoded.
    secure_hash: ''
};

// Route to serve the HTML page

    const amountDecoded = Buffer.from(jsonResponse.Amount, 'base64').toString('utf-8');  // Decoding the base64 amount

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Qpay Reach Response</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    border-collapse: collapse;
                    width: 50%;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <h1>Transaction Details</h1>
            <table>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>MSP Reference ID</td>
                    <td>${jsonResponse.MSPReferenceID}</td>
                </tr>
                <tr>
                    <td>Message</td>
                    <td>${jsonResponse.Message}</td>
                </tr>
                <tr>
                    <td>Merchant Order ID</td>
                    <td>${jsonResponse.MerchantOrderID}</td>
                </tr>
                <tr>
                    <td>Transaction Type</td>
                    <td>${jsonResponse.TransactionType}</td>
                </tr>
                <tr>
                    <td>Response Code</td>
                    <td>${jsonResponse.ResponseCode}</td>
                </tr>
                <tr>
                    <td>Payment Mode</td>
                    <td>${jsonResponse.PaymentMode}</td>
                </tr>
                <tr>
                    <td>Amount</td>
                    <td>${amountDecoded}</td>
                </tr>
                <tr>
                    <td>Secure Hash</td>
                    <td>${jsonResponse.secure_hash}</td>
                </tr>
            </table>
        </body>
        </html>
    `);

};


exports.pay = (req,res)=>{

    if(true){
    res.writeHead(200, { 'Content-Type': 'text/html' });

    let amount = '`MTE=';

        // Send the HTML code
        res.write(`
            <html>
            <body>
           <form id="payFrm" action="https://pg.qpayindia.com/wwws/Payment/PaymentDetails.aspx" method="post">
	
	<input type="hidden" name="ResponseURL" value="http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080/api/pay/callback">
	<input type="hidden" name="QPayID" value="qpaydemo`+amount+`">
	<input type="hidden" name="QPayPWD" value="asdf!123">
	<input type="hidden" name="TransactionType" value="PURCHASE">
	<input type="hidden" name="OrderID" value="7387483">
	<input type="hidden" name="Currency" value="INR">
	<input type="hidden" name="Mode" value="Test">
	<input type="hidden" name="Paymentoption" value="C,D,N,U">
	<input type="hidden" name="secure_hash" value="ajEyiMNDXs1tJklqMaAdfkem25lP/prFHx6PKTZUTU/EVuaz5A==">
	
	// <input type="submit" value="submit">
	
</form>
 <script>
    window.onload = function() {
      document.getElementById('payFrm').submit();
    };
  </script>
  
            </body>
            </html>
        `);

        // End the response
        res.end();
    } else {
        // For any other URL, send a 404 response
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
};


