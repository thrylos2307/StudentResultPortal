const mongoose = require('mongoose');
const position =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    candidate: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});

 // Add the unique array plugin
//  async function fg(){
//      try{
//     console.log('ed')
//     position.plugin(uniqueArrayPlugin);
//     const M = mongoose.model('Test', position);
  
//     // Need to wait for indexes to build, otherwise unique won't work!
//     await new Promise((resolve, reject) => {
//       M.once('index', err => err ? reject(err) : resolve());
//     });
  
//     // Throws a ValidationError. The plugin adds a validator to `names`
//     await M.create([{name: 'Test', candidate: [mongoose.Schema.Types.ObjectId, mongoose.Schema.Types.ObjectId] }]);
//     console.log('done');
//     }catch(e){
//         console.log(e);
//     }
// }
// fg();
// Models are responsible for creating and reading documents from the underlying MongoDB database
// An instance of model is called a document
const Positions = mongoose.model('Position', position);
module.exports = Positions;