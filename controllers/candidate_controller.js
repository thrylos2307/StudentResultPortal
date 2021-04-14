const Positions = require('../models/position');
const Users = require('../models/user');
module.exports.add = function (req, res) {
    const pos_id = req.body.p_id;
    const can_roll_no = req.body.cand_roll_no;
    Positions.findById(pos_id, (err, data) => {
        
        if (err) {req.flash('error','Unable to find position!'); console.log('error in finding position id'); res.redirect('/admin/get_election_info?election_id=' + req.body.e_id); }
        Users.findOne({ uid: can_roll_no }, (err, data1) => {
            if (err || !data1) {req.flash('error','Unable to find user'); console.log('error in finding user', err); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id); }
            if(data.candidate.indexOf(data1._id) != -1) {
                req.flash('error','Candidate already exists for this position!');
                console.log('already exists for this position'); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id);
            }
            if(!data1.isVoter){
                req.flash('error','Admin cannot be voter!');
                console.log('admin cant be voter'); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id);
            }
            data.candidate.push(data1);
            data.save((err) => {
                if (err) {req.flash('error','Unable to add candidate!'); console.log("Error in adding candidate", err); return res.redirect('/admin/get_election_info?election_id=' + req.body.e_id); }
                req.flash('success','Candidate added successfully');
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
        if(err){ req.flash('error','Unable to remove position!'); }
        else{req.flash('success','Position removed successfully');}
        return res.redirect('/admin/get_election_info?election_id=' + e_id);
    });
}