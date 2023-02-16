import React, { useEffect, useRef, useState } from 'react'
import style from './CreateGroup.module.less'
import { NavBar, Divider, Input, Image, Checkbox, Footer, Button, Popup, Toast } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { EditSOutline } from 'antd-mobile-icons'
// import EditView from '../../cpmpoments/EditView/EditView'
// import { useSelector } from 'react-redux'
// import { selectFriendList } from '../../store/user'
import myConfig from '../../config/myConfig'
import api from '../../api'
import Cropper from 'cropperjs';
import { useSelector } from 'react-redux'
import { selectFriendList } from '../../store/user'
const CreateGroup = () => {
  const navigate = useNavigate()

  const myInput = useRef()

  useEffect(() => {
    myInput.current.focus()
  })

  const friendList = useSelector(selectFriendList)


  const [isShowEditImg, setIsShowEditImg] = useState(false)

  const initImg = () => {
    initCropper(imageContainer.current)
    imgBackGround.current.style.opacity = '0'
    setTimeout(() => {
      imgBackGround.current.style.display = 'none'
    }, 300)
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

  const [backUrl, setBackUrl] = useState('')

  const updateTheAvatar = async () => {
    const ret = await api.group.updateGroupAvatar(theImgDataToSend.formData)
    if (ret.code === 200) {
      setBackUrl(ret.url)
      setIsShowEditImg(false)
    }
  }

  const editImage = () => {
    document.querySelector('.update-input').click()
  }

  const [value, setValue] = useState([])

  const createTheGroup = async () => {
    if (myInput.current.nativeElement.value.trim() === '') {
      myInput.current.focus()
      return Toast.show({
        content: '输入群名称'
      })
    }
    const ret = await api.group.createTheGroup(myInput.current.nativeElement.value.trim(),backUrl,value)
    if(ret.code===200){
      Toast.show({
        content:'创建成功'
      })
      navigate(-1)
    }
  }

  return (
    <div className={style.createGroup}>
      {/* {
        isShowEdit ? <EditView closeView={closeView} /> : ''
      } */}
      <NavBar back='返回' onBack={() => { navigate(-1) }} backArrow={false}>
        创建群聊
      </NavBar>
      <Divider style={{ margin: '1vw 0 0 0' }} />
      <input
        style={{ display: 'none' }}
        className='update-input'
        type="file"
        accept="image/*"
        id="imgReader"
        encType="multipart/form-data"
        onChange={loadingImg}
      />
      <img onClick={editImage} className={style.groupAvatar} src={backUrl === '' ? '/images/06c794d1bbdd850f.jpg' : myConfig + backUrl} alt="" />
      <EditSOutline onClick={editImage} style={{ color: 'white', fontSize: '1.5rem', position: 'relative', top: '-12vw', left: '-31vw' }} />
      <Input
        ref={myInput}
        style={{ marginTop: '8vw', backgroundColor: 'rgb(243, 244, 246)', height: '10vw', borderRadius: '10vw', width: '90%', marginLeft: '50%', transform: 'translateX(-50%)', '--text-align': 'center', '--placeholder-color': '#272832' }}
        placeholder='请输入群名称'
      // onChange={val => {
      //   setValue(val)
      // }}
      />
      <div className={style.userList}>
        <div className={style.userListTitle}>用户</div>
        <div className={style.userListContainer}>
          <Checkbox.Group
            value={value}
            onChange={v => {
              setValue(v)
            }}
          >
            {
              friendList.map((item) => {
                return (
                  <div key={item._id} className={style.userListItem}>
                    <Image
                      src={myConfig + item.image}
                      fit='cover'
                      style={{ width: '13vw', height: '13vw', borderRadius: '15%', float: 'left', marginTop: '1vw' }}
                    />
                    <div className={style.userBox}>
                      <div className={style.userItemId}>
                        <span className={style.currentId}>{item.username}</span>
                        <Checkbox value={item._id} style={{ float: 'right', marginRight: '1vw' }} />
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </Checkbox.Group>
          <Footer label='没有更多了'></Footer>
        </div>
      </div>
      <div className={style.createButton}>
        <Button onClick={createTheGroup} style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>创建({value.length})</Button>
      </div>
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
    </div>
  )
}

export default CreateGroup
