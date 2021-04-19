# [Student Result Portal](https://github.com/thrylos2307/Evoting-StudentPortal/tree/evoting_studentp/evoting-studentp/student)

[Result portal](https://github.com/thrylos2307/Evoting-StudentPortal/tree/evoting_studentp/evoting-studentp/student) is site were faculty can update the results for student according to their semesters and major info . Admin can create faculty , batch(student login) and major info for ease to login credentials and major info.  Students can view their result as per their semesters .

### How to Run
* Clone the branch:
```
git clone -b studentportal https://github.com/thrylos2307/Evoting-StudentPortal.git
```
* Get into the folder :<br>
cd [path to dir ]    , where indeex.js is located    

* To install all dependencies where package.json is located:
```
npm i
``` 
* Import Database:<br>
Create the databse_name in mysql<br>
import the database from db.sql to created databse name:<br>
```
mysql -u username -p database_name < db.sql
```
* Create privacy.js file and include all database credentails<br>
```
var mysql=require('mysql');
module.exports= mysql.createConnection({
    host: 
    user:
    password: 
    database:
    port:
});
```
* Optional:
  &emsp;create /config/environment.js to include credentials for nodemailer 
 ```
 module.exports = {
    smtp : {
        host: "smtp.gmail.com",
        port: '465',
        secure: true, 
        auth: {
            user: 
            pass: 
        }
    }}
 ```
      
 
 * Run:
  ```
  nodemon index.js
  ```

### Use
Login as admin to create credentials for faculty and student , then login with faculty credential to create results...<br>
```
Id: admin  
Pass: admin123 
```
Note : remember the login password while creating credential.<br>
* To upload file from .csv follow the column name and order as:
  - Admin:<br>
    &emsp; To upload details of faculty ,batch or subject using csv . Admin needs to update column name with specific name :
  + For Faculty :<br>
    &emsp; Col name: id  | Name | Email | Password
  + For Major info :<br>
     &emsp;        Col Name: Code | Major | Faculty_id | FacultyName | sem
  + For Batch :<br>
    &emsp;Col Name: id | Email | Name | Password | Batch | Branch | Group | Sem

  - Faculty:<br>
    &emsp;To upload the result for a particular batch the faculty should know the col value . And they can see the col name by going to the result table and clicking on add more and can see the column name .
  
Create Major with  "_" instead of white spaces.

## Link to [site](https://studentresult.herokuapp.com).
