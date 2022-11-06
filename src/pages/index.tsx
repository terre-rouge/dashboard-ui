import Layout from '../components/layout'
import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import getStatus from '../lib/status'
import fetcher from '../lib/fetcher'
import useSWR from 'swr'
import { useState } from 'react'
import { User } from '../types/User'

type HomeProps = {
  user: Claims | undefined | null
  status: string
}

export default function Home({ user, status }: HomeProps) {
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
    <Layout title="Dashboard" user={user as User} status={status}>
      TODO
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
