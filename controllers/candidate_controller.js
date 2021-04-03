const Positions = require('../models/position');
const Users = require('../models/user');
module.exports.add = function (req, res) {
    const pos_id = req.body.p_id;
    const can_roll_no = req.body.cand_roll_no;
    Positions.findById(pos_id, (err, data) => {
        
        if (err) { console.log('error in finding position id'); return; }
        Users.findOne({ uid: can_roll_no }, (err, data1) => {
            console.log(data1._id);
            if (err || !data1) { console.log('error in finding user', err); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id); }
            console.log(data.candidate,data.candidate.indexOf(data1._id));
            if(data.candidate.indexOf(data1._id) != -1) {
                console.log('already exists for this position'); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id);
            }
            console.log(data1)
            if(!data1.isVoter){
                console.log('admin cant be voter'); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id);
            }
            data.candidate.push(data1);
            data.save((err) => {
                if (err) { console.log("Error in adding candidate", err); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id); }
                return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id);
            });
        });
    });
}

module.exports.remove = function (req, res) {
    const e_id = req.query.e_id;
    const p_id = req.query.p_id;
    const c_id = req.query.c_id;
    Positions.update({_id : p_id}, {$pull : {candidate:  c_id}}).exec((err, data) => {
        return res.redirect('/admin/get_election_info?election_id=' + e_id);
    });
}