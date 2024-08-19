const sql = require('./db.js');

const SubCategory = function(model){
    // this.categoryid = model.id,
      this.name = model.name,
      this.categoryid = model.categoryid,
      this.createdby = model.createdby
    
}

SubCategory.create = (model,subcategoryid,result)=>{
    
    if(subcategoryid == 0){
      addCategory(model).then(()=>{
        getAllCategory(model.categoryid).then((data)=>{
          result(null,{status:"success",message:"Category Inserted Successfully",data:data})
        }).catch((err)=>{
          result(null,{status:"success",message:"Category Inserted Successfully",data:[]})
        })
      }).catch((err)=>{
        result(err,{status:"failure",message:"Category Insert Failed"})
      })
    }else{
      updateCategory(model,subcategoryid).then(()=>{
        getAllCategory(model.categoryid).then((data)=>{
          result(null,{status:"success",message:"Category Updated Successfully",data:data})
        }).catch((err)=>{
          result(null,{status:"success",message:"Category Updated Successfully",data:[]})
        })
      }).catch((err)=>{
        result(err,{status:"failure",message:"Category Update Failed"})
      })
    }
   
}
SubCategory.delete = (id,result)=>{
  
  deleteCategory(id).then(()=>{
    getAllCategory(model.categoryid).then((data)=>{
      result(null,{status:"success",message:"Category Deleted Successfully",data:data});
    }).catch((err)=>{
      result(null,{status:"success",message:"Category Deleted Successfully",data:[]});
    })
  }).catch((err)=>{
    result(err,{status:"failure",message:"Category Delete Failed",data:[]});
  })
}
SubCategory.getAllCategory = (id,result)=>{
  
  getAllCategory(id).then((data)=>{
    result(null,{status:"success",message:"Category Fetched Successfully",data:data});
  }).catch((err)=>{
    result(err,{status:"failure",message:"Category Fetch Failed",data:[]});
  })
}

function deleteCategory(id){
  return new Promise((resolve,reject)=>{
    sql.query("DELETE FROM sub_category_master WHERE subcategoryid = ?",[id],(err,res)=>{
      if(err){
          reject(err);
          console.log("Category Delete Failed");
          return;
      }
      console.log("Category Deleted Successfully");
      resolve();
      
      
  })
  })
}


function addCategory(model){
  return new Promise((resolve,reject)=>{
    sql.query("INSERT INTO sub_category_master SET ?",model,(err,res)=>{
      if(err){
          reject(err);
          console.log('Category Insert Failed due to '+err);
          return;
      }
      console.log('Category Created successfully');
      resolve();
      
  })
  })
}
function updateCategory(model,categoryid){
  return new Promise((resolve,reject)=>{
    sql.query("UPDATE sub_category_master SET ? WHERE subcategoryid = ?",[model,categoryid],(err,res)=>{
      if(err){
          reject(err);
          console.log('Category Insert Failed due to '+err);
          return;
      }
      console.log('Category Created successfully');
      resolve();
      
  })
  })
}

function getAllCategory(id){
  return new Promise((resolve,reject)=>{

      sql.query("SELECT subcategoryid,categoryid,name,DATE_FORMAT(createdon, '%d-%m-%Y %h:%i:%s %p') as createdon FROM sub_category_master WHERE categoryid = ?",id,(err,rows)=>{
          if(err){
              reject(err);
              console.log("Get Category Failed");
              return;
          }
          console.log("Category Fetched Successfully");
          resolve(rows);
          
          
      })
      

  })
}




SubCategory.getAll = (result)=>{
    sql.query("SELECT * FROM category_master ",(err,rows)=>{
        if(err){
            result(err,{status:"sucess",message:"err"});
            
            return;
        }
        
        result(null,{status:"success",message:"Data Fetched Successfully",data: {categories:rows}});
    })
}





module.exports = SubCategory;