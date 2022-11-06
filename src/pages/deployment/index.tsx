import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import useSWR from 'swr'
import { useState } from 'react'
import fetcher from '../../lib/fetcher'
import Layout from '../../components/layout'
import { User } from '../../types/User'
import getStatus from '../../lib/status'

type DeploymentProps = {
  user: Claims | undefined | null
  status: string
}

export default function Deployment({ user, status }: DeploymentProps) {
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

  if (error || !user) return <div>failed to load</div>

  return (
    <Layout title="Deployment" user={user as User} status={status}>
      <h1 className="text-3xl font-bold underline">Profile</h1>

      <div>
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
    const session = getSession(req, res)
    const status = await getStatus(req, res)
    return { props: { user: session?.user, status } }
  },
})
