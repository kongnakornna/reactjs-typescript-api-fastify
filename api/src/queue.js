const Queue = require('bull')
const axios = require('axios').default
const basicQueue = new Queue('basic')
basicQueue.process((job, done) => {
  setTimeout(() => {
    console.log(job.id)
    done(null, {
      callbackUrl: job.data.callbackUrl
    })
  }, 10000)
})
basicQueue.on('completed', (job, result) => {
  const { callbackUrl } = result
  axios.post(callbackUrl, {
    jobId: job.id,
    status: 'completed'
  })
})
module.exports = basicQueue