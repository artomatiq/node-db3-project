const db = require('../../data/db-config')

async function find() { // EXERCISE A
  const schemes = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .count('st.step_id as number_of_steps')
    .orderBy('sc.scheme_id')
    .select('sc.*')

  return schemes
}

async function findById(scheme_id) { // EXERCISE B
  const steps = await db('steps as st')
    .where('scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  const scheme = await db('schemes as sc')
    .where('sc.scheme_id', scheme_id)
    .first()

  const result = {
    scheme_id: scheme.scheme_id,
    scheme_name: scheme.scheme_name,
    steps: steps
  }
return result
}

async function findSteps(scheme_id) { // EXERCISE C

  const steps = await db('steps as st')
    .where('scheme_id', scheme_id)
    .select('step_number', 'step_id', 'instructions')
    .orderBy('step_number', 'asc')
  const schemeName = await db('schemes as sc')
    .where('scheme_id', scheme_id)
    .select('scheme_name')
    .first()

  for (step of steps) {
    step.scheme_name = schemeName.scheme_name
  }

  return steps
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) { // EXERCISE D
  await db('schemes as sc')
    .insert(scheme)

  const newScheme = await db('schemes as sc')
    .where('sc.scheme_name', scheme.scheme_name)
    .first()

  return newScheme
}

async function addStep(scheme_id, step) { // EXERCISE E
  step.scheme_id = scheme_id
  await db('steps as st')
    .insert(step)

  return findSteps(scheme_id)
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
