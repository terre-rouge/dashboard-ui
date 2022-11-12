import fetchWithError from '../lib/fetchWithError'
import { useQuery } from '@tanstack/react-query'

const API_SHOPIFY = '/api/export-shopify-products'
const API_ALGOLIA = '/api/import-algolia-products'
const API_VERCEL = '/api/deploy-vercel-terre-rouge-web'

export default function useDeploy() {
  // Shopify
  const shopifyQuery = useQuery(
    ['shopify'],
    ({ signal }) => fetchWithError(API_SHOPIFY, { signal }),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  )
  // Algolia
  const algoliaQuery = useQuery(
    ['algolia'],
    ({ signal }) =>
      fetchWithError(API_ALGOLIA, {
        signal,
        method: 'POST',
        body: JSON.stringify({ products: shopifyQuery.data }),
      }),
    {
      refetchOnWindowFocus: false,
      enabled: !!shopifyQuery.data,
    }
  )
  // Vercel
  const vercelQuery = useQuery(['vercel'], ({ signal }) => fetchWithError(API_VERCEL, { signal }), {
    refetchOnWindowFocus: false,
    enabled: !!algoliaQuery.data,
  })

  // Trigger deployment
  const triggerDeployment = () => {
    shopifyQuery.refetch()
  }

  return {
    triggerDeployment,
    isLoading: shopifyQuery.isFetching || algoliaQuery.isFetching || vercelQuery.isFetching,
    isError: shopifyQuery.isError || algoliaQuery.isError || vercelQuery.isError,
    shopifyQuery,
    algoliaQuery,
    vercelQuery,
  }
}
