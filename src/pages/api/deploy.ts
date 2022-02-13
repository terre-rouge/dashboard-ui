import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0'

export default withApiAuthRequired(async function deploy(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res)

    const response = await fetch('http://localhost:6000/deploy', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const status = await response.json()
    res.status(response.status || 200).json(status)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      })
    } else {
      res.status(500).json({
        error: String(error),
      })
    }
  }
})
