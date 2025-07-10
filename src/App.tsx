import { useState } from 'react'
import { Link } from 'react-router-dom'
import { WindowShell } from './components/WindowShell'
import { Sidebar } from './components/Sidebar'
import { ContentView } from './components/ContentView'
import { ContextMenu } from './components/ContextMenu'

function App() {
  const [selectedId, setSelectedId] = useState('')
  const [menuState, setMenuState] = useState<{
    visible: boolean;
    x: number;
    y: number;
    targetId: string;
    targetType: 'folder' | 'file';
  }>({ visible: false, x: 0, y: 0, targetId: '', targetType: 'folder' })

  const handleContextMenu = (id: string, type: 'folder' | 'file', event: React.MouseEvent) => {
    setMenuState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      targetId: id,
      targetType: type,
    })
  }

  const hideContextMenu = () => {
    setMenuState({ ...menuState, visible: false })
  }

  const getMenuOptions = () => {
    return menuState.targetType === 'folder'
      ? [
          { label: 'Open', action: () => setSelectedId(menuState.targetId) },
          { label: 'Rename', action: () => alert('Rename functionality coming soon') },
          { label: 'Download', action: () => alert('Folders cannot be downloaded') },
        ]
      : [
          { label: 'Open', action: () => setSelectedId(menuState.targetId) },
          { label: 'Rename', action: () => alert('Rename functionality coming soon') },
          { label: 'Download', action: () => alert('Download functionality coming soon') },
        ]
  }

  return (
    <WindowShell>
      <Sidebar 
        items={[]} 
        selectedId={selectedId} 
        onSelect={setSelectedId}
        onContextMenu={handleContextMenu}
      />
      <ContentView selectedId={selectedId} />
      <div className="absolute bottom-4 right-4">
        <Link
          to="/admin"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Admin
        </Link>
      </div>
      <ContextMenu
        options={getMenuOptions()}
        position={{ x: menuState.x, y: menuState.y }}
        visible={menuState.visible}
        onHide={hideContextMenu}
      />
    </WindowShell>
  )
}

export default App
