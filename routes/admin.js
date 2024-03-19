const express = require('express')
const { body } = require('express-validator');
const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

router.get('/campaigns', adminController.getCampaigns);
router.post('/campaign',[
    body('title').isString().isLength({ min: 3 }).trim(),
    body('description').isLength( {min:8 , max:200 }).trim(),
    body('assignedUsers').matches(/^[a-z0-9]{24}$/),
], adminController.createCampaign);
router.get('/campaign/:campaignId', adminController.getCampaign);
router.put('/campaign/:campaignId',[
    body('title').isString().isLength({ min: 3 }).trim(),
    body('description').isLength( {min:8 , max:200 }).trim(),
    body('assignedUsers').matches(/^[a-z0-9]{24}$/),
], adminController.updateCampaign);
router.delete('/campaign/:campaignId', adminController.deleteCampaign);
router.post('/campaign/:campaignId/assignUser/:userId', adminController.assignUserToCampaign);
router.delete('/campaign/:campaignId/removeUser/:userId', adminController.removeUserFromCampaign);

module.exports = router;