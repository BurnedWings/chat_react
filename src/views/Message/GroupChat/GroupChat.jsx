import React, { Fragment, useEffect, useRef, useState } from 'react'
import {
    NavBar,
    Space,
    Divider,
    Image,
    TextArea,
    Button,
    Toast
} from 'antd-mobile'
import style from './GroupChat.module.less'
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
const GroupChat = () => {
    const navigate = useNavigate()
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <SetOutline onClick={() => {
                    // navigate('userChatSetting') 
                }} />
            </Space>
        </div>
    )

    const inputNode = useRef(null)

    const location = useLocation()

    const { pathname } = location

    useEffect(() => {
        inputNode.current.nativeElement.focus()
    }, [])

    const { _id, image } = useSelector(selectUser)

    const [inputValue, setInputValue] = useState('')


    const messageBox = useRef()

    const viewBox = useRef()

    const backToPreView = async () => {
        const ret = await api.group.getGroupChatInfo(groupId)
        if (ret.code === 200) {
            setGroupMessageList(ret.messageList)
        }
        navigate(-1)
    }

    const { state: { groupId, groupname, image: groupImage } } = useLocation()

    const [groupMessageList, setGroupMessageList] = useState([])

    const getGroupInfo = async () => {
        const ret = await api.group.getGroupChatInfo(groupId)
        if (ret.code === 200) {
            setGroupMessageList(ret.messageList)
        }
    }

    useEffect(() => {
        getGroupInfo()
    }, [groupId, pathname])

    useEffect(() => {
        window.scrollTo(0, messageBox.current.scrollHeight)
    }, [groupMessageList])

    const sendGroupMessage = async () => {
        if (inputValue.trim() === '')
            return Toast.show({
                content: '请输入消息'
            })

        socket.emit("sendGroupMessage", groupId, inputValue, groupname, groupImage, _id, image)

        setGroupMessageList([...groupMessageList, {
            _id: nanoid(),
            user: {
                _id,
                image
            },
            content: inputValue
        }])
        const ret = await api.group.sendGroupMessage(groupId, inputValue)

        let messageArr = localStorage.getItem(`messageList${_id}`)
        let messageItem = {
            id: groupId,
            username: groupname,
            image: groupImage,
            message: inputValue.trim(),
            time: dayjs(new Date()).format("YYYY/MM/DD HH:mm"),
            count: 0
        }
        if (ret.code === 200) {
            inputNode.current.focus()
            setInputValue('')
        }
        if (messageArr) {
            messageArr = JSON.parse(messageArr)
            const index = messageArr.findIndex((value) => {
                return value.id === groupId
            })
            if (index != -1) {
                messageArr[index] = messageItem
            } else {
                messageArr.unshift(messageItem)
            }
            localStorage.setItem(`messageList${_id}`, JSON.stringify(messageArr))
        } else {
            localStorage.setItem(`messageList${_id}`, JSON.stringify([messageItem]))
        }

    }

    useEffect(() => {
        socket.on("getGroupMessage", (groupId, content, time, groupname, groupImage, userId, userImage) => {
            setGroupMessageList([...groupMessageList, {
                _id: nanoid(),
                user: {
                    _id: userId,
                    image: userImage
                },
                content: content
            }])
        })
        return () => {
            socket.removeListener("getGroupMessage")
        }
    }, [groupMessageList])

    useEffect(() => {
        if (groupMessageList.length === 0) return
        let localMessage = localStorage.getItem(`messageList${_id}`)
        if (localMessage) {

            localMessage = JSON.parse(localMessage)

            const index = localMessage.findIndex((value) => {
                return value.id === groupId
            })
            if (index !== -1) {
                localMessage[index].message = groupMessageList[groupMessageList.length - 1].content
                localMessage[index].count = 0
            }
            localStorage.setItem(`messageList${_id}`, JSON.stringify(localMessage))
        }
    }, [groupMessageList])

    return (
        <Fragment>
            <div ref={viewBox} className={style.userChat}>
                <div style={{ position: 'fixed', width: '100%', top: '0', backgroundColor: '#F4F4F4' }}>
                    <NavBar right={right} onBack={backToPreView}>
                        {groupname}
                    </NavBar>
                    <Divider style={{ margin: '1.3vw' }} />
                </div>
                <div ref={messageBox} className={style.messageContainer}>
                    <div className={style.timeMessage}>
                        2月3号 10:56
                    </div>
                    {
                        groupMessageList.map((message) => {
                            return (
                                <div key={message._id}>
                                    {
                                        message.user._id !== _id ?
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
                    <Button onClick={sendGroupMessage} style={{ zIndex: '2', position: 'absolute', right: '3vw', bottom: '2.7vw', height: '7.5vw', }} size='mini' color='primary'>
                        发送
                    </Button>
                </div>
            </div>
            <Outlet />
        </Fragment>
    )
}

export default GroupChat
