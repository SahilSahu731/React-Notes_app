import './App.css'
import CreateNote from './components/CreateNote'
import Header from './components/Header'
import NoteList from './components/NoteList'

function App() {

  return (
    <div>
      <Header />
      <CreateNote />
      <NoteList />
    </div>
  )
}

export default App
