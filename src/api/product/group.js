import requests from "../request";

export const updateGroupAvatar = (fromData) => requests({ url: '/group/updateGroupAvatar', method: 'post', data: fromData })

export const createTheGroup = (groupname,image,userList) => requests({ url: '/group/createTheGroup', method: 'post', data: {groupname,image,userList} })

export const getGroupWhichJoin = () => requests({ url: '/group/getGroupWhichJoin', method: 'get'})

export const getGroupChatInfo = (groupId) => requests({ url: `/group/getGroupChatInfo/${groupId}`, method: 'get'})

export const sendGroupMessage = (groupId,content) => requests({ url: `/group/sendGroupMessage`, method: 'post',data:{groupId,content}})
