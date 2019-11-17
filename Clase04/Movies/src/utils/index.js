const yenv = require('yenv')
const env = yenv()
const request = require('request')

const catchAsyn = (ftn, level = true, params = []) => {
  return ftn(...params).catch(error => {
    console.log(error)
    process.exit(level ? 1 : 0)
  })
}

const loggin = message => {
  console.log(`http://${env.LOG.HOST}:${env.LOG.PORT}`)
  request(`http://${env.LOG.HOST}:${env.LOG.PORT}`).form({
    message: JSON.stringify(message),
  })
}

export { catchAsyn, loggin }
