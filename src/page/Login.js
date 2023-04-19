import React, { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/home';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email,
            password,
        };
        console.log(user);
        try {
            const res = await axios.post('/login', user);
            console.log(res.data);
            setStatus(res.data.status);
            setMessage(res.data.message);
            if (res.data.status === 'success') {
                localStorage.setItem('token', res.data.token);
                window.location.href = '/home';
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="max-w-7xl h-screen mx-auto flex justify-center items-center">
            <div className="w-full max-w-sm">
                <div className="flex flex-col break-words bg-white border-2 rounded shadow-md">
                    <div className="font-semibold bg-gray-200 text-gray-700 py-3 px-6 mb-0">
                        Login
                    </div>
                    <div className="w-full p-6">
                        <form className="w-full" onSubmit={handleSubmit}>
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
                            <div className="flex flex-wrap">
                                <button
                                    type="submit"
                                    className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4 font-light text-gray-700">
                            {status === 'success' ? (
                                <div className="text-green-500">{message}</div>
                            ) : (
                                <div className="text-red-500">{message}</div>
                            )}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <a
                                href="/register"
                                className="inline-block align-baseline font-bold text-sm text-slate-500 hover:text-slate-800"
                            >
                                Register
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;