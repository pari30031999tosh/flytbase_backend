const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Campus = require('../models/campus');
const Category = require('../models/category');
const Missions = require('../models/missions');
const Users = require('../models/users');
const Drones = require('../models/drones');


async function addCampus(req, res, next){
    
    let campus_name = req.body.campus_name;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    
    try{
        //fetch  user id from the jwt token
        let token = req.headers.cookie?.split('=')[1];
        let payload = jwt.verify(token, process.env.JWT_SECRET);
        let userdata = await Users.findOne({email: payload.email});
        let campuslist = userdata.campus;
       
        let campusdata = {
            _id: new mongoose.Types.ObjectId(),
            site_name: campus_name,
            created_by: userdata._id,
            position : {
                latitude: latitude,
                longitude: longitude
            }
        }

        const campus = new Campus(campusdata)
        var result = await campus.save();
        campuslist.push(result._id);
        
        var response = await Users.findOneAndUpdate({email: payload.email},{campus: campuslist}, {upsert: true, returnOriginal: false })

        return res.status(200).json({
            status: 200,
            message: 'successfully created campus',
            result: response
        })
        

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function updateCampus(req, res, next){
    
    let site_name = req.body.site_name;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    
    try{
        let updateData = {
            site_name: site_name,
            position: {
                latitude: latitude,
                longitude: longitude
            }
        }
        var result = await Campus.updateOne(updateData)

        return res.status(200).json({
            status: 200,
            message: 'successfully updated campus',
            result: result
        })
        
    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function deleteCampus(req, res, next){
    
    let site_id = req.body.site_id;
    let token = req.headers.cookie?.split('=')[1];
    let payload = jwt.verify(token, process.env.JWT_SECRET);

    try{
        var result = await Campus.findOneAndRemove({_id: site_id})
        var userData = await Users.findOne({email: payload.email})
        let campusData = userData.campus;
        let newcampus = campusData.filter(item => item != site_id)

        var updatedUser = await Users.updateOne({email:payload.email}, {campus: newcampus})

        return res.status(200).json({
            status: 200,
            message: 'successfully deleted campus',
            result: updatedUser
        })
        
    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function addDrones(req, res, next){
    let token = req.headers.cookie?.split('=')[1];
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    let campus_id = req.body.campus_id;
    let dronename = req.body.drone_name;
    let dronetype = req.body.drone_type;
    
    
    try{
        let userdata = await Users.findOne({email: payload.email});
        let created_by = userdata._id;
        let make_name = userdata.name;
       
        let droneData = {
            _id: new mongoose.Types.ObjectId(),
            name: dronename,
            drone_type:dronetype,
            make_name:make_name,
            created_by: created_by,
            campus_id: campus_id
        }

        const drones = new Drones(droneData)
        var result = await drones.save();
        
        //now add the drone id in campus 
        let campusData = await Campus.findOne({_id: campus_id});
        let newdrones = campusData?.drones;
        newdrones.push(result._id);
        let campusUpdate = await Campus.findOneAndUpdate({_id: campus_id},{drones: newdrones}, {upsert: true, returnOriginal: false });
        return res.status(200).json({
            status: 200,
            message: 'successfully added drone',
            droneData: result
        })


    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function updateDrones(req, res, next){
    let drone_id = req.body.drone_id;
    let updateData = {

    }
    req.body.name? updateData.name = req.body.name: false;
    req.body.drone_type? updateData.drone_type = req.body.drone_type: false;
    
    try{
        let droneUpdate = await Drones.findOneAndUpdate({_id: drone_id} , updateData, {upsert: true, returnOriginal: false });

        return res.status(200).json({
            status: 200,
            message: 'successfully updated drone',
            drone: droneUpdate
        })
    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function deleteDrones(req, res, next){
    
    let drone_id = req.body.drone_id;
    
    try{
        let deletedDrone = await Drones.findOneAndRemove({_id: drone_id})
        
        //delete entry from campus 
        let campus_id = deletedDrone.campus_id;
        let campusData =  await Campus.findOne({_id: campus_id});
        let newDrones = campusData?.drones.filter(item => item != drone_id);
        await Campus.findOneAndUpdate({_id: campus_id}, {drones: newDrones})
        return res.status(200).json({
            status: 200,
            message: 'successfully deleted drone'
        })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function addMission(req, res, next){
    
    let alt = req.body.alt;
    let speed = req.body.speed;
    let name = req.body.name;
    let waypoints =  req.body.waypoints;
    let category_id = req.body.category_id;
    let drone_id = req.body.drone_id;
    let campus_id = req.body.campus_id;

    try{
        let data = {
            _id: new mongoose.Types.ObjectId(),
            alt: alt,
            speed: speed,
            name: name,
            waypoints: waypoints,
            category_id: category_id,
            droneId: drone_id,
            campus_id: campus_id
        }
        
        const mission = new Missions(data)
        var result = await mission.save();
        
        let campusData = await Campus.findOne({_id: campus_id})
        let newmission = campusData.missions;
        newmission.push(result._id);
        let updateCampus = await Campus.findOneAndUpdate({_id: campus_id}, {missions: newmission},{upsert: true, returnOriginal: false } )

        //addign to category also
        let categoryData = await Category.findOne({_id: category_id})
        let newmission1 = categoryData.missions;
        newmission1.push(result._id);
        let updateCategory = await Category.findOneAndUpdate({_id: category_id}, {missions: newmission1},{upsert: true, returnOriginal: false } )
        
        return  res.status(200).json({
            status: 200,
            message: 'successfully created missions',
            mission: result
        })

    }catch(err){
        return  res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function updateMission(req, res, next){
    
    let mission_id = req.body.mission_id;
    let updateData =  {};
    req.body.name? updateData.name = req.body.name: false;
    req.body.alt? updateData.alt = req.body.alt: false;
    req.body.speed? updateData.speed = req.body.speed: false;

    try{
        let updatedMission = await Missions.findOneAndUpdate({_id: mission_id}, updateData, {upsert: true, returnOriginal: false })
        return res.status(200).json({
            status: 200,
            message: 'successfully updated the mission',
            updatedmission: updatedMission
        })

    }catch(err){
        return  res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function deleteMission(req, res, next){
    
    let mission_id = req.body.mission_id;
    try{
        let updatedResult = await Missions.findOneAndRemove({_id: mission_id});
        let campusData = await Campus.findOne({_id: updatedResult.campus_id});
        let newmission = campusData.missions.filter(item => item != mission_id )
        let updatedcampus = await Campus.findOneAndUpdate({_id: updatedResult.campus_id}, {missions: newmission}, {upsert: true, returnOriginal: false })
        return res.status(200).json({
            status: 200,
            message: 'successfully deleted the missions'
        })
    }catch(err){
        return  res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function getAllMissionsByCampusId(req, res, next){
    let campus_id = req.body.campus_id;
    try{
        let campusData = await Campus.findOne({_id: campus_id});
        
        let missions = campusData.missions;
        let result = [];
        for (let index = 0; index < missions.length; index++) {
            let data = await Missions.findOne({_id: missions[index]});    
            result.push(data)
        }

        return res.status(200).json({
            status: 200,
            message: 'successfully fetched missions',
            missions: result
        })

    }catch(err){
       return res.status(300).json({
        status: 300,
        error: err
       }) 
    }
}

async function getAllDronesByCampusId(req, res, next){
    
    let campus_id = req.body.campus_id;
    
    try{
        let campusData = await Campus.findOne({_id: campus_id});
        let drones = campusData.drones;
        let result = [];
        for (let index = 0; index < drones.length; index++) {
            let data = await Drones.findOne({_id: drones[index]});    
            result.push(data)
        }

        return res.status(200).json({
            status: 200,
            message: 'successfully fetched drones',
            drones: result
        })


    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function shiftDrone(req, res, next){
    let drone_id = req.body.drone_id;
    let newcampusid = req.body.campus_id;

    try{
        let droneData = await Drones.findOneAndUpdate({_id: drone_id}, {campus_id: newcampusid}, {upsert: true, returnOriginal: false });
        let oldcampusId = droneData.campus_id;
        let oldCampus = await Campus.findOne({_id: oldcampusId});
        let newdrone = oldCampus.drones.filter(item => {
            
            return item != drone_id
        });
        
        let oldcampusupdate = await Campus.findOneAndUpdate({_id: oldcampusId}, {drones:newdrone}, {
            new: true
          });

        let newCampus = await Campus.findOne({_id: newcampusid});
        let newArray = newCampus.drones;
        
        newArray.push(drone_id);
        let newcampusupdate = await Campus.findOneAndUpdate({_id: newcampusid}, {drones: newArray}, {new: true})
        return  res.status(200).json({
            status: 200,
            message: 'successfully shifted drone'
        })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function addCategory(req, res, next){
    let name = req.body.name;
    let color = req.body.color;
    let tag_name = req.body.tag_name;
    let user_id = req.body.user_id;
    
    try{
        let data = {
            _id: new mongoose.Types.ObjectId(),
            name: name,
            color: color,
            tag_name: tag_name,
            user_id: user_id
        }

        const category = new Category(data)
        var result = await category.save();
        
        let userData = await Users.findOne({_id: user_id});
        let categories = userData.categories;
        categories.push(result._id);
        await Users.findOneAndUpdate({_id: user_id}, {categories: categories}, {returnNewDocument: true})

        return res.status(200).json({
            status: 200,
            message: 'successfully added  category'
        })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function deleteCategory(req, res, next){
    
    let category_id = req.body.category_id;

    try{
       let deletedData = await Category.findOneAndRemove({_id: category_id})
       let user_id = deletedData.user_id;
       let userData = await Users.findOne({_id: user_id});
       let newCategory = userData.categories.filter(item => item != category_id)
       await Users.findOneAndUpdate({_id: user_id}, {categories: newCategory}, {returnNewDocument: true})

       return res.status(200).json({
        status: 200,
        message: 'successfully deleted category'
       })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function updateCategory(req, res, next){
    
    let category_id = req.body.category_id;
    let updateData = {};
    req.body.color? updateData.color = req.body.color: false;
    req.body.name? updateData.name = req.body.name: false;
    req.body.tag_name? updateData.tag_name = req.body.tag_name: false;
    try{
        let categoryData = await Category.findOneAndUpdate({_id: category_id}, updateData , {returnNewDocument: true});
      
        return res.status(200).json({
            status: 200,
            message: 'successfully updated data'
        })
    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function getMissionByCategoryId(req, res, next){
    let category_id = req.body.category_id;
    
    try{
        let categoryData = await Category.findOne({_id: category_id});
        let missions = categoryData.missions;
        let result = [];
        for (let index = 0; index < missions.length; index++) {
            let data = await Missions.findOne({_id: missions[index]});
            
            result.push(data);    
        }

        return res.status(200).json({
            status: 200,
            message: 'successfully fetched all missions',
            result: result
        })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function getDronesBycategoryId(req, res, next){
    
    let category_id = req.body.category_id

    try{
        let categoryData = await Category.findOne({_id: category_id});
        let missions = categoryData.missions;
        let result = [];
        for (let index = 0; index < missions.length; index++) {
            let missionData = await Missions.findOne({_id: missions[index]});
            console.log("missionData=============", missionData)
            let droneData = await Drones.findOne({_id: missionData.droneId});
            result.push(droneData);
        }

        return res.status(200).json({
            status: 200,
            message: 'successfully fetched drones',
            result: result
        })

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

module.exports = { addCampus, updateCampus, deleteCampus, addDrones, updateDrones, deleteDrones, addMission, updateMission, deleteMission, getAllMissionsByCampusId, getAllDronesByCampusId, shiftDrone, addCategory, deleteCategory, updateCategory, getMissionByCategoryId, getDronesBycategoryId}