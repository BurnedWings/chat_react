import React from 'react'
import style from './Search.module.less'
import { SearchBar, Divider, Image, Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
const Search = (props) => {
  return (
    <div className={style.search}>
      <SearchBar style={{ width: '93%', marginLeft: '5.5vw' }} onCancel={()=>{props.closeView()}} placeholder='请输入内容' showCancelButton={() => true} />
      <Divider style={{ margin: '2.2vw 0' }} />
      <div className={style.contentView}>
        <div className={style.userList}>
          <div className={style.userListTitle}>用户</div>
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
                  <Button style={{width:'14.5vw',height:'6.5vw',float:'right',marginTop:'0.3vw',fontSize:'12px',padding:'0'}} block shape='rounded' color='primary'>
                    发消息
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.group}>
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
                  <Button style={{width:'14.5vw',height:'6.5vw',float:'right',marginTop:'0.3vw',fontSize:'12px',padding:'0'}} block shape='rounded' color='primary'>
                    发消息
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
