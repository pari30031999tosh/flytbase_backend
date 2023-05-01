const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Users = require('../models/users');



async function login(req, res, next){
    let email = req.body.email;
    let password = req.body.password;
    
    try{
        let payload = {email: email, password: password}
        let token  = jwt.sign(payload, process.env.JWT_SECRET);
        
        res.cookie('token ',token);
        
        var result = await Users.findOne({email: email});
        if(result){
            let valid = bcrypt.compare(password, result.password);
            if(valid){
                return res.status(200).json({
                    status: 200,
                    message: 'successfully login',
                    result: result
                })
            }else{
                return res.status(201).json({
                    status: 201,
                    message: 'Invalid password'
                })
            }
            
        }else{
            return res.status(203).json({
                status: 203,
                message: 'invalid email'
            })
        }

    }catch(err){
        return res.status(300).json({
            status: 300,
            error: err
        })
    }
}

async function signup(req, res, next){
    
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    try{
       let salt = await bcrypt.genSalt(10);
       password = await bcrypt.hash(password, salt);

       let data = {
            _id: new mongoose.Types.ObjectId(),
            name:name,
            email:email,
            password:password
       }

       const users = new Users(data)
       var result = await users.save();

       return res.status(200).json({
        status: 200,
        message: 'successfully created records',
        result: result
       })

    }catch(err){
        let message = ''
        if(err.code == 11000){
            message = 'email already exists for some other use'
        }
        return res.status(300).json({
            status: 300,
            message: message,
            error: err
        })
    }
}

module.exports = {login, signup}