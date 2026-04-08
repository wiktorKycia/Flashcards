import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import { Routes, Route } from 'react-router'

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile/' element={<UserProfile/>}/>
        </Routes>
    )
}

export default App
