import yenv from 'yenv'
import bcrypt from 'bcrypt'
import { createToken } from '../utils/token'

const env = yenv()

const repository = db => {
  const collection = db.collection(env.DB.COLLECTION)

  const getUsers = async () => {
    const users = await collection.find()

    return users
  }
  const createUser = async (name, email, password) => {
    const newPassword = await bcrypt.hash(password, 10)

    const user = new collection({ name, email, newPassword })
    await user.save()

    return true
  }
  const updateUser = async (_id, name) => {
    await collection.findOneAndUpdate({ _id }, { name })

    return true
  }
  const getUser = async id => {
    const user = collection.findOne({ _id: id })

    return user
  }
  const deleteUser = async id => {
    await collection.findOneAndRemove({ _id: id })

    return true
  }
  const login = async (email, password) => {
    const user = collection.findOne({ email })

    if (user) {
      const match = await bcrypt.compare(password, user.password)

      if (match) {
        const token = createToken(user._id, user.name)
        return { token }
      }

      return false
    } else {
      return false
    }
  }
  const validateToken = async token => {
    const payload = await validateToken(token)

    return payload
  }
  const generateApiKey = async () => {
    return true
  }
  const validateApiKey = async apiKey => {
    return true
  }

  const disconnect = () => {
    db.close()
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login,
    validateApiKey,
    validateToken,
    generateApiKey,
    disconnect,
  }
}

const connect = connection => {
  return connection
    ? repository(connection)
    : new Error('Connection is not supplied')
}

export { connect }
