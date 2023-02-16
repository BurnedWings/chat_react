import React, { Suspense, useEffect, useRef, useState } from 'react'
import {
  TabBar,
  Popup,
  Image,
  Mask,
  List,
  Button,
  NavBar,
  Divider,
  Ellipsis
} from 'antd-mobile'
import {
  MessageOutline,
  MessageFill,
  FlagOutline,
  UserOutline,
  CloseOutline,
  EditFill,
  EditSOutline
} from 'antd-mobile-icons'
import Api from './api'
import { Outlet, useLocation, useNavigate, useRoutes } from 'react-router-dom'
import routes from './router'
import './app.css'
import Header from './cpmpoments/Header/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getLocalInfo, selectUser, getFriendList } from './store/user/index'
import dayjs from 'dayjs'
import api from './api'
import style from './app.module.less'
import "cropperjs/dist/cropper.css";
import Cropper from 'cropperjs';
import myUrl from './config/myConfig'
import { socket } from './socket'
import { getGroup } from './store/group/index'
const App = () => {



  const navigate = useNavigate()
  const element = useRoutes(routes)
  const location = useLocation()
  const { pathname } = location

  const { username, image, bio, gender, birthday, phone, _id, createdAt, email } = useSelector(selectUser)

  const dispatch = useDispatch()

  useEffect(() => {
    getUser()
  }, [])


  const [isShow, setIsShow] = useState(false)

  // if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
  //   // 当前设备是移动设备
  //   console.log(123);
  // }
  //抽屉相关
  let startX
  let startY

  const myTouchStart = (e) => {
    startX = e.touches[0].pageX;

    startY = e.touches[0].pageY;
  }
  // const myTouchMove = (e) => {
  //   let moveEndX = e.changedTouches[0].pageX;

  //   let moveEndY = e.changedTouches[0].pageY;

  //   let X = moveEndX - startX;

  //   let Y = moveEndY - startY;

  //   if (Math.abs(X) > Math.abs(Y) && X > 80) {
  //     setIsShow(true)
  //   }
  // }
  const myBackTouch = (e) => {
    let moveEndX = e.changedTouches[0].pageX;

    let moveEndY = e.changedTouches[0].pageY;

    let X = moveEndX - startX;

    let Y = moveEndY - startY;

    if (Math.abs(X) > Math.abs(Y) && X < -80) {
      setIsShow(false)
    }
  }

  const tabs = [
    {
      key: 'message',
      title: '消息',
      icon: (active) =>
        active ? <MessageFill /> : <MessageOutline />,
      badge: '99+',
    },
    {
      key: 'user',
      title: '联系人',
      icon: <UserOutline />,
    },
    {
      key: 'trend',
      title: '动态',
      icon: <FlagOutline />,
      badge: '5',
    },
  ]

  useEffect(() => {
    const token = PubSub.subscribe('showSetting', () => {
      setIsShow(true)
    })
    return () => {
      PubSub.unsubscribe(token);
    }
  }, [isShow])



  const getUser = async () => {
    if (!localStorage.getItem('chat_userInfo')) return
    const ret = await api.user.getUser()
    localStorage.setItem('chat_userInfo', JSON.stringify(ret.user))
    dispatch(getLocalInfo())
  }

  const [isShowUserInfo, setIsShowUserInfo] = useState(false)

  const [isShowEditImg, setIsShowEditImg] = useState(false)

  const editImage = () => {
    document.querySelector('.update-input').click()
  }

  const imageContainer = useRef(null)

  const imgBackGround = useRef(null)

  const [imgUrl, setImgUrl] = useState('')

  const [theImgDataToSend, setTheImgDataToSend] = useState({})

  //初始化cropper
  const initCropper = (image) => {
    const cropper = new Cropper(image, {
      background: true,
      aspectRatio: 1,
      viewMode: 1,
      zoomable: false,
      ready: () => {
        cropper
          .getCroppedCanvas({
            maxWidth: 500,
            maxHeight: 500,
            minWidth: 200,
            minHeight: 200,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "medium"
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("files", blob, "example.png");

            // this.theImgDataToSend = { formData };
            setTheImgDataToSend({ formData })
          });
      },
      cropend: () => {
        cropper
          .getCroppedCanvas({
            maxWidth: 1000,
            maxHeight: 1000,
            minWidth: 100,
            minHeight: 100,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "medium"
          })
          .toBlob(blob => {
            const formData = new FormData();
            formData.append("files", blob, "example.png");
            setTheImgDataToSend({ formData })
          });
      }
    });
  }

  const initImg = () => {
    initCropper(imageContainer.current)
    imgBackGround.current.style.opacity = '0'
    setTimeout(() => {
      imgBackGround.current.style.display = 'none'
    }, 300)

  }

  //文件上传成功的回调
  const loadingImg = (event) => {
    let reader = new FileReader()
    if (event.target.files[0]) {
      const imgName = event.target.files[0].name
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (e) => {
        let dataURL = reader.result
        // this.$bus.$emit("showEdit", dataURL, imgName);
        setImgUrl(dataURL)
        setIsShowEditImg(true)
      }
    }
  }

  const updateTheAvatar = async () => {
    const ret = await api.user.updateAvatar(theImgDataToSend.formData)
    if (ret.code === 200) {
      getUser()
      setIsShowEditImg(false)
    }
  }

  const [isShowEditView, setIsShowEditView] = useState(false)

  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    if (!_id) return
    socket.emit('login', _id)
  }, [_id])

  const toGetFriendList = async () => {
    const ret = await api.user.getFriendList()
    if (ret.code === 200) {
      dispatch(getFriendList(ret.friendArr))
    }
  }

  const getGroupWhichJoin = async () => {
    const ret = await api.group.getGroupWhichJoin()
    if (ret.code === 200) {
      dispatch(getGroup({
        myGroup: ret.myGroup,
        groupList: ret.groupList
      }))
      const allGroupList = [...ret.myGroup, ...ret.groupList]
      allGroupList.forEach(item => {
        socket.emit("group", item._id)
      })
    }
  }

  useEffect(() => {
    if(!_id) return
    toGetFriendList()
    getGroupWhichJoin()
  }, [_id])


  return (
    <div >

      {pathname === '/message' || pathname === '/user' ? <Header></Header> : ''}
      <Suspense>
        {element}
      </Suspense>
      {pathname === '/message' || pathname === '/user' ?
        <TabBar safeArea={true} activeKey={pathname.slice(1)} onChange={(value) => { navigate(value) }} style={{ position: 'fixed', bottom: 0, width: '100%', background: 'rgba(250,250,250,0.90)', boxShadow: 'inset 0px 0.5px 0px 0px rgba(0,0,0,0.1)' }}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar> : ''}
      <Popup
        visible={isShow}
        position='left'
        mask={false}
        onMaskClick={() => {
          setIsShow(false)
        }}
        style={{ zIndex: '99999999999' }}
        bodyStyle={{ height: '100%', width: '100%', position: 'fixed' }}
      >
        <div onTouchStart={myTouchStart} onTouchMove={myBackTouch} style={{ width: '100%', height: '100%' }}>
          <div style={{ position: 'relative' }}>
            <Image style={{ height: '40vw' }} src='/images/R-C.jpg' fit='cover' />
            {
              image ? <Image src={myUrl + image} style={{ zIndex: '1', border: 'solid white 0.1vw', position: 'absolute', bottom: '3vw', left: '2vw', width: '16vw', height: '16vw', borderRadius: '50%' }} fit='cover' /> : null
            }
            <div style={{ position: 'absolute', bottom: '10vw', color: "white", left: '20vw', zIndex: '1', fontSize: '1rem' }}>{username}</div>
            <div style={{ position: 'absolute', bottom: '4vw', color: "white", left: '20vw', zIndex: '1', fontSize: '0.8rem' }}>{bio ? bio : '这个人很神秘，什么都没有留下。'}</div>
            <EditFill onClick={() => { setIsShow(false); setIsShowUserInfo(true) }} style={{ padding: '1vw', position: 'absolute', bottom: '4vw', color: "white", left: '92vw', zIndex: '1', fontSize: '1.2rem' }} />
            <Mask style={{ zIndex: '0', height: '40vw' }} visible={true} />
            <CloseOutline onClick={() => { setIsShow(false) }} style={{ zIndex: '1', position: 'absolute', color: 'white', right: '3vw', top: '3vw', fontSize: '1rem' }} />
          </div>
          <List style={{ paddingLeft: "5vw", paddingRight: '5vw', paddingTop: '5vw', '--border-top': '0', '--border-bottom': '0', '--border-inner': '0' }} >
            <List.Item prefix={<span>昵称</span>} >
              {username}
            </List.Item>
            <List.Item prefix={<span>签名</span>} >
              {bio ? bio : '这个人很神秘，什么都没有留下。'}
            </List.Item>
            <List.Item prefix={<span>性别</span>} >
              {gender === 1 ? '男' : gender === 2 ? '女' : '保密'}
            </List.Item>
            <List.Item prefix={<span>生日</span>} >
              {birthday ? birthday : '保密'}
            </List.Item>
            <List.Item prefix={<span>邮箱</span>} >
              {email}
            </List.Item>
            <List.Item prefix={<span>手机</span>} >
              {phone ? phone : '保密'}
            </List.Item>
            <List.Item prefix={<span>ID号</span>} >
              {_id}
            </List.Item>
            <List.Item prefix={<span>注册</span>} >
              {dayjs(createdAt).format("YYYY/MM/DD HH:mm")}
            </List.Item>
          </List>
          <div style={{ position: 'fixed', width: '100%', bottom: "10vw" }}>
            <Button style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>退出登录</Button>
          </div>
        </div>
      </Popup>
      {/* 编辑信息 */}
      <Popup
        visible={isShowUserInfo}
        onMaskClick={() => {
          setIsShowUserInfo(false)
        }}
        position='right'
        bodyStyle={{ width: '100vw' }}
      >
        <NavBar onBack={() => { setIsShowUserInfo(false); setIsShow(true) }}>编辑个人信息</NavBar>
        <Divider style={{ margin: '0' }} />
        <img
          className={style.groupAvatar}
          onClick={editImage}
          src={myUrl + image} alt="" />
        <EditSOutline
          onClick={editImage}
          style={{ color: 'white', fontSize: '1.5rem', position: 'relative', top: '-12vw', left: '-31vw' }} />
        <input
          style={{ display: 'none' }}
          className='update-input'
          type="file"
          accept="image/*"
          id="imgReader"
          encType="multipart/form-data"
          onChange={loadingImg}
        />
        <List style={{ paddingLeft: "5vw", paddingRight: '5vw', paddingTop: '10vw', '--border-top': '0', '--border-bottom': '0', '--border-inner': '0' }} >
          <List.Item prefix={<span>昵称</span>} onClick={() => { setEditTitle('修改昵称'); setIsShowEditView(true) }} >
            {username}
          </List.Item>
          <List.Item prefix={<span>签名</span>} onClick={() => { setEditTitle('修改签名'); setIsShowEditView(true) }} >
            {bio ? bio : <Ellipsis direction='end' content={'这个人很神秘，什么都没有留下。'} />}
          </List.Item>
          <List.Item prefix={<span>性别</span>} onClick={() => { setEditTitle('修改性别'); setIsShowEditView(true) }} >
            {gender === 1 ? '男' : gender === 2 ? '女' : '保密'}
          </List.Item>
          <List.Item prefix={<span>生日</span>} onClick={() => { setEditTitle('修改生日'); setIsShowEditView(true) }} >
            {birthday ? birthday : '保密'}
          </List.Item>
          <List.Item prefix={<span>邮箱</span>} onClick={() => { setEditTitle('修改邮箱'); setIsShowEditView(true) }} >
            {email}
          </List.Item>
          <List.Item prefix={<span>手机</span>} onClick={() => { setEditTitle('修改手机号'); setIsShowEditView(true) }} >
            {phone ? phone : '保密'}
          </List.Item>
          <List.Item prefix={<span>ID号</span>}  >
            {_id}
          </List.Item>
          <List.Item prefix={<span>注册</span>}  >
            {dayjs(createdAt).format("YYYY/MM/DD HH:mm")}
          </List.Item>
        </List>
      </Popup>
      {/* 编辑头像 */}
      <Popup
        visible={isShowEditImg}
        onMaskClick={() => {
          setIsShowEditImg(false)
        }}
        destroyOnClose
        afterShow={initImg}
        afterClose={() => { setImgUrl('') }}
        position='right'
        bodyStyle={{ width: '100vw' }}
      >
        <NavBar onBack={() => { setIsShowEditImg(false) }}>编辑头像</NavBar>
        <Divider style={{ margin: '0' }} />
        <div className={style.container}>
          <img ref={imageContainer} src={imgUrl} className={style.imgContainer} alt="" />
          <div ref={imgBackGround} style={{ top: '12vw', position: 'absolute', width: "100%", height: "100%", backgroundColor: 'white', zIndex: '2', opacity: '1', transition: 'all 0.3s' }}></div>
        </div>
        <div style={{ bottom: '3vw', position: 'fixed', width: '100%' }}>
          <Button onClick={updateTheAvatar} style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>修改</Button>
        </div>
      </Popup>
      <Popup
        visible={isShowEditView}
        onMaskClick={() => {
          setIsShowEditView(false)
        }}
        position='right'
        bodyStyle={{ width: '100vw' }}
      >
        <NavBar onBack={() => { setIsShowEditView(false) }}>{editTitle}</NavBar>
        <Divider style={{ margin: '0' }} />
      </Popup>

      <Outlet />
    </div>
  )
}

export default App
