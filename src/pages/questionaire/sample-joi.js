const schema = Joi.object({
  ADMISSION_COURESE_ID: Joi.string().required().max(3),
  ID_CARD: Joi.string().required().min(17).max(17),
  COURSES_TYPE: Joi.string().optional().allow(null),
  PREFIX_NAME: Joi.string().required().max(50),
  NAME: Joi.string().required().max(255),
  LAST_NAME: Joi.string().required().max(255),
  BIRTH_DAY: Joi.date().required(),
  EDUCATION_BACKGROUND: Joi.string().required(),
  RECEIVE_CERTIFICATE: Joi.string().when("COURSES_TYPE", {
    is: "Y",
    then: Joi.string().required(),
    otherwise: Joi.string().optional().allow(null),
  }),
  ADDRESS: Joi.string().required().max(255),
  DISTRICT_ID: Joi.string().required().max(5),
  AMPHUR_ID: Joi.string().required().max(5),
  PROVINCE_ID: Joi.string().required().max(5),
  POST_CODE: Joi.string().required().max(6),
  PHONE: Joi.string().optional().allow(""),
  EMAIL: Joi.string().email({ tlds: { allow: false } }),
});