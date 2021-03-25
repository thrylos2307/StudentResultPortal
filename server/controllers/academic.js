const e = require("express");
const con=require("../privacy.js");
module.exports.create = function(req, res){
    console.log(req.body,req.user);
    
    con.query(`select *from subject_info where Faculty_id=${req.user.id} and Code='${req.body.code.toLowerCase()}'`,function(err,result){
        console.log(result,result.length);
        if(err){
            console.log(err)
        }
        else if(!result.length)
        {
            console.log("You have enter wrong subject code or wrong credential for creating table");
        }
        else {
            console.log("authorized user");
            var table=req.body.branch+'_'+req.body.sem+'_'+req.body.code+'_'+result[0].Major+'_'+req.body.batch_year;
            con.query(`create table if not exists ?? (roll bigint primary key)`,[table],function(err,result){
                if(err)
                console.log(err);
            });
        }
    });
   res.redirect('/faculty');
}

module.exports.update = function(req, res){
    console.log("priting=>",req.body);
    cols=req.body;
    
    con.query(`select *from subject_info where Faculty_id=${req.user.id} and Code='${req.body.code.toLowerCase()}'`,function(err,result){
        console.log(result);
        if(err){
            throw err;
        }
        else if(!result)
        {
            console.log("You have enter wrong subject code or wrong credential for creating table");
        }
        else {
            console.log("authorized user");
            var table=req.body.branch+'_'+req.body.sem+'_'+req.body.code+'_'+result[0].Major+'_'+req.body.batch_year;
            tables=[]
            tables.push(table)
            var sql="alter table ";
            sql+=table
            
            if(typeof cols.col=="string")
            {
                sql+=" add column "+cols.col+" "+cols.type+";";
            }
            else{
                for( var i=0;i<cols.col.length;i++)
                {
                    sql+=" add column "+cols.col[i]+" "+cols.type[i]+",";
                }
                sql=sql.slice(0,-1);
                sql+=";";
            } 
            console.log(tables,sql);
            con.query(sql,function(err,result){
                if(err)
                throw err;
                else
                {res.result=result;
                   console.log(result);
                }

            });
        }
    });
   res.render('faculty_home.ejs');
}
module.exports.show= function(req, res){
    console.log("priting=>",req.body,req.user);
    cols=req.body;
    try{
    con.query(`select Code from subject_info where Faculty_id=${req.user.id}`,function(err,result,next){
         console.log(result);
        //  if(typeof result.Code=="string")
        //  var rq=result.Code;
        regex='.+';
        for(var c in result)
        regex+=result[c].Code+"|";

        regex=regex.slice(0,-1);
        regex+='.*';
        con.query(`select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP ?`,[regex],function(err,tableresult,next){
            console.log(tableresult);
            tables=[]
            for(var tab in tableresult)
            {
                tables.push(tableresult[tab].TABLE_NAME)
            }
            res.render('tables.ejs',{table:tables});
        });        
    });
    }
    catch{
        res.render('faculty_home.ejs');
    }
    //select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP 'CSE.+[0-9]{4}$';
}
module.exports.result= function(req, res){
    console.log("priting=>",req.body,req.user);
    cols=req.body;
    try{
        con.query(`select  *from ??`,[req.body.table],function(err,result){
            console.log(result.length);
            res.render("result.ejs",{results:result,tablename:req.body.table});
        });
    }
    catch{

        res.render('faculty_home.ejs');
    }
    //select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP 'CSE.+[0-9]{4}$';
}
module.exports.resupdate= function(req, res){
    console.log("updated values=>",req.body,req.user);
   
      let keys=Object.keys(req.body);
      console.log(keys);
     var js={};
     for(var i=1;i<keys.length;i++)
     {  
         data=keys[i].split(" ");
         console.log(data);
         if(!js[data[0]])
         {
             js[data[0]]={}
         } 
         js[data[0]][data[1]]=req.body[keys[i]];
          
        for(var key in js)
        {
            for(var ink in js[key])
            {
                console.log(js[key][ink],js[key]);
            }
        }
        // js.data[0].data[1]='s';
      
     }
     
     for(var key in js)
     {   var sql="update "+req.body.table+" set ";
         for(var k in js[key])
         {
            
            sql+=k+"="+parseFloat(js[key][k]) + ",";
         }
         sql=sql.slice(0,-1);
         sql+=" where roll="+key;
         con.query(sql,function(err,result){
            if(err)
            throw err;
         });
     }
        res.render('faculty_home.ejs');
}

module.exports.delete= function(req, res){
    console.log("updated values=>",req.query);
   var roll=parseInt(req.query.roll);
    con.query(`delete from ${req.query.table} where roll=?`,[roll],function(err,result){
        if(err)
        throw err;

    });
           
        res.render('faculty_home.ejs');
    
    //select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP 'CSE.+[0-9]{4}$';
}