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
    },[]);

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

    // 
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



    return (
        <>
            <div className="relative z-[1] w-full h-[900px] flex flex-col justify-center items-center text-black font-bold">
                <div className="text-2xl text-center">欢迎 {adminData?.username}<br></br>你的院校是{schoolData.name} 代码是{adminData?.school_id}</div>

                <div className="flex justify-center items-center flex-row text-center space-x-4">
                    <div className="w-[500px] p-6 mt-7 h-[500px] bg-white shadow-md rounded-lg text-gray-800 overflow-auto">
                        <p>志愿填报情况</p>
                        {volunteerData?.map((volunteer) => (
                            <div key={volunteer.id} className="border-b border-gray-200 py-2 ">
                                <p>志愿ID: {volunteer.id}</p>
                                <p>学生ID: {volunteer.user_id}</p>
                                <p>学校ID: {volunteer.school_id}</p>
                                <p>专业ID: {volunteer.major_id}</p>
                                <p>优先级: {volunteer.priority}</p>
                            </div>
                        ))}
                    </div>
                    <div className="w-[500px] p-6 mt-7 h-[500px] bg-white shadow-md rounded-lg text-gray-800">
                        <p>录取情况</p>
                        {admission?.map((admission) => (
                            <div key={admission.id} className="border-b border-gray-200 py-2">
                                <p>志愿ID: {admission.id}</p>
                                <p>学生ID: {admission.user_id}</p>
                                <p>学校ID: {admission.school_id}</p>
                                <p>专业ID: {admission.major_id}</p>
                                <p>优先级: {admission.batch}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}