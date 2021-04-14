var Chart = require('chart.js');
const votes = require('../models/votes');
const position = require('../models/position');
const election = require('../models/election');
module.exports = async (req, res) => {
    let allData = [];
    // votes.findById(req.election._id, (err, election) => {
    //     election.distinct("position", (err1, positions) => {
    //         for(let i = 0; i < positions.length; i++) {
    //             let p;
    //             positions.findById(positions[i]._id, (err2, data) => {
    //                 p['name'] = data.name;
    //                 election.find({position : positions[i]._id, candidate : data.})
    //             })
    //         }
    //     })
    // })
    await election.findById(req.query.e_id, (err)=>{
        if(err){
            req.flash('error', 'please use corretc election id');
            return res.redirect('back');
        }
    }).populate({
        path: 'positions',
        populate: {
            path: 'candidate'
        }
    }).exec(async (err, docs) => {
        for (let i = 0; i < docs.positions.length; i++) {
            let p = docs.positions[i];
            let name = p.name;
            let candidates = p.candidate;
            let candidateData = [];
            for (let c = 0; c < candidates.length; c++) {
                let candidate = candidates[c];
                await votes.find({ position: p._id, candidate: candidate._id }, (err, data) => {
                    candidateData.push({
                        name: candidate.name,
                        votes: data.length
                    });
                });
            }
            allData.push({
                name: name,
                candidates: candidateData
            });

            console.log(allData.length);
        }
        newData = [];
        allData.map(position => {
            labels = [];
            data = [];
            position.candidates.map(candidate => {
                labels.push(parseInt(candidate.votes));
                data.push(candidate.name);
            })
            var datasets = {
                datasets: [{
                    data: data,
                    label: position.name
                }],
                labels: labels
            };
            newData.push(datasets);
        });
        return res.render('results', {
            data: newData
        });
    })
    // allData = [
    //     {
    //         name: 'General Secretory',
    //         candidates: [
    //             {
    //                 name: 'puneet verma',
    //                 votes: '10'
    //             },
    //             {
    //                 name: 'Rishav Raj',
    //                 votes: '12'
    //             },
    //             {
    //                 name: 'Tushar Arya',
    //                 votes: '13'
    //             }
    //         ]
    //     },
    //     {
    //         name : 'Sports',
    //         candidates : [
    //             {   
    //                 name : 'puneet',
    //                 votes: '11'
    //             },
    //             {
    //                 name : 'Rishav',
    //                 votes: '11'
    //             },
    //             {
    //                 name : 'Tushar',
    //                 votes: '13'
    //             }
    //         ]
    //     },
    //     {
    //         name : 'President',
    //         candidates : [
    //             {   
    //                 name : 'puneet v',
    //                 votes: '15'
    //             },
    //             {
    //                 name : 'Rishav r',
    //                 votes: '10'
    //             },
    //             {
    //                 name : 'Tushar a',
    //                 votes: '15'
    //             }
    //         ]
    //     },
    //     {
    //         name : 'Vice President',
    //         candidates : [
    //             {   
    //                 name : 'pu 0ve',
    //                 votes: '10'
    //             },
    //             {
    //                 name : 'Ri ra',
    //                 votes: '15'
    //             },
    //             {
    //                 name : 'Tu ar',
    //                 votes: '10'
    //             }
    //         ]
    //     }
    // ]
}