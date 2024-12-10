"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface userData {
    id?: string;
    username?: string;
    email?: string;
    score?: number;
    region?: string;
}

interface volunteerData {
    id?:string
    user_id?: string;
    school_id?: string;
    major_id?: string;
    priority?: string;
}

function UserProfile(userData: userData) {
    return (
        <div className=" z-[1] p-6 mt-7 w-[500px] h-[500px] bg-white shadow-md rounded-lg text-gray-800">
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

function UserVolunteer({ volunteerData }: { volunteerData: volunteerData[] }) {

    const safeVolunteerData = volunteerData || []; // 如果未定义，则使用空数组
    return (
        <>
            <div className="relative z-[1] w-[500px] p-6 mt-7 h-[500px] bg-white shadow-md rounded-lg text-gray-800">
                {safeVolunteerData.map((volunteer, index) => (
                    <div key={index}>
                        <div className=''>
                            <div className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">志愿{index + 1}</div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">院校代码:</span>
                                <span className="text-gray-800">{volunteer.school_id}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">专业代码:</span>
                                <span className="text-gray-800">{volunteer.major_id}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default function UserProfilePage() {
    const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
    const [volunteerDict, setVolunteerDict] = useState<volunteerData[]>([]);
    const [userData, setUserData] = useState<userData | null>(null);
    const [profileEdit, setProfileEdit] = useState(false);
    const [volunteerData, setVolunteerData] = useState<volunteerData[]>([]);
    const [editVolunteer, setEditVolunteer] = useState(false);
    const [volunteerResult, setVolunteerResult] = useState({
        id: "",
        user_id: "",
        school_id: "暂无",
        major_id: "暂无",
        batch: "",
    });


    // 获取用户数据
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("StudentToken");
                if (!token) {
                    console.error("StudentToken 不存在，请检查");
                    return;
                }

                const myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${token}`);

                const response = await fetch("http://localhost:3001/api/user/profile", {
                    method: "GET",
                    headers: myHeaders
                });

                if (!response.ok) {
                    throw new Error(`获取用户数据失败: ${response.statusText}`);
                }

                const result = await response.json();
                console.log(result);
                setUserData(result);
            } catch (error) {
                console.error("获取用户数据失败:", error);
            }
        };

        fetchUserData();
    }, []);

    // 获取志愿
    useEffect(() => {
        const fetchVolunteerData = async () => {
            if (!userData || !userData.id) {
                console.warn("userData 未初始化或 userData.id 不存在");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:3001/api/volunteer/query?user_id=${userData.id}`,
                    {
                        method: "GET"
                    }
                );

                if (!response.ok) {
                    throw new Error(`获取志愿数据失败: ${response.statusText}`);
                }

                const result = await response.json();
                console.log(result);
                setVolunteerData(result);
                setVolunteerDict(result);
            } catch (error) {
                console.error("获取志愿数据失败:", error);
            }
        };

        fetchVolunteerData();
    }, [userData]); // 添加 userData 作为依赖

    // 获取录取结果
    useEffect(() => {
        if (userData) {
            const requestOptions = {
                method: "GET"
            };

            fetch(`http://localhost:3001/api/admission/results/${userData.id}`, requestOptions)
                .then((response) => {
                    if (response.status === 404) {
                        console.warn("No results found (404)");
                        return [];
                    }
                    return response.json();
                })
                .then((result) => {
                    if (result.length > 0) {
                        setVolunteerResult(result[0]); // 提取第一个对象
                        console.log(volunteerResult);
                    } else {
                        console.warn("No results found");
                    }
                })
                .catch((error) => console.error(error));
        }
    }, [userData]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDataDict({ ...dataDict, [name]: value })
    }

    const handleVolunteerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, id } = e.target;
        const index = parseInt(id);
        console.log(index);
        setVolunteerDict((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = {
                ...updatedData[index],
                [name]: value,
            };
            return updatedData;
        });
    };



    // Edit UserProfile Button click
    const editButtonOnClick = async () => {
        console.log(dataDict)

        const url = "http://localhost:3001/api/user/update-password";
        const jsonData = JSON.stringify(dataDict);
        const requestOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("StudentToken")
            },
            body: jsonData
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

    const editVolunteerButtonOnClick = async () => {
        console.log(volunteerDict)
        for (const data of volunteerDict) {
            const body = {
                user_id: data.user_id,
                school_id: data.school_id,
                major_id: data.major_id,
                priority: data.priority
            }
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify(body);

            const requestOptions = {
                method: "PUT",
                headers: myHeaders,
                body: raw
            };

            fetch(`http://localhost:3001/api/volunteer/update/${data.id}`, requestOptions)
                .then((response) => response.text())
                .then((result) => console.log(result))
                .catch((error) => console.error(error));

        }
        setEditVolunteer(false);
        window.location.reload();
    };

    return (
        <>
            <div className="relative z-[1] w-full h-[1000px] text-black font-bold bg-gradient-to-br from-blue-200 via-gray-100 to-gray-200">
                <div className='w-full h-24 text-center pt-10 text-2xl text-red-600 justify-center items-center'>请先确认你的信息，然后再点击填报志愿</div>
                {userData ? (
                    <>
                        <div>
                            <div className='flex flex-row space-x-5 justify-center items-center'>
                                <UserProfile {...userData} />
                                <UserVolunteer volunteerData={volunteerData}></UserVolunteer>
                            </div>
                            <div className="w-[800px] p-6 mt-7  mx-auto bg-white shadow-md rounded-lg text-gray-800">
                                <div className=" text-xl font-bold text-gray-900 border-b pb-3 mb-4">录取结果</div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 font-medium">录取院校:</span>
                                    <span className="text-gray-800">{volunteerResult.school_id}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600 font-medium">录取专业:</span>
                                    <span className="text-gray-800">{volunteerResult.major_id}</span>
                                </div>
                            </div>
                        </div>


                    </>
                ) : (
                    <>
                        <h1 className="text-3xl">Loading...</h1>
                    </>
                )}
                <div className='w-full h-20 flex justify-center items-center'>
                    <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                        <button onClick={() => { setProfileEdit(true) }}>更改密码</button>
                    </div>
                    <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                        <button className="text-blue-500 hover:text-blue-700 transition-all duration-300" onClick={() => setEditVolunteer(true)}>
                            更改志愿
                        </button>
                    </div>
                </div>
                {/* 更改密码 */}
                {profileEdit && (
                    <>
                        <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-500 bg-opacity-20 flex justify-center items-center'>
                            <div className='w-[300px] h-[550px] bg-white rounded-2xl p-14 pt-8'>
                                <div className='w-full text-center text-xl text-red-600 mb-8'>更改您的密码</div>
                                <div className='space-y-2'>
                                    <label htmlFor="username">密码</label>
                                    <input type="password" name="password" id="username" className="w-full mb-4 p-2 border rounded"
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
                {/* 更改志愿 */}
                {editVolunteer && (
                    <>
                        <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-500 bg-opacity-20 flex justify-center items-center'>
                            <div className='w-[300px] h-[550px] bg-white rounded-2xl p-14 pt-8 overflow-auto'>
                                <div className='space-y-2'>
                                    {volunteerData.length > 0 ? (
                                        volunteerData.map((volunteer, index) => (
                                            <div key={index}>
                                                <div className=" text-xl font-bold text-gray-900 border-b pb-3 mb-4">志愿{index + 1}</div>
                                                <label >院校代码</label>
                                                <input type="text" name="school_id" id={`${index}`} className="w-full mb-4 p-2 border rounded" onChange={handleVolunteerChange} defaultValue={volunteer.school_id}
                                                />
                                                <label >专业代码</label>
                                                <input type="text" name="major_id" id={`${index}`} className="w-full mb-4 p-2 border rounded" onChange={handleVolunteerChange} defaultValue={volunteer.major_id}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500">没有可编辑的志愿信息</div>
                                    )}
                                    <div className="w-full flex justify-center items-center space-x-5">
                                        <button className="rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300" onClick={() => setEditVolunteer(false)}>取消</button>
                                        <button className="rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300" onClick={editVolunteerButtonOnClick}>更改</button>
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