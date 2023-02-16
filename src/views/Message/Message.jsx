import React, { Fragment, useEffect, useState } from 'react'
import style from './Message.module.less'
import { Image, Popup, SwipeAction, List, Loading, PullToRefresh, Badge } from 'antd-mobile'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PubSub from 'pubsub-js'
import api from '../../api'
import myConfig from '../../config/myConfig'
import { useSelector } from 'react-redux'
import { selectUser } from '../../store/user'
import { socket } from '../../socket'
const statusRecord = {
  pulling: '用力拉',
  canRelease: '松开吧',
  refreshing: '玩命加载中...',
  complete: '好啦',
}
const Message = () => {


  const navigate = useNavigate()

  //消息项滑动
  const rightActions = [
    {
      key: 'unsubscribe',
      text: '顶置',
      color: '#1677ff',
    },
    {
      key: 'mute',
      text: '标记已读',
      color: 'warning',
    },
    {
      key: 'delete',
      text: '删除',
      color: 'danger',
    },
  ]
  const { _id } = useSelector(selectUser)

  const location = useLocation()
  const { pathname } = location

  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    if (pathname !== '/message') return
    if (!_id) return
    getMessageList()
  }, [pathname, _id])

  useEffect(() => {
    // if (messageList.length === 0) return
    if (pathname === '/message') {
      socket.on('getMessageOfUser', (message) => {
        let localMessageList = localStorage.getItem(`messageList${_id}`)

        if (localMessageList && JSON.parse(localMessageList).length > 0) {
          localMessageList = JSON.parse(localMessageList)
          const index = localMessageList.findIndex((value) => {
            return value.id === message.id
          })
          if (index !== -1) {
            message.count = localMessageList[index].count + 1
            localMessageList[index] = message
            const myMessageList = [...messageList]
            myMessageList[index] = message
            setMessageList(myMessageList)
          } else {
            message.count = 1
            localMessageList.unshift(message)
            setMessageList([message, ...messageList])
          }
          localStorage.setItem(`messageList${_id}`, JSON.stringify(localMessageList))
        } else {
          message.count = 1
          localStorage.setItem(`messageList${_id}`, JSON.stringify([message]))
          setMessageList([message])
        }
      })
    }

    return () => {
      socket.removeAllListeners('getMessageOfUser')
    }
  }, [messageList, pathname])

  useEffect(() => {
    socket.on("getGroupMessage", (groupId, content, time, groupname, image) => {
      let messageList = localStorage.getItem(`messageList${_id}`)
      let newMessageItem = {
        id: groupId,
        image,
        message: content,
        time,
        username: groupname,
        count: 1
      }
      if (messageList && JSON.parse(messageList).length > 0) {
        messageList = JSON.parse(messageList)
        const index = messageList.findIndex((value) => {
          return value.id === groupId
        })

        if (index !== -1) {
          messageList[index].message = content
          messageList[index].time = time
          messageList[index].count = messageList[index].count + 1
          setMessageList(messageList)

        } else {
          setMessageList([newMessageItem, ...messageList])
          messageList.unshift(newMessageItem)

        }
        localStorage.setItem(`messageList${_id}`, JSON.stringify(messageList))
      } else {
        localStorage.setItem(`messageList${_id}`, JSON.stringify([newMessageItem]))
        setMessageList([newMessageItem])
      }
    })
    return () => {
      socket.removeListener("getGroupMessage")
    }
  }, [_id, pathname])

  const getMessageList = async () => {
    const ret = await api.user.getMessageList()
    if (ret.code === 200) {
      console.log(ret)

      let localMessageList = localStorage.getItem(`messageList${_id}`)
      if (localMessageList && JSON.parse(localMessageList).length > 0) {

        localMessageList = JSON.parse(localMessageList)

        for (const i in ret.myMessageArr) {

          const index = localMessageList.findIndex((value) => {
            return value.id === ret.myMessageArr[i].id
          })
          if (index !== -1) {

            localMessageList[index] = ret.myMessageArr[i]
          } else {
            localMessageList.unshift(ret.myMessageArr[i])
          }
        }
        localStorage.setItem(`messageList${_id}`, JSON.stringify(localMessageList))
      } else {
        localStorage.setItem(`messageList${_id}`, JSON.stringify([...ret.myMessageArr]))
      }
    }
    if (!localStorage.getItem(`messageList${_id}`)) return
    setMessageList(JSON.parse(localStorage.getItem(`messageList${_id}`)))

  }

  const toChatView = (userId, image, username) => {
    if (image.includes('group')) {
      navigate('groupChat', { state: { groupId: userId, groupname: username, image } })
    } else {
      navigate('userChat', { state: { userId } })
    }
    socket.removeAllListeners('getMessageOfUser')
    socket.removeAllListeners('getGroupMessage')
  }


  return (
    <Fragment>
      <PullToRefresh
        onRefresh={async () => {
          console.log(123)
        }}
        renderText={status => {
          return <div>{statusRecord[status]}</div>
        }}
      >
        <div
          // onTouchStart={myTouchStart}
          // onTouchMoveCapture={myTouchMove}
          className={style.message}>

          <div className={style.messageList} >
            {
              messageList.map((message) => {
                return (
                  <SwipeAction
                    key={message.id}
                    rightActions={rightActions}
                  >
                    <List.Item style={{ height: '15vw' }}>
                      <div onClick={() => { toChatView(message.id, message.image, message.username) }
                      } className={style.messageItem}>
                        <Badge content={message.count > 0 ? message.count : ''} style={{ '--top': '20%' }}>
                          <Image
                            src={myConfig + message.image}
                            fit='cover'
                            style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginLeft: '3vw', marginTop: '1vw' }}
                          />
                        </Badge>
                        <div className={style.messageBox}>
                          <div className={style.messageItemId}>
                            <span>{message.username}</span>
                            <span className={style.messageTime}>{message.time}</span>
                          </div>
                          <div className={style.messageItemContent}>{message.message}</div>
                        </div>
                      </div>
                    </List.Item>
                  </SwipeAction>

                )
              })
            }

          </div>


        </div>
      </PullToRefresh>
      <Outlet />
    </Fragment>
  )
}

export default Message
