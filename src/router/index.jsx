import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Message = lazy(() => import('../views/Message/Message'))
const Trend = lazy(() => import('../views/Trend/Trend'))
const User = lazy(() => import('../views/User/User'))
const Search = lazy(() => import('../views/Search/Search'))
const Login = lazy(() => import('../views/Login/Login'))
const Register = lazy(() => import('../views/Register/Register'))
const CreateGroup = lazy(() => import('../views/CreateGroup/CreateGroup'))
const UserChat = lazy(() => import('../views/Message/UserChat/UserChat'))
const UserChatSetting = lazy(() => import('../views/Message/UserChat/UserChatSetting/UserChatSetting'))
const UserDetail = lazy(() => import('../views/UserDetail/UserDetail'))
const GroupChat = lazy(() => import('../views/Message/GroupChat/GroupChat'))
const routes = [
    {
        path: '/message',
        element: <Message />,
        children: [
            {
                path: 'userChat',
                element: <UserChat />,
                children: [
                    {
                        path: 'userChatSetting',
                        element: <UserChatSetting />,
                    }
                ]
            },
            {
                path: 'groupChat',
                element: <GroupChat />,
            }
        ]
    },
    {
        path: '/trend',
        element: <Trend />,
    },
    {
        path: '/user',
        element: <User />
    },
    {
        path: '/search',
        element: <Search />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/createGroup',
        element: <CreateGroup />,
    },
    {
        path: '/userDetail',
        element: <UserDetail />,
    },
    // {
    //     path: '/about',
    //     element: <AuthRoute><About /></AuthRoute>
    // },
    {
        path: '/',
        element: <Navigate to='/login' />
    }
]

export default routes