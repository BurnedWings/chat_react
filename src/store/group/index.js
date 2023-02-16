import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

// export const getInfoAsync = createAsyncThunk(
//     'user/getInfo',
//     async (value) => {
//         // const res = await fetch(`/api/getInfo/${value}`)
//         // const data = await res.json()
//         return data.data.age
//     }
// )

export const groupSlice = createSlice({
    name: 'group',
    initialState: {
        myGroup:[],
        groupList:[]
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
        getGroup: (state, action) => {
            state.groupList = action.payload.groupList
            state.myGroup = action.payload.myGroup
        }
    },
    // extraReducers(builder) {
    //     builder
    //         // .addCase(getInfoAsync.pending, (state, action) => {
    //         //     state.status = 'loading'
    //         // })
    //         .addCase(getInfoAsync.fulfilled, (state, action) => {
    //             // state.status = 'succeeded'
    //             // Add any fetched posts to the array
    //             state.value = action.payload
    //         })
    //     // .addCase(getInfoAsync.rejected, (state, action) => {
    //     //     state.status = 'failed'
    //     //     state.error = action.error.message
    //     // })
    // }
})

export const { getGroup } = groupSlice.actions

export const selectGroup = state => {
    return {
        myGroup:state.group.myGroup,
        groupList:state.group.groupList
    }
}

export default groupSlice.reducer