import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getInfoAsync = createAsyncThunk(
    'user/getInfo',
    async (value) => {
        // const res = await fetch(`/api/getInfo/${value}`)
        // const data = await res.json()
        return data.data.age
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {},
        friendList: [],
        activeIndex:1
    },
    reducers: {
        // increment: state => {
        //     // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。
        //     // 并不是真正的改变 state 因为它使用了 immer 库
        //     // 当 immer 检测到 "draft state" 改变时，会基于这些改变去创建一个新的
        //     // 不可变的 state
        //     state.value += 1
        // },
        // decrement: state => {
        //     state.value -= 1
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload
        //     console.log(action)
        // },
        changeUserInfo: (state, action) => {
            state.userInfo = action.payload
        },
        getLocalInfo: (state) => {
            // state.userInfo
            if (!localStorage.getItem(`chat_userInfo`)) return
            state.userInfo = JSON.parse(localStorage.getItem(`chat_userInfo`))
        },
        getFriendList: (state, action) => {
            state.friendList = action.payload
        },
        getActiveIndex:(state, action)=>{
            state.activeIndex = action.payload
        }
    },
    extraReducers(builder) {
        builder
            // .addCase(getInfoAsync.pending, (state, action) => {
            //     state.status = 'loading'
            // })
            .addCase(getInfoAsync.fulfilled, (state, action) => {
                // state.status = 'succeeded'
                // Add any fetched posts to the array
                state.value = action.payload
            })
        // .addCase(getInfoAsync.rejected, (state, action) => {
        //     state.status = 'failed'
        //     state.error = action.error.message
        // })
    }
})

export const { changeUserInfo, getLocalInfo, getFriendList,getActiveIndex } = userSlice.actions

export const selectUser = state => state.user.userInfo

export const selectFriendList = state => state.user.friendList

export const selectActiveIndex = state => state.user.activeIndex

export default userSlice.reducer