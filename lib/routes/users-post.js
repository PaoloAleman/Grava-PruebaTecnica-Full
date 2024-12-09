'use strict';
const router = require('express').Router();
const logger = require('../logger');
const {User, UserInformation} = require('../models');
const Joi = require('joi');

async function validateFields(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().min(3).required().messages({
            'string.base': 'El nombre debe ser una cadena de texto',
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'any.required': 'El nombre es requerido'
        }),
        color: Joi.string().valid('red', 'green', 'blue').required().messages({
            'string.base': 'El color debe ser una cadena de texto',
            'any.only': 'El color debe ser uno de los siguientes: "red", "green", "blue"',
            'any.required': 'El color es requerido'
        }),
        email: Joi.string().email().required().messages({
            'string.base': 'El correo electrónico debe ser una cadena de texto',
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido'
        }),
        lastName: Joi.string().required().messages({
            'string.base': 'El apellido debe ser una cadena de texto',
            'string.required': 'El apellido es requerido'
        }),
        dni: Joi.string().required().messages({
            'string.base': 'El apellido debe ser una cadena de texto',
            'string.required': 'El apellido es requerido'
        })
    });

    const {error} = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            error: error.details.map((err) => err.message)
        });
    }

    const existingUserInformation = await UserInformation.findOne({dni : req.body.dni});

    if (existingUserInformation) {
        return res.status(400).json({message: 'DNI ya está registrado'});
    }

    return next();
}

function createUserInformation(req) {
    const {name, lastName, dni} = req.body;
    return UserInformation.create({
        name,
        lastName,
        dni
    });
}

function saveUser(req, userInformation) {
    const {name, color, email} = req.body;
    return User.create({
        name,
        color,
        email,
        userInformation: userInformation._id
    });
}

router.post('/users', validateFields, (req, res) => {
    createUserInformation(req).then((r) =>
        saveUser(req, r, res).then((user) => {
            return res.status(201).json(user.toJSON());
        }).catch((error) => {
            logger.error(`POST /users - saveUser error: ${error.message}`);
            return res.status(500).json({
                code: 'internal_error',
                message: 'Internal error'
            });
        })
    );
});

module.exports = router;
