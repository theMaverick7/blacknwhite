import Joi from "joi";

const schema = Joi.string().guid({ version: ['uuidv4'] }).required();

export default schema;