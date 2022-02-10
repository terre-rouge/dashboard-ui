import Layout from '../components/layout'
import { NextPage } from 'next'
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import getStatus from '../lib/status'
import fetcher from '../lib/fetcher'
import useSWR from 'swr'
import { useState } from 'react'

const Home: NextPage = ({ user, status }) => {
  const [shouldDeploy, setShouldDeploy] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  const { data, error } = useSWR(shouldDeploy ? '/api/deploy' : null, fetcher)

  const triggerDeployment = () => {
    setShouldDeploy(true)
    setDisableButton(true)
    setTimeout(() => {
      setDisableButton(false)
      setShouldDeploy(false)
    }, 120000)
  }

  if (error) return <div>failed to load</div>

  return (
    <Layout user={user}>
      <h1>Profile</h1>

      <div>
        <h3>Profile (server rendered)</h3>
        <img src={user.picture} alt="user picture" />
        <p>nickname: {user.nickname}</p>
        <p>name: {user.name}</p>
        <p>status: {status}</p>
        <button onClick={triggerDeployment} disabled={disableButton}>
          Deploy
        </button>
        <div>{data ? 'Deployment triggered !' : shouldDeploy ? <div>loading...</div> : null}</div>
      </div>
    </Layout>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    // access the user session
    const session = getSession(req, res)
    const status = await getStatus(req, res)
    console.log(status)
    return { props: { user: session?.user, status } }
  },
})

export default Home
