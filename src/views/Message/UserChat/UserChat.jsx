import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
    NavBar,
    Space,
    Divider,
    Image,
    TextArea,
    Button
} from 'antd-mobile'
import style from './UserChat.module.less'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    SetOutline,
    PictureOutline
} from 'antd-mobile-icons'
import api from '../../../api'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../store/user'
import { socket } from '../../../socket'
import myConfig from '../../../config/myConfig'
import { nanoid } from 'nanoid'
const UserChat = () => {
    const navigate = useNavigate()


    const inputNode = useRef(null)

    const location = useLocation()

    const { pathname } = location

    useEffect(() => {
        inputNode.current.nativeElement.focus()
    }, [])

    const { state: { userId } } = useLocation()

    const [toUserInfo, setToUserInfo] = useState({})

    // const getOneUser = async () => {
    //     const ret = await api.user.getOneUser(userId)
    //     if (ret.code === 200) {
    //         setToUserInfo(ret.user)
    //     }
    // }

    const { _id } = useSelector(selectUser)

    const userInfo = useSelector(selectUser)

    useEffect(() => {
        // getOneUser()
        if (!userId) return
        if (pathname !== '/message/userChat') return
        getMessageList()
    }, [userId, pathname])

    const [inputValue, setInputValue] = useState('')

    const sendMessageToUser = async () => {
        if (inputValue.trim() === '') return

        socket.emit('sendMessage', _id, toUserInfo._id, inputValue)

        setMessageList([...messageList, {
            _id: nanoid(),
            user: userInfo,
            toUser: toUserInfo,
            content: inputValue
        }])

        const ret = await api.user.sendMessageToUser(toUserInfo._id, inputValue)

        let messageArr = localStorage.getItem(`messageList${_id}`)
        let messageItem = {
            id: toUserInfo._id,
            username: toUserInfo.username,
            image: toUserInfo.image,
            message: inputValue.trim(),
            time: dayjs(new Date()).format("YYYY/MM/DD HH:mm"),
            count: 0
        }
        if (ret.code === 200) {
            setInputValue('')
            inputNode.current.nativeElement.focus()
        }
        if (messageArr) {
            messageArr = JSON.parse(messageArr)
            for (const i in messageArr) {
                if (messageArr[i].id === toUserInfo._id) {
                    messageArr[i] = messageItem
                    return localStorage.setItem(`messageList${_id}`, JSON.stringify(messageArr))
                }
            }
        }
        localStorage.setItem(`messageList${_id}`, messageArr ? JSON.stringify([messageItem, ...messageArr]) : JSON.stringify([messageItem]))


    }

    const [messageList, setMessageList] = useState([])

    const getMessageList = async () => {
        const ret = await api.user.getMessageListOfOneUser(userId)
        if (ret.code === 200) {
            setToUserInfo(ret.toUser)
            setMessageList(ret.messageArr)

        }

    }

    useEffect(() => {
        socket.on('getOneUserMessage', (content) => {
            setMessageList([...messageList, {
                _id: nanoid(),
                user: toUserInfo,
                toUser: userInfo,
                content: content
            }])

        })
        window.scrollTo(0, messageBox.current.scrollHeight)

        return () => {
            socket.removeListener('getOneUserMessage')
        }
    }, [messageList])

    const messageBox = useRef()

    const viewBox = useRef()

    const backToPreView = () => {
        getMessageList()
        navigate(-1)
    }

    useEffect(() => {
        if (messageList.length === 0) return
        let localMessage = localStorage.getItem(`messageList${_id}`)
        if (localMessage) {

            localMessage = JSON.parse(localMessage)

            const index = localMessage.findIndex((value) => {
                return value.id === toUserInfo._id
            })
            if (index !== -1) {
                localMessage[index].message = messageList[messageList.length - 1].content
                localMessage[index].count = 0
            }
            localStorage.setItem(`messageList${_id}`, JSON.stringify(localMessage))
        }
    }, [messageList])

    return (
        <Fragment>
            <div ref={viewBox} className={style.userChat}>
                <div style={{ position: 'fixed', width: '100%', top: '0', backgroundColor: '#F4F4F4' }}>
                    <NavBar right={<div style={{ fontSize: 24 }}>
                        <Space style={{ '--gap': '16px' }}>
                            <SetOutline onClick={() => { navigate('userChatSetting',{state:{userId}}) }} />
                        </Space>
                    </div>} onBack={backToPreView}>
                        {toUserInfo.username}
                    </NavBar>
                    <Divider style={{ margin: '1.3vw' }} />
                </div>
                <div ref={messageBox} className={style.messageContainer}>
                    <div className={style.timeMessage}>
                        2月3号 10:56
                    </div>
                    {
                        messageList.map((message) => {
                            return (
                                <div key={message._id}>
                                    {
                                        message.user._id === toUserInfo._id ?
                                            <div className={style.leftMessage}>
                                                <Image
                                                    // onClick={() => { navigate('/userDetail') }}
                                                    src={myConfig + message.user.image}
                                                    fit='cover'
                                                    style={{ float: 'left', width: '10vw', height: '10vw', borderRadius: '50%' }}
                                                />
                                                <div className={style.contentContainer} >
                                                    <span>{message.content}</span>
                                                    {/* <img src="/images/06c794d1bbdd850f.jpg" alt="" /> */}
                                                </div>
                                            </div> :
                                            <div className={style.rightMessage}>
                                                <Image
                                                    // onClick={() => { navigate('/userDetail') }}
                                                    src={myConfig + message.user.image}
                                                    fit='cover'
                                                    style={{ float: 'right', width: '10vw', height: '10vw', borderRadius: '50%' }}
                                                />
                                                <div className={style.contentContainer} >
                                                    <span>{message.content}</span>
                                                    {/* <img src="/images/06c794d1bbdd850f.jpg" alt="" /> */}
                                                </div>
                                            </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div
                    // ref={divNode}
                    style={{ width: '100%', minHeight: '12vw', position: 'fixed', bottom: '0', backgroundColor: 'rgb(235, 235, 235)', paddingBottom: '2vw' }}>
                    <PictureOutline style={{ zIndex: '2', position: 'absolute', left: '3vw', bottom: '3vw', fontSize: '7vw', }} />
                    <div style={{ paddingTop: "3vw", width: '100%', backgroundColor: 'rgb(235, 235, 235)', position: 'fixed', bottom: '3vw', zIndex: '1' }}>
                        <TextArea
                            ref={inputNode}
                            // onChange={changeHeight}
                            onChange={(e) => { setInputValue(e) }}
                            value={inputValue}
                            rows={1}
                            style={{
                                paddingLeft: "3vw",
                                marginLeft: '47%',
                                transform: 'translateX(-50%)',
                                // position: 'fixed', bottom: '3vw', left: '13vw', 
                                backgroundColor: 'white', width: '62vw', borderRadius: "3vw"
                            }}
                            autoSize={{ minRows: 1, maxRows: 5 }}
                        />
                    </div>
                    <Button onClick={sendMessageToUser} style={{ zIndex: '2', position: 'absolute', right: '3vw', bottom: '2.7vw', height: '7.5vw', }} size='mini' color='primary'>
                        发送
                    </Button>
                </div>
            </div>
            <Outlet />
        </Fragment>
    )
}

export default UserChat
