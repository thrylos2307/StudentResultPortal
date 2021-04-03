const Election = require('../models/election');
const Position = require('../models/position');

module.exports.create = function (req, res) {
    try {
        Position.create({ name: req.body.position_name }, (err, position) => {
            if (err) { console.log('error in creating position', err); return; }
            console.log('position created');
            Election.findById(req.body.elect_id, (err, election) => {
                if (err) { console.log('error in finding election ID', err); return; }
                console.log('election found');
                election.positions.push(position);
                election.save((err) => {
                    if (err) { console.log(err); return; }
                    return res.redirect('/admin/get_election_info?election_id=' + req.body.elect_id);
                });
            });
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports.remove = function (req, res) {
    const e_id = req.query.e_id;
    const p_id = req.query.p_id;
    Election.update({_id : e_id}, {$pull : {positions:  p_id}}).exec((err, data) => {
        if(err){console.log('Unable to remove position from election', err); return;}
        Position.findByIdAndDelete(p_id, (err, done) => {
            if(err){console.log('Unable to delete position', err); return;}
            return res.redirect('/admin/get_election_info?election_id=' + e_id);
        });
    });
}