import express from 'express'
import { UsersController } from '../controllers/users'
import { connect } from '../repository/index'

const router = express.Router()

const routes = db => {
  const repo = connect(db)

  const controller = new UsersController(repo)

  // Create user
  router.post('/', controller.createUser)
  // Login
  router.post('/login', controller.login)
  // Validate token
  router.get('/validate-token', controller.validateInfoToken)

  return router
}

export { routes }
