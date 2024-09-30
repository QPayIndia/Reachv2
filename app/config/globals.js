module.exports = {
    domain:"http://ec2-3-108-62-163.ap-south-1.compute.amazonaws.com:8080",
    deliveryStatus:{
        1:"In Process",
        2:"Order Packed",
        3:"Shipped",
        4:"Order Cancelled",
        5:"Completed",
    },
    servicestatus:{
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
    }
}

