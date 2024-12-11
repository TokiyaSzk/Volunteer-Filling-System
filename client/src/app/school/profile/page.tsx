"use client";

import { useState, useEffect, use } from "react";

interface AdminData {
    id?: string,
    school_id?: string,
    username?: string
}
interface SchoolData {
    id?: string,
    name?: string,
    province?: string,
    ranking?: string,
    category?: string
}
interface VolunteerData {
    id?: string,
    user_id?: string,
    school_id?: string,
    major_id?: string,
    priority?: string
}
interface AdmissionData {
    id?: string,
    user_id?: string,
    school_id?: string,
    major_id?: string,
    batch?: string
}

export default function SchoolProfilePage() {

    const [admission, setAdmission] = useState<AdmissionData[]>();
    const [volunteerData, setVolunteerData] = useState<VolunteerData[]>();
    const [schoolData, setSchoolData] = useState<SchoolData>({});
    const [adminData, setAdminData] = useState<AdminData>({
        id: "1",
        school_id: "0",
        username: "admin"
    });

    // 获取Admin信息
    useEffect(() => {
        const myHeaders = new Headers();
        const token = localStorage.getItem("AdminToken");
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
        };

        fetch("http://localhost:3001/api/admin/profile", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setAdminData(JSON.parse(result));
            })
            .catch((error) => console.error(error));
    }, []);

    // 获取学校信息
    useEffect(() => {
        const requestOptions = {
            method: "GET",
        };

        fetch(`http://localhost:3001/api/school/${adminData?.school_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                if (result != "School not found") {
                    setSchoolData(JSON.parse(result));
                }
            })
            .catch((error) => console.error(error));
    }, [adminData]);

    // 获取填报信息
    useEffect(() => {
        const requestOptions = {
            method: "GET",
        };

        fetch(`http://localhost:3001/api/volunteer/query?school_id=${adminData.school_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setVolunteerData(JSON.parse(result));
                console.log(volunteerData);
            })
            .catch((error) => console.error(error));
    }, [adminData]);

    // 获取录取结果
    useEffect(() => {
        const requestOptions = {
            method: "GET",
        };

        fetch(`http://localhost:3001/api/admission/school/${adminData.school_id}`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                if (result != "No admissions found for this school") {
                    setAdmission(JSON.parse(result));
                }
            })
            .catch((error) => console.error(error));
    }, [adminData]);

    // 开始录取按钮事件
    const handleAdmission = () => {
        const requestOptions = {
            method: "POST",
        };

        fetch("http://localhost:3001/api/admission/start", requestOptions)
            .then((response) => {
                response.text();
                if (response.status === 200) {
                    alert("录取成功");
                }
                else {
                    alert("录取失败");
                }
            })
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
    };


    return (
        <>
            <div className="relative z-[1] w-full h-[900px] bg-gradient-to-br from-blue-200 via-gray-100 to-gray-200 flex flex-col justify-center items-center text-black font-bold">
                <div className="text-2xl text-center">欢迎 {adminData?.username}<br></br>你的院校是{schoolData.name} 院校代码是{adminData?.school_id}</div>
                <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                    <button className="text-blue-500 hover:text-blue-700 transition-all duration-300" onClick={handleAdmission}>
                        开始录取
                    </button>
                </div>
                <div className="flex justify-center items-center flex-row text-center space-x-4">
                    <div className="w-[500px] p-6 mt-7 h-[500px] bg-white shadow-md rounded-lg text-gray-800 overflow-auto">
                        <p>志愿填报情况</p>
                        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">志愿ID</th>
                                    <th className="border border-gray-300 px-4 py-2">学生ID</th>
                                    <th className="border border-gray-300 px-4 py-2">学校ID</th>
                                    <th className="border border-gray-300 px-4 py-2">专业ID</th>
                                    <th className="border border-gray-300 px-4 py-2">优先级</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteerData?.map((volunteer) => (
                                    <tr key={volunteer.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{volunteer.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{volunteer.user_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{volunteer.school_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{volunteer.major_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{volunteer.priority}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-[500px] p-6 mt-7 h-[500px] bg-white shadow-md rounded-lg text-gray-800">
                        <p>录取情况</p>
                        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">志愿ID</th>
                                    <th className="border border-gray-300 px-4 py-2">学生ID</th>
                                    <th className="border border-gray-300 px-4 py-2">学校ID</th>
                                    <th className="border border-gray-300 px-4 py-2">专业ID</th>
                                    <th className="border border-gray-300 px-4 py-2">批次</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admission?.map((admission) => (
                                    <tr key={admission.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-4 py-2">{admission.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{admission.user_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{admission.school_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{admission.major_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{admission.batch}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}