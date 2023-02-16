import React, { Fragment, useEffect, useRef, useState } from 'react'
import style from './User.module.less'
import {
  List,
  Tabs,
  Swiper,
  IndexBar,
  PullToRefresh,
  Image,
  Collapse,
  Popup,
  NavBar,
  Empty,
  ActionSheet,
  Ellipsis,
  Button,
  Divider,
  Dialog,
  Radio,
  Space
} from 'antd-mobile'
import {
  CloseOutline
} from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import Search from '../../cpmpoments/Search/Search'
import Pinyin from 'pinyin-match'

const tabItems = [
  { key: 'fruits', title: '好友' },
  { key: 'vegetables', title: '分组' },
  { key: 'animals', title: '群聊' },
]

//下拉
const statusRecord = {
  pulling: '用力拉',
  canRelease: '松开吧',
  refreshing: '玩命加载中...',
  complete: '好啦',
}

//模拟数据
const users = [
  {
    id: '1',
    avatar:
      'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Novalee Spicer',
    description: 'Deserunt dolor ea eaque eos',
  },
  {
    id: '2',
    avatar:
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
    name: 'Sara Koivisto',
    description: 'Animi eius expedita, explicabo',
  },
  {
    id: '3',
    avatar:
      'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Marco Gregg',
    description: 'Ab animi cumque eveniet ex harum nam odio omnis asdasxcxzc',
  },
  {
    id: '4',
    avatar:
      'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
    name: 'Edith Koenig',
    description: 'Commodi earum exercitationem id numquam vitae',
  },
]

const actions = [
  { text: '分组管理', key: 'copy' },
]
import api from '../../api'
import myConfig from '../../config/myConfig'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveIndex, selectFriendList } from '../../store/user'
import { selectGroup } from '../../store/group'
import { getActiveIndex } from '../../store/user'


const User = () => {

  const navigate = useNavigate()

  const swiperRef = useRef(null)

  // const [activeIndex, setActiveIndex] = useState(1)

  const [newUserMessage, setNewUserMessage] = useState(false)

  const [searchView, setSearchView] = useState(false)

  const [newGroupMessage, setNewGroupMessage] = useState(false)

  const [isShowActionView, setShowActionView] = useState(false)

  const dispatch = useDispatch()

  const activeIndex = useSelector(selectActiveIndex)

  const setActiveIndex = (index) => {
    dispatch(getActiveIndex(index))
  }

  let timeOutEvent = 0;//定时器   
  //开始按   
  const gtouchstart = () => {
    timeOutEvent = setTimeout(longPress, 500);//这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适   
    return false;
  };
  //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件   
  const gtouchend = () => {
    clearTimeout(timeOutEvent);//清除定时器   
    // if (timeOutEvent != 0) {
    //   //这里写要执行的内容（尤如onclick事件）   
    //   alert("你这是点击，不是长按");
    // }
    return false;
  };
  //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按   
  const gtouchmove = () => {
    clearTimeout(timeOutEvent);//清除定时器   
    timeOutEvent = 0;

  };

  //真正长按后应该执行的内容   
  const longPress = () => {
    timeOutEvent = 0;
    //执行长按要执行的内容，如弹出菜单   
    // alert("长按事件触发发");
    // console.log('长按事件触发发')
    setShowActionView(true)
  }

  const [userRequestMessage, setMessage] = useState([])

  const showNewUserMessage = async () => {
    setNewUserMessage(true)
    const ret = await api.user.getUserRequest()
    if (ret.code === 200) {
      setMessage(ret.messageList)
    }
  }

  const [groupList, setGroupList] = useState([])

  const getUserGroup = async () => {
    const ret = await api.user.getUserGroup()
    if (ret.code === 200) {
      setGroupList(ret.groupList)
      setTargetGroup(ret.groupList[0]._id)
    }
  }

  useEffect(() => {
    getUserGroup()
  }, [])

  const [targetGroup, setTargetGroup] = useState('')

  const [targetMessage, setTargetMessage] = useState('')

  //通过好友申请
  const agreeUserRequest = async () => {
    const ret = await api.user.agreeUserRequest({ messageId: targetMessage, groupId: targetGroup })
    if (ret.code === 200) {
      setIsShowRadio(false)
      setMessage(ret.messageList)
      getUserGroup()
    }

  }

  const [isShowRadio, setIsShowRadio] = useState(false)

  const toSendMessage = (userId) => {
    navigate('/message/userChat', { state: { userId } })
  }

  // const [friendList, setFriendList] = useState([])

  const friendList = useSelector(selectFriendList)


  const charCodeOfA = 'A'.charCodeAt(0)
  const groups = Array(26)
    .fill('')
    .map((_, i) => ({
      title: String.fromCharCode(charCodeOfA + i),
    }))

  const [newGroups, setNewGroups] = useState([])

  const getGroupingList = () => {
    let arr = []
    for (let i in friendList) {
      const index = groups.findIndex((value) => {
        return Pinyin.match(friendList[i].username[0], value.title)[0] === 0
      })
      if (index != -1) {
        arr.push(index)
      }
    }
    arr = Array.from(new Set(arr))
    const newGroups = []
    arr.forEach((item) => {
      newGroups.push(groups[item])
    })
    setNewGroups(newGroups)
  }
  useEffect(() => {
    if (friendList.length === 0) return
    getGroupingList()
  }, [friendList])

  const { myGroup, groupList: addGroupList } = useSelector(selectGroup)


  return (
    <PullToRefresh
      onRefresh={async () => {
        console.log(123)
      }}
      renderText={status => {
        return <div>{statusRecord[status]}</div>
      }}
    >
      <div className={style.user}>
        <List >
          <List.Item style={{ fontSize: '1rem', fontWeight: '550' }} onClick={showNewUserMessage}>
            新朋友
          </List.Item>
          <List.Item style={{ fontSize: '1rem', fontWeight: '550' }} onClick={() => { setNewGroupMessage(true) }}>
            群通知
          </List.Item>
        </List>
        <div className={style.backgroundBox}></div>
        <div className={style.navContainer}>
          <Tabs
            activeKey={tabItems[activeIndex].key}
            onChange={key => {
              const index = tabItems.findIndex(item => item.key === key)
              setActiveIndex(index)
              swiperRef.current.swipeTo(index)
            }}
            style={{ fontWeight: '550' }}
          >
            {tabItems.map(item => (
              <Tabs.Tab title={item.title} key={item.key} />
            ))}
          </Tabs>
          <Swiper
            direction='horizontal'
            loop={false}
            indicator={() => null}
            ref={swiperRef}
            defaultIndex={activeIndex}
            onIndexChange={index => {
              setActiveIndex(index)
            }}
          >
            {/* 
            好友
            */}
            <Swiper.Item>
              <div className={style.content}>
                <IndexBar>
                  {newGroups.map(group => {
                    const { title } = group
                    return (
                      <IndexBar.Panel
                        index={title}
                        title={`${title}`}
                        key={`标题${title}`}
                      >
                        <List>
                          {
                            friendList.map(friend => {
                              return (
                                Pinyin.match(friend.username[0], title)[0] === 0 ?
                                  <List.Item
                                    key={friend.username}
                                    style={{ color: 'black' }}
                                    prefix={
                                      <Image
                                        src={myConfig + friend.image}
                                        style={{ borderRadius: 20 }}
                                        fit='cover'
                                        width={40}
                                        height={40}
                                      />
                                    }
                                    description={friend.bio ? friend.bio : '这个人很神秘，什么都没有留下。'}
                                  >
                                    {friend.username}
                                  </List.Item> : ''


                              )
                            })
                          }
                        </List>
                      </IndexBar.Panel>
                    )
                  })}
                </IndexBar>
              </div>
            </Swiper.Item>
            {/* 
            分组
            */}
            <Swiper.Item>
              <div className={style.grouping} >
                {
                  groupList[0] ?
                    <Collapse
                      style={{ fontWeight: '550' }}
                      defaultActiveKey={[groupList[0]._id]}
                    >
                      {
                        groupList.map((group) => {
                          return (
                            <Collapse.Panel style={{ touchAction: 'auto' }} key={group._id} title={<div onTouchStart={gtouchstart} onTouchMove={gtouchmove} onTouchEnd={gtouchend} >{group.content}</div>}>
                              {
                                group.userList.map((user) => {
                                  return (
                                    <div key={user._id} onClick={() => { toSendMessage(user._id) }} className={style.messageItem}>
                                      <Image
                                        src={myConfig + user.image}
                                        fit='cover'
                                        style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginTop: '1vw' }}
                                      />
                                      <div className={style.messageBox}>
                                        <div className={style.messageItemId}>
                                          <span>{user.username}</span>
                                        </div>
                                        <div className={style.messageItemContent}>{user.bio ? user.bio : '这个人很神秘，神秘都没有留下。'}</div>
                                      </div>
                                    </div>
                                  )
                                })
                              }

                            </Collapse.Panel>
                          )
                        })
                      }
                    </Collapse> : ''
                }
              </div>
            </Swiper.Item>
            {/* 
            群聊
            */}
            <Swiper.Item>
              <div style={{ color: 'black' }}>
                <Collapse
                  style={{ fontWeight: '550' }}
                  defaultActiveKey={['1']}>
                  <Collapse.Panel key='1' title='我创建的群聊'>
                    {/* 群聊项 */}
                    {
                      myGroup.map((item) => {
                        return (
                          <div key={item._id} onClick={() => { navigate('/message/groupChat', { state: { groupId: item._id, groupname: item.groupname, image: item.image } }) }} className={style.messageItem}>
                            <Image
                              src={myConfig + item.image}
                              fit='cover'
                              style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginTop: '1vw' }}
                            />
                            <div className={style.messageBox}>
                              <div className={style.groupMessageItemId}>
                                <span>{item.groupname}({item.userList.length})</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </Collapse.Panel>
                  <Collapse.Panel key='2' title='我加入的群聊'>
                    {
                      addGroupList.map((item) => {
                        return (
                          <div key={item._id} onClick={() => { navigate('/message/groupChat', { state: { groupId: item._id, groupname: item.groupname, image: item.image } }) }} className={style.messageItem}>
                            <Image
                              src={myConfig + item.image}
                              fit='cover'
                              style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginTop: '1vw' }}
                            />
                            <div className={style.messageBox}>
                              <div className={style.groupMessageItemId}>
                                <span>{item.groupname}({item.userList.length})</span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </Collapse.Panel>
                </Collapse>
              </div>
            </Swiper.Item>
          </Swiper>
        </div>
        <Popup
          visible={newUserMessage}
          onMaskClick={() => {
            setNewUserMessage(false)
          }}
          position='right'
          bodyStyle={{ width: '100vw', touchAction: 'auto' }}
        >
          <NavBar right={(
            <div onClick={() => { setSearchView(true) }} style={{ fontSize: '1.1rem' }}>
              添加
            </div>
          )} onBack={() => { setNewUserMessage(false) }}>
            新朋友
          </NavBar>
          <Divider style={{ margin: '0' }} />
          {
            userRequestMessage.length > 0 ?
              <List header='好友通知'>
                {userRequestMessage.map(message => (
                  <List.Item
                    key={message._id}
                    prefix={
                      <Image
                        src={myConfig + message.user.image}
                        style={{ borderRadius: 20 }}
                        fit='cover'
                        width={40}
                        height={40}
                      />
                    }

                    description={<Ellipsis direction='end' content={message.message} />}
                  >
                    {message.user.username}
                    {
                      message.status === 1 ?
                        <Button onClick={() => {
                          // agreeUserRequest(message._id) 
                          setTargetMessage(message._id)
                          setIsShowRadio(true)
                        }} style={{ float: 'right', height: "7vw", width: "13vw", padding: '0' }} size='mini' color='primary'>
                          同意
                        </Button> :
                        <span style={{ fontSize: '0.85rem', float: "right", marginTop: "1vw", marginRight: '1.1vw' }}>已同意</span>
                    }
                  </List.Item>
                ))}
              </List> : <Empty
                style={{ marginTop: '50%', transform: 'translateY(-50%)' }}
                imageStyle={{
                  width: '50%'
                }}
                description='暂无数据' />
          }
        </Popup>
        <Popup
          visible={newGroupMessage}
          onMaskClick={() => {
            setNewGroupMessage(false)
          }}
          position='right'
          bodyStyle={{ width: '100vw' }}
        >
          <NavBar right={(
            <div onClick={() => { console.log('清空消息') }} style={{ fontSize: '1.1rem' }}>
              清空
            </div>
          )} onBack={() => { setNewGroupMessage(false) }}>
            群通知
          </NavBar>
          <Empty
            style={{ marginTop: '50%', transform: 'translateY(-50%)' }}
            imageStyle={{
              width: '50%'
            }}
            description='暂无数据' />
        </Popup>
        <Popup
          visible={searchView}
          onMaskClick={() => {
            setSearchView(false)
          }}
          position='right'
          bodyStyle={{ width: '100vw' }}
        >
          <Search closeView={() => { setSearchView(false) }} />
        </Popup>
        <Popup
          visible={isShowRadio}
          onMaskClick={() => {
            setIsShowRadio(false)
          }}
          bodyStyle={{ height: '50vh' }}
        >
          <NavBar backArrow={false} right={<CloseOutline style={{ fontSize: '1rem' }} />} onBack={() => { }}>
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
            <Button onClick={agreeUserRequest} style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>确定</Button>
          </div>
        </Popup>
        <ActionSheet
          cancelText='取消'
          visible={isShowActionView}
          actions={actions}
          onClose={() => setShowActionView(false)}
        />
      </div >
    </PullToRefresh>

  )
}

export default User
