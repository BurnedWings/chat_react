import React, { useEffect, useReducer, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Button ,NavBar,Divider} from 'antd-mobile'
import style from './EditView.module.less'
import "cropperjs/dist/cropper.css";
import Cropper from 'cropperjs';
import { useNavigate } from 'react-router-dom';
const EditView = (props) => {

    const image = useRef()

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
                        // this.theImgDataToSend = { formData };
                    });
            }
        });
    }
    useEffect(() => {
        initCropper(image.current)
    })
    return createPortal(
        <div className={style.editView}>
            <NavBar onBack={props.closeView}>标题</NavBar>
            <Divider style={{margin:'0'}} />
            <div className={style.container}>
                <img ref={image} className={style.imgContainer} src='/images/yk1.jpg' alt="" />
            </div>
            <div className={style.createButton}>
                <Button style={{ width: '90%', height: '11vw', padding: '0', marginLeft: '50%', transform: 'translateX(-50%)' }} block color='primary' size='large'>确定</Button>
            </div>
        </div >
        , document.body)
}

export default EditView
