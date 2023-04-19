import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (name === '' || email === '' || password === '' || address === '' || phone === '') {
            setStatus('error');
            setMessage('Please fill in all fields');
            return;
        }

        const res = await axios.post('/register', {
            name,
            email,
            password,
            address,
            phone,
        });
        setStatus(res.data.status);
        setMessage(res.data.message);
        if (res.data.status === 'success') {
            window.location.href = '/login';
        }
    };

    return (
        <div className="max-w-7xl h-screen mx-auto flex justify-center items-center">
            <div className="w-full max-w-sm">
                <div className="flex flex-col break-words bg-white border-2 rounded shadow-md">
                    <div className="font-semibold bg-gray-200 text-gray-700 py-3 px-6 mb-0">
                        Register
                    </div>
                    <div className="w-full p-6">
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div className="flex flex-wrap mb-6">
                                <label
                                    htmlFor="name"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Name:
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="p-3 bg-gray-200 rounded form-input w-full"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="flex flex-wrap mb-6">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 bg-gray-200 rounded form-input w-full"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="flex flex-wrap mb-6">
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-3 bg-gray-200 rounded form-input w-full"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div className="flex flex-wrap mb-6">
                                <label
                                    htmlFor="address"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Address:
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="p-3 bg-gray-200 rounded form-input w-full"
                                    placeholder="Enter your address"
                                />
                            </div>
                            <div className="flex flex-wrap mb-6">
                                <label
                                    htmlFor="phone"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Phone:
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="p-3 bg-gray-200 rounded form-input w-full"
                                    placeholder="Enter your phone"
                                />
                            </div>
                        </form>
                        <button
                            className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                            onClick={handleSubmit}
                        >
                            Register
                        </button>
                        <div className="text-center mt-4 font-light text-gray-700">
                            Already have an account?{' '}
                            <Link to="/login" className="text-slate-500 hover:text-slate-700">
                                Login
                            </Link>
                        </div>
                        <div className="text-center mt-4 font-light text-gray-700">
                            {status === 'success' ? (
                                <div className="text-green-500">{message}</div>
                            ) : (
                                <div className="text-red-500">{message}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;