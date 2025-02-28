'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (  
    <div className="content max-w-4xl mx-auto px-2 card bg-black bg-opacity-30 my-11">
        <div className="card-body">
          <h1>Something went wrong!</h1>
          <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
        </div>
      </div>
  )
}