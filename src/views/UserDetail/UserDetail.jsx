import { Image, Toast } from 'antd-mobile'
import React, { useEffect, useRef, useState } from 'react'
import style from './UserDetail.module.less'
import {
  NavBar,
  Button,
  Popup,
  TextArea,
  Radio,
  Space
} from 'antd-mobile'
import { MoreOutline, CloseOutline } from 'antd-mobile-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/user'
import myConfig from '../../config/myConfig'
const UserDetail = () => {
  const navigate = useNavigate()

  const imgContainer = useRef()

  const genderContainer = useRef()

  const [isToAddUser, setAdd] = useState(false)

  const { username } = useSelector(selectUser)

  const right = (
    <div style={{ fontSize: 24 }}>
      <MoreOutline style={{ fontSize: '2rem' }} />
    </div>
  )

  //显示弹出层以及动画
  const showPopup = () => {
    imgContainer.current.style.width = '26.6666vw'
    imgContainer.current.style.height = '26.6666vw'
    imgContainer.current.style.borderRadius = '50%'
    imgContainer.current.style.zIndex = '9999'
    imgContainer.current.style.left = '20%'
    imgContainer.current.style.bottom = '72vh'
    imgContainer.current.style.border = '1.2vw white solid;'
    genderContainer.current.style.display = 'none'
    setAdd(true)
  }

  //关闭弹出层以及动画
  const closePopup = () => {
    setAdd(false)
    imgContainer.current.style.width = '53.3333vw'
    imgContainer.current.style.height = '53.3333vw'
    imgContainer.current.style.borderRadius = '1.33333vw'
    imgContainer.current.style.zIndex = 'auto'
    imgContainer.current.style.left = '50%'
    imgContainer.current.style.bottom = '57vh'
    imgContainer.current.style.border = '1.33333vw white solid;'
    genderContainer.current.style.display = 'block'
  }

  const { state } = useLocation()

  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    if (!state) return
    getOneUser()
  }, [])

  const getOneUser = async () => {
    const ret = await api.user.getOneUser(state.userId)
    if (ret.code === 200) {
      setUserInfo(ret.user)
    }

  }

  const [textareaInfo, setInfo] = useState(`我是${username},请求添加您为好友~`)

  const [groupList, setGroupList] = useState([])

  const getUserGroup = async () => {
    const ret = await api.user.getUserGroup()
    if (ret.code === 200) {
      // console.log(ret)
      setGroupList(ret.groupList)
      setTargetGroup(ret.groupList[0]._id)
    }
  }

  useEffect(() => {
    getUserGroup()
  }, [])

  const addUser = async () => {

    const ret = await api.user.addUser(userInfo._id, textareaInfo, targetGroup)
    if (ret.code === 200) {
      setIsShowRadio(false)
      Toast.show({
        content: '发送成功',
      })
    }
  }

  const [isShowRadio, setIsShowRadio] = useState(false)

  const [targetGroup, setTargetGroup] = useState('')

  return (
    <div className={style.userDetail}>
      <NavBar style={{ position: 'fixed', zIndex: '1', width: '95%', color: 'black' }} right={right} onBack={() => { navigate(-1) }}></NavBar>
      <div className={style.imgContainer}>
        {
          userInfo.image ? <Image src={myConfig + userInfo.image}
            style={{ width: '110%', height: '110%', position: 'absolute', left: '-5vw', top: '-7vw', opacity: '0.77' }}
            fit='cover' /> : null
        }
      </div>
      <div ref={imgContainer} className={style.avatarContainer}>
        {
          userInfo.image ? <Image
            src={myConfig + userInfo.image}
            fit='cover'
            style={{ borderRadius: 8, width: '100%', height: '100%' }}
          /> : null
        }
        <div ref={genderContainer} className={style.genderContainer}>
          <i className={userInfo.gender === 1 ? 'iconfont icon-xingbienan' + ' ' + style.myGenderIcon : userInfo.gender === 2 ? 'iconfont icon-xingbienv' + ' ' + style.myGenderIcon : 'iconfont icon-wenhao' + ' ' + style.myGenderIcon} ></i>
        </div>
      </div>
      <div className={style.nameContainer}>
        <span>{userInfo.username}</span>
      </div>
      <div className={style.textContainer} >
        <span>
          {userInfo.bio ? userInfo.bio : '这个人很神秘，什么都没有留下。'}
        </span>
      </div>
      <div className={style.buttonContainer}>
        <Button onClick={showPopup} style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>加为好友</Button>
      </div>
      <Popup
        visible={isToAddUser}
        onMaskClick={closePopup}
        bodyStyle={{ height: '80vh', borderRadius: '5vw' }}
      >
        <div style={{ marginTop: '18vw', fontSize: '1.3rem', paddingLeft: '8.5vw', color: '#272832' }}>
          <span>{userInfo.username}</span>
        </div>
        <TextArea
          style={{ borderRadius: '3vw', padding: '1vw', boxShadow: '1vw 2vw 4vw 0.5vw rgba(39,40,50,0.1)', backgroundColor: '#F3F4F6', width: '85%', marginTop: '10vw', marginLeft: '51%', transform: 'translateX(-50%)' }}
          value={textareaInfo}
          showCount
          autoSize
          maxLength={50}
          onChange={(val) => { setInfo(val) }}
        />
        <div style={{ position: 'fixed', width: '100%', bottom: '6vw', paddingLeft: '5vw' }}>
          <Button onClick={closePopup} style={{ width: '25%', height: '11vw', padding: '0', display: 'inline-block', '--background-color': 'rgba(39,40,50,0.10)' }} block size='large'>取消</Button>
          <Button onClick={() => { setIsShowRadio(true) }} style={{ width: '61%', height: '11vw', padding: '0', display: 'inline-block', marginLeft: '4vw' }} block color='primary' size='large'>发送</Button>
        </div>
      </Popup>
      <Popup
        visible={isShowRadio}
        onMaskClick={() => {
          setIsShowRadio(false)
        }}

        bodyStyle={{ height: '50vh' }}
      >
        <NavBar backArrow={false} right={<CloseOutline onClick={() => { setIsShowRadio(false) }} style={{ fontSize: '1rem' }} />} >
          选择分组
        </NavBar>
        <Radio.Group onChange={(e) => { setTargetGroup(e) }} defaultValue={targetGroup}>
          <Space style={{ marginTop: '5vw', marginLeft: '50%', transform: 'translateX(-50%)' }} direction='vertical'>
            {
              groupList.map((group) => {
                return (
                  <Radio key={group._id} value={group._id}>{group.content}</Radio>
                )
              })
            }
          </Space>
        </Radio.Group>
        <div className={style.createButton}>
          <Button onClick={addUser} style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>确定</Button>
        </div>
      </Popup>
    </div>
  )
}

export default UserDetail
