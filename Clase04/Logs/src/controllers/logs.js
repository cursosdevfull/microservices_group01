export class LogController {
  repo

  constructor(repo) {
    this.repo = repo
    this.getLogs = this.getLogs.bind(this)
    this.insertLog = this.insertLog.bind(this)
  }

  healthCheck(req, res) {
    res.status(200).send('It is working')
  }

  async getLogs(req, res) {
    const logs = await this.repo.getLogs()

    res.json(logs)
  }

  async insertLog(req, res) {
    await this.repo.insertLog(req.body.message)

    res.json({ result: 'Log inserted' })
  }
}
