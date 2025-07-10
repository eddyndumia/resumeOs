import { useState } from 'react'
import { WindowShell } from './components/WindowShell'
import { Sidebar } from './components/Sidebar'
import { ContentView } from './components/ContentView'

function App() {
  const [selectedId, setSelectedId] = useState('')

  return (
    <WindowShell>
      <Sidebar 
        items={[]} 
        selectedId={selectedId} 
        onSelect={setSelectedId} 
      />
      <ContentView selectedId={selectedId} />
    </WindowShell>
  )
}

export default App
