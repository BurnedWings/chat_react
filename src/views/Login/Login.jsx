import React, { useEffect, useRef, useState } from 'react'
import style from './Login.module.less'
import {
  Button,
  Toast
} from 'antd-mobile'
import {
  CloseOutline,
  EyeInvisibleOutline,
  EyeOutline
} from 'antd-mobile-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api'
import { useDispatch } from 'react-redux'
import {changeUserInfo} from '../../store/user/index'
const Login = () => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { state } = useLocation()

  const [emailValue, setEmail] = useState('')
  const [passwordValue, setPassword] = useState('')

  const email = useRef(null)

  const password = useRef(null)

  useEffect(() => {
    if (state) {
      setEmail(state.email)
      password.current.focus()
      return
    }
    email.current.focus()
  }, [state])

  const login = async () => {

    if (email.current.value.trim() === '') {
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
    const ret = await api.user.login({
      email: emailValue,
      password: passwordValue
    })

    if (ret.code === 200) {
      localStorage.setItem(`chat_token`,ret.chat_token)
      localStorage.setItem(`chat_userInfo`,JSON.stringify(ret.user))
      navigate('/message')
      dispatch(changeUserInfo(ret.user))
    } else {
      Toast.show({
        content: ret.message,
        duration: 1000
      })
    }

  }

  return (
    <div className={style.login}>
      <div className={style.loginHeader}>
        <CloseOutline style={{ fontSize: '1.5rem', marginTop: '3vw', marginLeft: '4vw', float: 'left' }} />
        <span onClick={() => { navigate('/register') }} className={style.toRegister}>注册</span>
      </div>
      <div className={style.loginImgContent}>
        <img className={style.loginLogo} src="/images/yk.png" alt="" />
      </div>
      <div className={style.loginBody}>
        <div className={style.loginTitle}>
          登录
        </div>
        <div className={style.welcome}>
          您好，欢迎来到伊卡！
        </div>
        <div className={style.searchInput}>
          <input ref={email} value={emailValue} 
          // onBlur={() => {
          //   if (!emailValue.match(/^\w+@\w+\.\w+$/i)) {
          //     Toast.show({
          //       content: '邮箱格式错误',
          //       duration: 1000,
          //     })
          //     email.current.focus()
          //   }
          // }} 
          onChange={(e) => { setEmail(e.target.value) }} placeholder='请输入您的邮箱' type="email" />
          <div className={style.inputLine}></div>
        </div>
        <div className={style.searchInput}>
          <input ref={password} value={passwordValue} onChange={(e) => { setPassword(e.target.value) }} placeholder='请输入您的密码' type={visible ? 'text' : 'password'} />
          <div className={style.eye}>
            {!visible ? (
              <EyeInvisibleOutline onClick={() => setVisible(true)} />
            ) : (
              <EyeOutline onClick={() => setVisible(false)} />
            )}
          </div>
          <div className={style.inputLine}></div>
        </div>
        <Button onClick={login} block color='primary' size='large' style={{ height: '11vw', padding: '0', marginTop: '7vw', borderRadius: '11vw' }}>
          登录
        </Button>
      </div>
    </div>
  )
}

export default Login
