import React, { useEffect, useRef, useState } from 'react'
import style from './Register.module.less'
import {
  Button,
  Form,
  Toast,
} from 'antd-mobile'
import {
  CloseOutline,
  EyeInvisibleOutline,
  EyeOutline
} from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
const Login = () => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  //注册

  const username = useRef(null)
  const email = useRef(null)
  const password = useRef(null)

  const register = async () => {
    if (username.current.value.trim() === '') {
      username.current.focus()
      return Toast.show({
        content: '昵称不能为空',
        duration: 1000,
      })
    } else if (email.current.value.trim() === '') {
      email.current.focus()
      return Toast.show({
        content: '邮箱不能为空',
        duration: 1000,
      })
    } else if (password.current.value.trim() === '') {
      password.current.focus()
      return Toast.show({
        content: '密码不能为空',
        duration: 1000,
      })
    }
    const user = {
      username: username.current.value.trim(),
      email: email.current.value.trim(),
      password: password.current.value.trim()
    }
    const ret = await api.user.register(user)

    if (ret.code === 200) {
      navigate('/login', { state: { email: ret.user.email } })
    } else if (ret.code === 201) {
      Toast.show({
        content: ret.message,
        duration: 1000,
      })
      email.current.focus()
    }

  }
  return (
    <div className={style.login}>
      <div className={style.loginHeader}>
        <CloseOutline style={{ fontSize: '1.5rem', marginTop: '3vw', marginLeft: '4vw', float: 'left' }} />
        <span onClick={() => { navigate('/login') }} className={style.toRegister}>登录</span>
      </div>
      <div className={style.loginImgContent}>
        <img className={style.loginLogo} src="/images/yk.png" alt="" />
      </div>
      <div className={style.loginBody}>
        <div className={style.loginTitle}>
          注册
        </div>

        <div className={style.searchInput}>
          <input ref={username} placeholder='请输入您的昵称' type="text" />
          <div className={style.inputLine}></div>
        </div>

        <div className={style.searchInput}>
          <input ref={email} placeholder='请输入您的邮箱' type="text" />
          <div className={style.inputLine}></div>
        </div>
        <div className={style.searchInput}>
          <input ref={password} placeholder='请输入您的密码' type={visible ? 'text' : 'password'} />
          <div className={style.eye}>
            {!visible ? (
              <EyeInvisibleOutline onClick={() => setVisible(true)} />
            ) : (
              <EyeOutline onClick={() => setVisible(false)} />
            )}
          </div>
          <div className={style.inputLine}></div>
        </div>
        <Button onClick={register} block color='primary' size='large' style={{ height: '11vw', padding: '0', marginTop: '7vw', borderRadius: '11vw' }}>
          注册
        </Button>
      </div>
    </div>
  )
}

export default Login
