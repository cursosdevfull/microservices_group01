import express from 'express'
import { LogController } from '../controllers/logs'
import { connect } from '../repository/index'

const router = express.Router()

const routes = db => {
  const repo = connect(db)

  const controller = new LogController(repo)

  router.get('/', controller.getLogs)
  router.post('/', controller.insertLog)

  return router
}

export { routes }
