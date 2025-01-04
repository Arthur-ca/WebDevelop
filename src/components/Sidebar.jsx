// src/components/Sidebar.jsx
import React from 'react'

function Sidebar({ userRole, onMenuClick }) {
    // 这里演示几种菜单项，假设 "admin" 才能看到“项目管理”、“数据统计”等
    const menuItems = [
        { key: 'home', label: '首页', visibleFor: ['inspector', 'admin', 'mechanics'] },
        { key: 'quality-inspection', label: '质量检测', visibleFor: ['mechanics', 'inspector'] },
        { key: 'project-input', label: '项目录入', visibleFor: ['admin'] },
        { key: 'quality-report', label: '质量报告生成', visibleFor: ['inspector', 'admin'] },
        { key: 'staff-input', label: '人员录入', visibleFor: ['admin'] },
    ]

    // 根据 userRole 过滤可见菜单
    const visibleMenus = menuItems.filter(item => item.visibleFor.includes(userRole))
    const handleMenuClick = (key) => {
        onMenuClick(key); // 调用父组件传递的函数来更新选中的菜单项
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">公司</div>
            <ul className="sidebar-menu">
                {visibleMenus.map(menu => (
                    <li key={menu.key} onClick={() => handleMenuClick(menu.key)}>
                        {menu.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar