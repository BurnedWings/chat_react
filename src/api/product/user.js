import requests from "../request";

export const login = ({ email, password }) => requests({ url: '/user/login', method: 'post', data: { email, password } })

export const register = (user) => requests({ url: '/user/register', method: 'post', data: user })

export const getUser = () => requests({ url: '/user/getUser', method: 'get' })

export const searchUser = (inputInfo) => requests({ url: `/user/searchUser/${inputInfo}`, method: 'get' })

export const getOneUser = (userId) => requests({ url: `/user/getOneUser/${userId}`, method: 'get' })

export const updateAvatar = (fromData) => requests({ url: '/user/updateAvatar', method: 'post', data: fromData })

export const uploadVideo = (fromData) => requests({ url: '/user/uploadVideo', method: 'post', data: fromData })

export const addUser = (toUser, message,toGroup) => requests({ url: '/user/addUser', method: 'post', data: { toUser, message,toGroup } })

export const getUserRequest = () => requests({ url: '/user/getUserRequest', method: 'get' })

export const agreeUserRequest = (message) => requests({ url: `/user/agreeUserRequest`, method: 'post',data:{message} })

export const getUserGroup = () => requests({ url: `/user/getUserGroup`, method: 'get' })

export const sendMessageToUser = (toUser,content) => requests({ url: `/user/sendMessageToUser`, method: 'post',data:{toUser,content} })

export const getMessageList = () => requests({ url: `/user/getMessageList`, method: 'get'})

export const getMessageListOfOneUser = (toUserId) => requests({ url: `/user/getMessageListOfOneUser`, method: 'post',data:{toUserId}})

export const getFriendList = () => requests({ url: `/user/getFriendList`, method: 'get'})

