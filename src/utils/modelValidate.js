import Joi from "joi";

export const contactSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.base": "El nombre debe ser un texto",
            "string.empty": "El nombre no puede estar vacío",
            "string.min": "El nombre debe tener al menos 3 caracteres",
            "any.required": "El nombre es obligatorio"
        }),

    relation: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.base": "El parentesco debe ser un texto",
            "string.empty": "El parentesco no puede estar vacío",
            "string.min": "El parentesco debe tener al menos 3 caracteres",
            "any.required": "El parentesco es obligatorio"
        }),

        
    phone: Joi.string()
    .pattern(/^(?:\+?\d{1,3})?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
    .required()
    .messages({
        "string.pattern.base": "El número de teléfono no es válido",
        "string.empty": "El número de teléfono no puede estar vacío",
        "any.required": "El número de teléfono es obligatorio"
    })
});


export const studySchema = Joi.object({

    grade: Joi.string()
        .min(6)
        .required()
        .messages({
            "string.base": "El estudio debe ser un texto",
            "string.empty": "El estudio no puede estar vacío",
            "any.required": "El estudio es obligatorio"
        }),

    place: Joi.string()
        .min(3)
        .required()
        .messages({
            "string.base": "El centro de estudio debe ser un texto",
            "string.empty": "El centro de estudio no puede estar vacío",
            "string.min": "El centro de estudio debe tener al menos 3 caracteres",
            "any.required": "El centro de estudio es obligatorio"
        }),
        
        age: Joi.number()
        .positive()
        .min(1950)
        .required()
        .messages({
            "number.base": "El año de graduación debe ser un número válido",
            "number.positive": "El año de graduación debe ser un número positivo",
            "number.min": "El año de graduación no puede ser menor a 1950",
            "any.required": "El año de graduación es obligatorio"
        })
});

export const userContactSchema = Joi.object({
    telefono: Joi.string()
    .pattern(/^(?:\+?\d{1,3})?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
    .allow("")
    .messages({
        "string.pattern.base": "El número de teléfono no es válido",
    }),

    celular: Joi.string()
    .pattern(/^(?:\+?\d{1,3})?\s?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
    .required()
    .messages({
        "string.pattern.base": "El número de celular no es válido",
        "any.required": "El número de celular es obligatorio",
    })
});

export const arraysAreEqual = (arr1, arr2) =>
    arr1?.length === arr2?.length &&
    [...arr1 ?? []].sort().every((val, index) => val === [...arr2 ?? []].sort()[index]);
