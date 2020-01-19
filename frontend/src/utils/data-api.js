/*
 * Generic data-fetching API as a hook. Influenced heavily by
 * https://www.robinwieruch.de/react-hooks-fetch-data/, but my needs are
 * slightly different. Still, most code cribbed from
 * https://github.com/the-road-to-learn-react/use-data-api/.
 */

import { useState, useEffect, useReducer } from "react"
import axios from "axios"

import apiEndpoint from "./api-endpoint"

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, loading: true, error: false }
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        error: false,
        data: action.payload,
      }
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      throw new Error(`Unknown dispatch state: ${action.type}`)
  }
}

const useDataApi = (initialUrl, initialData) => {
  if (!initialUrl.startsWith("http")) {
    initialUrl = `${apiEndpoint}${initialUrl}`
  }
  const [url, setUrl] = useState(initialUrl)

  const [state, dispatch] = useReducer(dataFetchReducer, {
    loading: true,
    error: false,
    data: initialData,
  })

  useEffect(() => {
    let didCancel = false

    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" })

      try {
        const result = await axios(url)

        if (!didCancel) {
          let data = result.data

          if (data.error) {
            dispatch({ type: "FETCH_FAILURE", payload: data })
          } else {
            dispatch({ type: "FETCH_SUCCESS", payload: data })
          }
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE", payload: error })
        }
      }
    }

    fetchData()

    return () => {
      didCancel = true
    }
  }, [url])

  return [state, setUrl]
}

export default useDataApi
