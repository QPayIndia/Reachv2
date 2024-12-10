module.exports = {
    domain:"http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080",
    deliveryStatus:{
        0:"Order Not Placed",
        1:"In Process",
        2:"Order Packed",
        3:"Shipped",
        4:"Order Cancelled",
        5:"Completed",
    },
    servicestatus:{
        0:"Order Not Placed",
        1:"In Process",
        2:"Service Completed",
        3:"Service Cancelled"
       
    },
    pgCommission : 2.5,
    payStatus:{
        1:"Incomplete",
        2:"Paid",
        3:"Pending",
        4:"Failed",
        5:"Refunded"
    },
    secretKey:'2d4e96c50ee6d74fcf4b895b0a3e35e6747b92df5b4a0e672c939367e6aa2e65',
    ivKey:'bfd28cdc509488382d2ae57d9e72bfa0',
    billPayCommission:1.4
}

