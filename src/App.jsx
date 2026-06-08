import { useEffect, useRef } from 'react'
import Canvas from './components/Canvas'
import FloatingButtons from './components/FloatingButtons'
import { Analytics } from './utils/analytics'

export default function App() {
  const sessionStart = useRef(Date.now())

  useEffect(() => {
    Analytics.sessionStart()

    const handleUnload = () => {
      const duration = Math.round((Date.now() - sessionStart.current) / 1000)
      Analytics.sessionEnd(0, duration)
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  return (
    <>
      <Canvas />
      <FloatingButtons />
    </>
  )
}