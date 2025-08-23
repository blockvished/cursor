import './App.css'
import Cursor from './components/Cursor'
function App() {

  return (
    <div className='w-full h-full bg-zinc-900 text-white flex flex-col justify-center items-center'>
      <div className='h-screen w-full flex justify-center items-center text-7xl'>
        <h1>First page</h1>
      </div>
          <Cursor />
        <div className='h-screen w-full flex justify-center items-center text-7xl'>
          <h1>Last page</h1>
        </div>
    </div>
  )
}

export default App
