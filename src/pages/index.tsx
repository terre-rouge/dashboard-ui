import Layout from '../components/layout'
import { GetServerSideProps, NextPage } from 'next'
import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import getStatus from '../lib/status'
import fetcher from '../lib/fetcher'
import useSWR from 'swr'
import { useState } from 'react'
import Image from 'next/image'

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
    <Layout user={user}>
      <h1 className="text-3xl font-bold underline">Profile</h1>

      <div>
        <h3>Profile (server rendered)</h3>
        <Image src={user.picture} alt="user picture" width={50} height={50} />
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
    const session = getSession(req, res)
    const status = await getStatus(req, res)
    return { props: { user: session?.user, status } }
  },
})
