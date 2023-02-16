import React, { Fragment } from 'react'
import { Image, Divider } from 'antd-mobile'
import style from './Header.module.less'
import {
    AddOutline,
    SearchOutline
} from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import PubSub from 'pubsub-js'
import {selectUser} from '../../store/user/index'
import { useSelector } from 'react-redux'
import myUrl from '../../config/myConfig'
const Header = () => {
    const {username,image,bio} = useSelector(selectUser)
    const navigate = useNavigate()
    const showSetting = () => {
        PubSub.publish('showSetting')
    }
    return (
        <Fragment>
            <div className={style.messageHeader}>
                {
                    image?<Image
                    src={myUrl+image}
                    fit='cover'
                    onClick={showSetting}
                    style={{ width: '10vw', height: '10vw', borderRadius: '50%', float: 'left', marginLeft: '3vw', marginTop: '1vw' }}
                />:''
                }
                <div style={{ paddingTop: '1vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', float: 'left', marginLeft: '1.5vw', height: '100%' }}>
                    <span style={{ fontWeight: 'bolder' }} >{username}</span>
                    <span >{bio?bio:'这个人很神秘，什么都没有留下。'}</span>
                </div>
                <div className={style.topRrght}>
                    <SearchOutline onClickCapture={() => { navigate('/search') }} style={{ marginTop: '3vw', marginRight: '3vw' }} />
                    <AddOutline onClickCapture={() => { navigate('/createGroup') }} style={{ marginTop: '3vw', marginRight: '2vw' }} />
                </div>
            </div>
            <Divider style={{ margin: '2.6vw 0 0 0' }} />
        </Fragment>
    )
}

export default Header
