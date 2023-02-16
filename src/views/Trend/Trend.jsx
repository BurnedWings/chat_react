import React, { Fragment, useRef, useState } from 'react'
import style from './Trend.module.less'
import {
  Image,
  ImageViewer,
  Divider,
  Input,
  Popup,
  NavBar,
  Button,
  TextArea,
  ImageUploader,
  PullToRefresh
} from 'antd-mobile'
import {
  LeftOutline,
  AddCircleOutline,
  BellOutline,
  MoreOutline,
  LikeOutline,
  MessageOutline,
  SendOutline
} from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'

//下拉
const statusRecord = {
  pulling: '用力拉',
  canRelease: '松开吧',
  refreshing: '玩命加载中...',
  complete: '好啦',
}

import { selectUser } from '../../store/user/index'
import { useSelector } from 'react-redux'
import myConfig from '../../config/myConfig'
import api from '../../api'

const Todo = () => {
  const navigate = useNavigate()

  const [visible, setVisible] = useState(false)

  const [isShowCreateView, setCreateView] = useState(false)

  const images = [
    '/images/R-C.jpg',
    '/images/R-C.jpg',
    '/images/R-C.jpg'
  ]

  const refMap = useRef([])

  const refInput = useRef()

  const [content, setContent] = useState('')

  const [contentCopy, setContentCopy] = useState('')

  const [fileList, setFileList] = useState([
    {
      url: '/images/R-C.jpg',
    },
    {
      url: '/images/R-C.jpg',
    },
  ])

  const myUpload = () => {
    console.log("上传图片")
    setFileList([...fileList, {
      url: '/images/R-C.jpg',
    }])
    return null
  }

  const { image } = useSelector(selectUser)


  const dataURLtoBlob = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = window.atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: 'video/mp4' });
  }


  //视频上传
  const loadingImg = (event) => {
    let reader = new FileReader()
    if (event.target.files[0]) {
      const imgName = event.target.files[0].name
      reader.readAsDataURL(event.target.files[0])
      reader.onload = async (e) => {
        let dataURL = reader.result
        // this.$bus.$emit("showEdit", dataURL, imgName);
        console.log(dataURL, imgName)
        const blob = dataURLtoBlob(dataURL)
        const formData = new FormData()
        formData.append("files", blob, "example.mp4")

        const ret = await api.user.uploadVideo(formData)
        if (ret.code === 200) {
          console.log(ret)
        }
        // setImgUrl(dataURL)
        // setIsShowEditImg(true)
      }
    }
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
        <div className={style.trend}>
          <div className={style.imgContainer}>
            <LeftOutline onClick={() => { navigate(-1) }} style={{ position: 'absolute', fontSize: '1.5rem', top: '2vw', left: '1.5vw', color: 'white' }} />
            <BellOutline style={{ position: 'absolute', fontSize: '1.5rem', right: '13vw', top: '2.2vw', color: 'white' }} />
            <AddCircleOutline onClick={() => { setCreateView(true) }} style={{ position: 'absolute', fontSize: '1.5rem', right: '3vw', top: '2vw', color: 'white' }} />
            <Image src='/images/R-C.jpg' fit='cover' />
            <Image src={myConfig + image} style={{ border: 'solid white 0.1vw', position: 'absolute', bottom: '1vw', left: '2vw', width: '16vw', height: '16vw', borderRadius: '50%' }} fit='cover' />
          </div>
          <div className={style.trendContainer}>
            {
              images.map((item, index) => {
                return (
                  <div key={index} className={style.trendItem}>
                    <div className={style.trendHeader}>
                      <Image src='/images/R-C.jpg' style={{ float: 'left', width: '10vw', height: '10vw', borderRadius: '50%' }} fit='cover' />
                      <div style={{ paddingLeft: '1vw', paddingTop: '0.5vw', display: 'flex', flexDirection: "column", justifyContent: 'center', height: '10vw' }}>
                        <span style={{ fontWeight: '600', fontSize: '1rem' }}>歪比歪比</span>
                        <span>2000.11.22</span>
                      </div>
                      <MoreOutline style={{ fontSize: '1.7rem', position: 'absolute', right: '0', top: '1.2vw' }} />
                    </div>
                    <div className={style.contentContainer}>
                      撒大苏打实打实打算需现场撒大撒大撒发射点反对的啊实打实打算阿三大苏打
                    </div>
                    <div className={style.nineImgContainer}>
                      <Image onClick={() => { setVisible(true) }} src='/images/R-C.jpg' style={{ width: '31.2vw', height: '31.2vw' }} fit='cover' />
                      <Image onClick={() => { setVisible(true) }} src='/images/R-C.jpg' style={{ width: '31.2vw', height: '31.2vw' }} fit='cover' />
                      <Image onClick={() => { setVisible(true) }} src='/images/R-C.jpg' style={{ width: '31.2vw', height: '31.2vw' }} fit='cover' />
                    </div>
                    <div className={style.trendFooter}>
                      <div className={style.messageContainer}>
                        <span className={style.message}>浏览114514次</span>
                        <div className={style.tollBar}>
                          <LikeOutline />
                          <MessageOutline onClick={() => { refMap.current[index].focus() }} />
                          <SendOutline />
                        </div>
                      </div>
                      <Divider style={{ marginTop: '0', marginBottom: '2vw' }} />
                      <div className={style.kudosContainer}>
                        <LikeOutline style={{ marginTop: '1vw', marginRight: '1vw' }} />
                        <span className={style.username}>歪比歪比、外币巴伯、马来西亚</span>
                      </div>
                      <div className={style.inputContainer}>
                        <Input
                          ref={f => { refMap.current[index] = f }}
                          placeholder='评论'
                          style={{ backgroundColor: 'rgb(245, 245, 245)', paddingLeft: '2vw', width: '98%', '--font-size': '15px' }}
                        // value={value}
                        // onChange={val => {
                        //   setValue(val)
                        // }}
                        />
                      </div>
                      <Divider
                        style={{
                          color: '#1677ff',
                          borderColor: '#1677ff',
                          borderStyle: 'dashed',
                        }}
                      />
                    </div>
                  </div>
                )
              })
            }

          </div>
          <ImageViewer.Multi
            images={images}
            visible={visible}
            defaultIndex={1}
            onClose={() => {
              setVisible(false)
            }}
          />
        </div>
        <Popup
          afterShow={() => { refInput.current.focus() }}
          visible={isShowCreateView}

          bodyStyle={{ height: '100%' }}
        >
          <NavBar back='取消'
            onBack={() => { setCreateView(false) }}
            backArrow={false}
            right={
              <Button size='mini' color='primary'>
                发表
              </Button>
            }>
            写说说
          </NavBar>
          <Divider style={{ margin: '0' }} />
          <TextArea
            ref={refInput}
            style={{ borderRadius: '3vw', padding: '1vw', boxShadow: '1vw 2vw 4vw 0.5vw rgba(39,40,50,0.1)', backgroundColor: '#F3F4F6', width: '90%', marginTop: '10vw', marginLeft: '50%', transform: 'translateX(-50%)' }}
            placeholder={'分享新鲜事~'}
            showCount
            maxLength={200}
            value={content}
            onChange={(val) => { setContent(val) }}
          />
          {/* 视频上传 */}
          {/* <input
            // style={{ display: 'none' }}
            className='update-input'
            type="file"
            accept="video/*"
            id="imgReader"
            encType="multipart/form-data"
            onChange={loadingImg}
          /> */}
          {/* <TextArea
          value={content}
          readOnly
          autoSize={{ minRows: 1, maxRows: 10 }}
        /> */}
          <ImageUploader
            style={{ paddingLeft: '4vw', marginTop: "5vw",paddingRight:'6vw' }}
            columns={4}
            value={fileList}
            onChange={setFileList}
            beforeUpload={myUpload}
          />
        </Popup>
      </PullToRefresh>
    </Fragment>
  )
}

export default Todo
