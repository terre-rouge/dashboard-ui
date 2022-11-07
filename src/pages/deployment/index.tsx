import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import useSWR from 'swr'
import { useState } from 'react'
import fetcher from '../../lib/fetcher'
import Layout from '../../components/layout'
import { User } from '../../types/User'
import getStatus from '../../lib/status'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

const timeline = [
  {
    id: 1,
    content: 'Exporting products from',
    target: 'Shopify',
    href: '#',
    time: '31s',
    icon: CheckIcon,
    iconBackground: 'bg-green-500',
  },
  {
    id: 2,
    content: 'Importing products on',
    target: 'Algolia',
    href: '#',
    time: '12s',
    icon: ArrowPathIcon,
    spinning: true,
    iconBackground: 'bg-blue-500',
  },
  {
    id: 3,
    content: 'Deploying Terre Rouge on',
    target: 'Vercel',
    href: '#',
    time: '',
    icon: ClockIcon,
    iconBackground: 'bg-gray-400',
  },
]

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
      <div className="rounded-lg bg-white shadow p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {timeline.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== timeline.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={clsx(
                          event.iconBackground,
                          event.spinning ? 'animate-spin' : '',
                          'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                        )}
                      >
                        <event.icon className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          {event.content}{' '}
                          <a href={event.href} className="font-medium text-gray-900">
                            {event.target}
                          </a>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-12">
          <button
            onClick={triggerDeployment}
            disabled={disableButton}
            type="button"
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {shouldDeploy ? 'loading...' : 'Deploy'}
          </button>
          {data && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Deployment successfully triggered !
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
