import { GraphiQL } from 'graphiql'
import 'graphiql/graphiql.css'
import React, { useEffect, useState } from 'react'
import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from '../../components/layout'
import { User } from '../../types/User'
import getStatus from '../../lib/status'

type GraphiqlProps = {
  user: Claims | undefined | null
  status: string
}

const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''
const SHOPIFY_GRAPHQL_API_URL = process.env.NEXT_PUBLIC_SHOPIFY_GRAPHQL_API_URL || ''

export default function Graphiql({ user, status }: GraphiqlProps) {
  const [isClientRendering, setIsClientRendering] = useState(false)
  useEffect(() => setIsClientRendering(true), [])

  if (!isClientRendering) return null

  const fetcher = async (graphQLParams: any) => {
    const data = await fetch(SHOPIFY_GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify(graphQLParams),
      credentials: 'same-origin',
    })
    return data.json().catch(() => data.text())
  }

  return (
    <Layout title="Shopify graphiql" user={user as User} status={status} fluid>
      <GraphiQL fetcher={fetcher} />
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
