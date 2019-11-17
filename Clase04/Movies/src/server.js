import { initializeServer } from './bin/app'
import yenv from 'yenv'
import { catchAsyn, loggin } from './utils'
import { initializeDatabase } from './common'

const env = yenv()
let db

const begin = async () => {
  db = await initializeDatabase()
  loggin('Database Movie on Running')
  console.log('Database on running')

  if (db) {
    await initializeServer(db)
    console.log(`Server on running. Port: ${env.PORT}`)
  }
}

catchAsyn(begin)
