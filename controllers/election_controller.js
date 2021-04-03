const Election = require('../models/election');
const moment = require('moment');
module.exports.details = (req, res) => {
    Election.find({}, (err, elections) => {
        if (err) { console.log('error in finding election details') }
        return res.render('admin_home', {
            elections: elections
        })
    })
}

module.exports.create = function (req, res) {
    const elect_name = req.body.elect_name;
    Election.create({name: elect_name }, async (err, id) => {
        if (err) {
            Election.find({}, (err, elections) => {
                if (err) { console.log('error in loding data'); return; }
                return res.render('admin_home', { elections: elections});
            });
        }
        var positions;
        console.log('election created');
        return res.render('enter_election_data', {
            positions : positions,
            id : id._id
        });
    });
}

module.exports.updateTime = function (req, res) {
    let date = req.body.date;
    let time = req.body.time;
    let eTime = req.body.eTime;
    let e_id = req.body.e_id;
    let sTime = new Date(date + " " + time);
    let enTime = moment(sTime).add(parseInt(eTime.substr(0, 2)), 'h').add(parseInt(eTime.substr(3)), 'm').toDate();
    Election.findByIdAndUpdate(e_id, {scheduleTime : sTime, endTime : enTime}).exec((err, data) => {
        if(err){console.log('Error in updating time of election', err); return;}
        return res.redirect('/admin/get_election_info?election_id=' + e_id);
    })
}
