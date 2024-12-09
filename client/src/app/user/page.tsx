"use client";

import AnimatedComponent from "@/component/AnimateComponent";
import { parseJsonFile } from "next/dist/build/load-jsconfig";
import { useState, useEffect } from "react";

export default function UserPage() {
    const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
    const [register, setRegister] = useState(false)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDataDict({ ...dataDict, [name]: value })
    }

    const registerButtonClick = async () => {
        console.log(dataDict)

        const url = "http://localhost:3001/api/user/register";
        const jsonData = JSON.stringify(dataDict);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData,
            redirect: "follow" as RequestRedirect,
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.text();
            console.log(result);
            window.location.href = "/user";
        } catch (error) {
            console.error("Error registering user:", error);
            alert("注册失败")
        }


    }
    const loginButtonClick = async () => {
        console.log(dataDict)
        const url = "http://localhost:3001/api/user/login";
        const jsonData = JSON.stringify(dataDict);
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData,
            redirect: "follow" as RequestRedirect,
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.text();
            console.log(result);
            const tokenData = JSON.parse(result);
            const token = tokenData.token;
            localStorage.setItem("DevToken", token);
            window.location.href = "/user/profile";
        } catch (error) {
            console.error("Error registering user:", error);
        }

    }
    return (
        <>
            <AnimatedComponent>
                <div className="relative w-full h-[900px] p-10 flex flex-col  bg-gradient-to-br from-blue-200 via-gray-100 to-gray-200 justify-center items-center z-1">
                    <div className="w-[400px] h-[600px] p-14 bg-white rounded-2xl text-black font-bold space-y-8 overflow-y-auto ">
                        <div className="w-full h-10 text-2xl tracking-widest text-center">账户登陆</div>
                        <div className="space-y-2">
                            <label htmlFor="">账户名</label>
                            <input type="text" name="username" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="">密码</label>
                            <input type="text" name="password" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                onChange={handleChange} />
                        </div>
                        {register && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="">邮箱</label>
                                    <input type="eamil" name="email" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        onChange={handleChange} />
                                </div>
                                <div className="space-y-2">

                                    <label htmlFor="">成绩</label>
                                    <input type="text" name="score" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        onChange={handleChange} />
                                </div>
                                <div className="space-y-2">

                                    <label htmlFor="">地区</label>
                                    <input type="text" name="region" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        onChange={handleChange} />
                                </div>

                            </>
                        )
                        }
                        <div className="w-full flex items-center justify-center space-x-10">
                            {register ? (
                                <button className="px-6 py-3 text-white bg-gradient-to-r from-green-400 to-teal-500 hover:from-teal-500 hover:to-green-400 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-green-300 focus:outline-none"
                                    onClick={registerButtonClick}>提交</button>
                            ) : (
                                <>
                                    <button onClick={() => setRegister(true)}>注册</button>
                                    <button className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                                        onClick={loginButtonClick}>登陆</button>
                                </>
                            )}

                        </div>
                    </div>


                </div>
            </AnimatedComponent>
        </>
    )
}