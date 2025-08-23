import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // console.log(mousePosition)

  useEffect(() => {
    const mouseMove = (e) => {
      // console.log(e)
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
    }
    window.addEventListener('mousemove', mouseMove)

    return () => {
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [])


  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
    }
  }

  return (
    <div className='App'>
      <h1 className='title'>Hello Victor</h1>
      <motion.div
        className='cursor'
        variants={variants}
        animate="default" />
    </div>
  )
}

export default App
