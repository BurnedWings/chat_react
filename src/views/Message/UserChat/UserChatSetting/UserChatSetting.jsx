import React from 'react'
import { NavBar, Divider } from 'antd-mobile'
import style from './UserChatSetting.module.less'
import { useLocation, useNavigate } from 'react-router-dom'
const UserChatSetting = () => {
  const navigate = useNavigate()

  const {state:{userId}} = useLocation()
  return (
    <div className={style.setting}>
      <NavBar onBack={() => { navigate(-1) }}>聊天设置</NavBar>
      <Divider style={{ margin: '0' }} />
    </div>
  )
}

export default UserChatSetting
