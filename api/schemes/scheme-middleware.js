const db = require('../../data/db-config')

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const schemeId = await db('schemes')
    .where('scheme_id', req.params.scheme_id)
    .first()
  if (schemeId) {
    next()
  }
  else {
    next({status: 404, message: `scheme with scheme_id ${req.params.scheme_id} not found`})
  }
}

const validateScheme = (req, res, next) => {
  if (typeof req.body.scheme_name !== 'string' || req.body.scheme_name.trim()===undefined ||  !req.body.scheme_name.trim()) {
    next({
      status:400,
      message: 'invalid scheme_name'
    })
  }
  else {
    next()
  }
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  if (typeof req.body.instructions !== 'string' || !req.body.instructions.trim() ||  isNaN(req.body.step_number) || req.body.step_number<1) {
    next({
      status: 400,
      message: 'invalid step'
    })
  }
  else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
