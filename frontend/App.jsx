import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ProjectTable from './components/ProjectTable'
import './styles/layout.css'
import { ProjectProvider } from './components/ProjectContext'

function App() {

  // 假设我们有个状态来存储当前用户角色，默认为 "user"
  const roles = ['admin', 'inspector', 'mechanics']
  const [userRole, setUserRole] = useState('admin')
  const [selectedMenu, setSelectedMenu] = useState('home') // 新增状态来存储选中的菜单项


  const handleSwitchRole = () => {
    setUserRole((prevRole) => {
      const currentIndex = roles.indexOf(prevRole)
      // 计算下一个角色的索引，注意要用取余实现循环
      const nextIndex = (currentIndex + 1) % roles.length
      return roles[nextIndex]
    });
    setSelectedMenu('home')
  }

  return (
    <ProjectProvider>
      <div className="app-layout">
        <Sidebar userRole={userRole} onMenuClick={setSelectedMenu} />
        <div className="main-content">
          <button onClick={handleSwitchRole}>
            切换角色（当前：{userRole}）
          </button>
          <ProjectTable selectedMenu={selectedMenu} />
        </div>
      </div>
    </ProjectProvider>
  )
}


export default App
