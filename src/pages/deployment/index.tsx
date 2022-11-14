import { Claims, getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import Layout from '../../components/layout'
import { User } from '../../types/User'
import getStatus from '../../lib/status'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import useDeploy from '../../hooks/useDeploy'

type DeploymentProps = {
  user: Claims | undefined | null
  status: string
}

export default function Deployment({ user, status }: DeploymentProps) {
  const { triggerDeployment, isLoading, isError, shopifyQuery, algoliaQuery, vercelQuery } =
    useDeploy()

  return (
    <Layout title="Deployment" user={user as User} status={status}>
      <div className="rounded-lg bg-white shadow p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            <li>
              <div className="relative pb-8">
                {/* Don't display at the last */}
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        shopifyQuery.isFetching
                          ? 'bg-blue-500 animate-spin'
                          : shopifyQuery.isSuccess
                          ? 'bg-green-500'
                          : shopifyQuery.isError
                          ? 'bg-red-400'
                          : 'bg-gray-400',
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                      )}
                    >
                      {shopifyQuery.isFetching ? (
                        <ArrowPathIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : shopifyQuery.isSuccess ? (
                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : shopifyQuery.isError ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Exporting products from&nbsp;
                        <a href="#" className="font-medium text-gray-900">
                          Shopify
                        </a>
                      </p>
                    </div>
                    {/* <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <span>12.s</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                {/* Don't display at the last */}
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        algoliaQuery.isFetching
                          ? 'bg-blue-500 animate-spin'
                          : algoliaQuery.isSuccess
                          ? 'bg-green-500'
                          : algoliaQuery.isError
                          ? 'bg-red-400'
                          : 'bg-gray-400',
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                      )}
                    >
                      {algoliaQuery.isFetching ? (
                        <ArrowPathIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : algoliaQuery.isSuccess ? (
                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : algoliaQuery.isError ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Importing products on&nbsp;
                        <a href="#" className="font-medium text-gray-900">
                          Algolia
                        </a>
                      </p>
                    </div>
                    {/* <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <span>12.s</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={clsx(
                        vercelQuery.isFetching
                          ? 'bg-blue-500 animate-spin'
                          : vercelQuery.isSuccess
                          ? 'bg-green-500'
                          : vercelQuery.isError
                          ? 'bg-red-400'
                          : 'bg-gray-400',
                        'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white'
                      )}
                    >
                      {vercelQuery.isFetching ? (
                        <ArrowPathIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : vercelQuery.isSuccess ? (
                        <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : vercelQuery.isError ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      )}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        Deploying Terre Rouge on&nbsp;
                        <a href="#" className="font-medium text-gray-900">
                          Vercel
                        </a>
                      </p>
                    </div>
                    {/* <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <span>12.s</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="pt-12">
          <button
            onClick={() => triggerDeployment()}
            disabled={isLoading}
            type="button"
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {isLoading ? 'loading...' : 'Deploy'}
          </button>
          {vercelQuery.isSuccess ? (
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
          ) : isError ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">Deployment failed !</p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                    >
                      <span className="sr-only">Dismiss</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
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
