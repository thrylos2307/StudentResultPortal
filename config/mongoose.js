const env = require('./environment')
const mongoose = require('mongoose');
// mongoose.connect(`mongodb://localhost/${env.db}` , { useUnifiedTopology: true });
mongoose.connect(env.mongo_uri, { useUnifiedTopology: true ,  useNewUrlParser: true})
const db = mongoose.connection;
db.once('open', function(){
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;