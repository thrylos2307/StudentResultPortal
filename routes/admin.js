const express = require('express');
const router = express.Router();
const election_Controller = require('../controllers/election_controller');
const position_Controller = require('../controllers/position_controller');
const candidate_Controller = require('../controllers/candidate_controller');
const authenticated = require('../config/authenticated');
const election = require('../models/election');
router.use('/verify', require('./verify'));
router.get('/', authenticated.checkAdminLoggedIn, authenticated.stage2, election_Controller.details);
router.post('/create_new_election', authenticated.checkAdminLoggedIn, authenticated.stage2, election_Controller.create);
router.post('/create_new_position', authenticated.checkAdminLoggedIn, authenticated.stage2, position_Controller.create);
router.get('/get_election_info', authenticated.checkAdminLoggedIn, authenticated.stage2, async (req, res) => {
    const eId = req.query.election_id;
    let elections = await election.findById(eId).populate({
       path: 'positions',
       populate: {
           path: 'candidate',
           model: 'User'
       }
    });
    return res.render('enter_election_data', {
        positions : elections.positions,
        id : elections._id
    });
});
router.post('/create_new_candidate', authenticated.checkAdminLoggedIn, authenticated.stage2, candidate_Controller.add);
router.get('/remove_candidate', authenticated.checkAdminLoggedIn, authenticated.stage2, candidate_Controller.remove);
router.get('/remove_position', authenticated.checkAdminLoggedIn, authenticated.stage2, position_Controller.remove);
router.post('/update_election_time', authenticated.checkAdminLoggedIn, authenticated.stage2, election_Controller.updateTime);
module.exports = router;