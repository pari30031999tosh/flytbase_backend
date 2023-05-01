const express = require('express');
const router = express.Router();

const droneController = require('../controllers/droneController')

router.post('/addcampus', droneController.addCampus);
router.post('/updatecampus', droneController.updateCampus);
router.post('/deletecampus', droneController.deleteCampus);
router.post('/adddrones', droneController.addDrones)
router.post('/updatedrones', droneController.updateDrones);
router.post('/deletedrones', droneController.deleteDrones);
router.post('/addmission', droneController.addMission);
router.post('/updatemission', droneController.updateMission);
router.post('/deletemission', droneController.deleteMission);
router.post('/getallmissionsbycampusid', droneController.getAllMissionsByCampusId)
router.post('/getalldronesbycampusid', droneController.getAllDronesByCampusId);
router.post('/shiftdrone', droneController.shiftDrone);
router.post('/addcategory', droneController.addCategory);
router.post('/deletecategory', droneController.deleteCategory);
router.post('/updatecategory', droneController.updateCategory);
router.post('/getmissionbycategoryid', droneController.getMissionByCategoryId);
router.post('/getdronesbycategoryid', droneController.getDronesBycategoryId);

module.exports = router;