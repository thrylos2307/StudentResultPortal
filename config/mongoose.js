const env = require('./environment')
const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/${env.db}` , { useUnifiedTopology: true });

const db = mongoose.connection;
db.once('open', function(){
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;