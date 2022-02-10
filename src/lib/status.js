import axios from 'axios'
import { getAccessToken } from '@auth0/nextjs-auth0'

export default async function getStatus(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res)
    const { data } = await axios.get('http://localhost:6000/status', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return data
  } catch (error) {
    res.writeHead(307, { Location: '/login' }).end()
    return {}
  }
}
