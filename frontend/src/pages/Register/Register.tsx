import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '@/hooks/useRegister.ts'

export default function Register() {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        const { data } = useRegister('abc', 'username', 'email')
        console.log(data)
        navigate('/login')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
            <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit">Register</button>
        </form>
    );
}