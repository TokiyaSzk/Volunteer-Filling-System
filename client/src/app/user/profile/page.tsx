"use client";
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface userData {
    username?: string;
    email?: string;
    score?: number;
    region?: string;
}

function UserProfile(userData: userData) {


    return (
        <div className="relative z-[1] p-6 mt-7 max-w-md mx-auto bg-white shadow-md rounded-lg text-gray-800">
            <div className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">用户信息</div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">用户名:</span>
                <span className="text-gray-800">{userData.username}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">邮箱:</span>
                <span className="text-gray-800">{userData.email}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">分数:</span>
                <span className="text-gray-800">{userData.score}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">地区:</span>
                <span className="text-gray-800">{userData.region}</span>
            </div>
            <div className="w-full flex justify-center items-center space-x-5">
                <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                    <Link href="/volunteer" className="text-blue-500 hover:text-blue-700 transition-all duration-300">
                        填报志愿
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default function UserProfilePage() {
    const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
    const [userData, setUserData] = useState<{ username?: string; email?: string; score?: number; region?: string } | null>(null);
    const [profileEdit, setProfileEdit] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDataDict({ ...dataDict, [name]: value })
    }


    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("DevToken"));

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect,
        };

        fetch("http://localhost:3001/api/user/profile", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setUserData(JSON.parse(result));
                setDataDict(JSON.parse(result));
            })
            .catch((error) => console.error(error));
    }, []);

    const editButtonOnClick = async () => {
        console.log(dataDict)

        const url = "http://localhost:3001/api/user/update";
        const jsonData = JSON.stringify(dataDict);
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("DevToken")
            },
            body: jsonData,
            redirect: "follow" as RequestRedirect,
        };

        try {
            const response = await fetch(url, requestOptions);
            const result = await response.text();
            console.log(result);
            alert("更改成功")
            setProfileEdit(false)
        } catch (error) {
            console.error("Error Edit user:", error);
        }
    };

    return (
        <>
            <div className="relative z-[1] w-full h-[900px] text-black font-bold">
                <div className='w-full h-24 text-center pt-10 text-2xl text-red-600'>请先确认你的信息，然后再点击填报志愿</div>
                {userData ? (
                    <>
                        <UserProfile {...userData} />
                        <div className='w-full h-20 flex justify-center items-center'>
                            <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                                <button onClick={() => { setProfileEdit(true) }}>更改信息</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl">Loading...</h1>
                    </>
                )}
                {profileEdit && (
                    <>
                        <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-500 bg-opacity-20 flex justify-center items-center'>
                            <div className='w-[300px] h-[550px] bg-white rounded-2xl p-14 pt-8'>
                                <div className='w-full text-center text-xl text-red-600 mb-8'>更改您的信息</div>
                                <div className='space-y-2'>
                                    <label htmlFor="username">用户名</label>
                                    <input type="text" name="username" id="username" defaultValue={userData?.username} className="w-full mb-4 p-2 border rounded"
                                        onChange={handleChange} />
                                    <label htmlFor="username">密码</label>
                                    <input type="password" name="password" id="username" className="w-full mb-4 p-2 border rounded"
                                        onChange={handleChange} />
                                    <label htmlFor="email">邮箱</label>
                                    <input type="email" name="email" id="email" defaultValue={userData?.email} className="w-full mb-4 p-2 border rounded"
                                        onChange={handleChange} />
                                    <label htmlFor="score">分数</label>
                                    <input type="number" name="score" id="score" defaultValue={userData?.score} className="w-full mb-4 p-2 border rounded"
                                        onChange={handleChange} />
                                    <label htmlFor="region">地区</label>
                                    <input type="text" name="region" id="region" defaultValue={userData?.region} className="w-full mb-4 p-2 border rounded"
                                        onChange={handleChange} />
                                    <div className="w-full flex justify-center items-center space-x-5">
                                        <button className="rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300" onClick={() => setProfileEdit(false)}>取消</button>
                                        <button className="rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300" onClick={editButtonOnClick}>更改</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )

}