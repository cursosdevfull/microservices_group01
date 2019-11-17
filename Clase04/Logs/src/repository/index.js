import yenv from 'yenv'
const env = yenv()

const repository = db => {
  const collection = db.collection(env.DB.COLLECTION)

  const getLogs = async () => {
    const logs = await collection.find({}).toArray()

    return logs
  }

  const insertLog = async message => {
    await collection.insertOne({ message })

    return true
  }

  const disconnect = () => {
    db.close()
  }

  return { getLogs, insertLog, disconnect }
}

const connect = connection => {
  return connection
    ? repository(connection)
    : new Error('Connection is not supplied')
}

export { connect }
