import React, { useEffect, useRef, useState } from 'react'
import style from './Search.module.less'
import { SearchBar, Divider, Image, Button, Empty } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import _ from 'lodash'
import myConfig from '../../config/myConfig'
import { useSelector } from 'react-redux'
import { selectFriendList, selectUser } from '../../store/user'
const Search = () => {
  const navigate = useNavigate()

  const searchInput = useRef()

  const [userList, setUserList] = useState(null)

  const [groupList, setGroupList] = useState(null)

  useEffect(() => {
    searchInput.current.focus()
  }, [])

  const searchUser = async () => {
    const ret = await api.user.searchUser(searchInput.current.nativeElement.value)
    if (ret.code === 200) {
      setUserList(ret.users)
      console.log(ret)
    }

  }

  const inputChange = _.debounce(
    () => {
      if (!searchInput.current) return
      searchUser()
    },
    1500
  )

  const { _id } = useSelector(selectUser)

  const friendList = useSelector(selectFriendList)

  return (
    <div className={style.search}>
      <SearchBar ref={searchInput} onChange={inputChange} style={{ width: '93%', marginLeft: '5.5vw' }} onCancel={() => { navigate(-1) }} placeholder='请输入内容' showCancelButton={() => true} />
      <Divider style={{ margin: '2.2vw 0' }} />
      <div className={style.contentView}>
        {
          userList || groupList ? null : <Empty
            style={{ marginTop: '50%', transform: 'translateY(-50%)' }}
            imageStyle={{
              width: '50%'
            }}
            description='暂无数据' />
        }
        {
          userList ? (<div className={style.userList}>
            <div className={style.userListTitle}>用户</div>
            <div className={style.userListContainer}>
              {
                userList.map((item, index) => {
                  return <div key={item._id} className={style.userListItem}>
                    <Image
                      src={myConfig + item.image}
                      fit='cover'
                      style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginTop: '1vw' }}
                    />
                    <div className={style.userBox}>
                      <div className={style.userItemId}>
                        <span className={style.currentId}>{item.username}</span>
                        {
                          _id != item._id ?

                            friendList.find(i => i._id === item._id) ?
                              <Button disabled  style={{ width: '14.5vw', height: '6.5vw', float: 'right', marginTop: '0.3vw', fontSize: '12px', padding: '0' }} block shape='rounded' color='primary'>
                                已添加
                              </Button> :
                              <Button onClick={() => { navigate('/userDetail', { state: { userId: item._id } }) }} style={{ width: '14.5vw', height: '6.5vw', float: 'right', marginTop: '0.3vw', fontSize: '12px', padding: '0' }} block shape='rounded' color='primary'>
                                加好友
                              </Button>
                            : null
                        }
                      </div>
                    </div>
                  </div>
                })
              }
            </div>
          </div>) : null
        }
        {
          groupList ? (<div className={style.group}>
            <div className={style.groupListTitle}>群组</div>
            <div className={style.userListContainer}>
              <div className={style.userListItem}>
                <Image
                  src='/images/06c794d1bbdd850f.jpg'
                  fit='cover'
                  style={{ width: '13vw', height: '13vw', borderRadius: '50%', float: 'left', marginTop: '1vw' }}
                />
                <div className={style.userBox}>
                  <div className={style.userItemId}>
                    <span className={style.currentId}>歪比歪比</span>
                    <Button style={{ width: '14.5vw', height: '6.5vw', float: 'right', marginTop: '0.3vw', fontSize: '12px', padding: '0' }} block shape='rounded' color='primary'>
                      发消息
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>) : null
        }
      </div>
    </div>
  )
}

export default Search
