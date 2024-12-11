"use client";

import AnimatedComponent from "@/component/AnimateComponent";
import { useEffect, useState } from "react";

interface volunteerData {
    user_id?: string;
    school_id?: string;
    major_id?: string;
    priority?: string;
}

interface userData {
    id?: string;
    username?: string;
    email?: string;
    score?: number;
    region?: string;
}

export default function VolunteerPage() {
    const [userId, setUserId] = useState<string | undefined>("");
    const [volunteerData, setVolunteerData] = useState<volunteerData[]>([]);


    useEffect(() => {

        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("StudentToken"));
        console.log(localStorage.getItem("StudentToken"));
        const requestOptions = {
            headers: myHeaders,
            method: "GET",
        };

        fetch("http://localhost:3001/api/user/profile", requestOptions)
            .then((response) => response.json())
            .then((result: userData) => {
                setUserId(result.id);
                console.log(result);
                // Initialize volunteer data with user ID
                setVolunteerData([
                    { user_id: result.id, school_id: "", major_id: "", priority: "1" },
                    { user_id: result.id, school_id: "", major_id: "", priority: "2" },
                    { user_id: result.id, school_id: "", major_id: "", priority: "3" },
                ]);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleChange = (index: number, field: string, value: string) => {
        const newData = [...volunteerData];
        newData[index] = { ...newData[index], [field]: value };
        setVolunteerData(newData);
    };

    const submitButtonClicked = () => {
        console.log(volunteerData);

        try {
            for (const data of volunteerData) {
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                const body = JSON.stringify(data);

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: body
                };

                fetch("http://localhost:3001/api/volunteer/add", requestOptions)
                    .then((response) => {
                        response.text();
                        if (response.status === 201) {
                            alert("志愿提交成功")
                            window.location.href = "/user/profile";
                        }
                        else {
                            alert("志愿提交失败")
                        }
                    })
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            }
        }
        catch (error) {
            console.error(error)
        }
    };

    return (
        <>
            <AnimatedComponent>
                <div className="w-full h-[900px] text-black font-bold text-center flex justify-center items-center bg-gradient-to-br from-blue-200 via-gray-100 to-gray-200">
                    <div className="w-8/12 h-5/6 bg-white border border-solid rounded-2xl shadow-sm shadow-gray-500 p-4">
                        {volunteerData.map((data, index) => (
                            <div key={index}>
                                <label htmlFor={`school-${index}`}>志愿{index + 1}</label>
                                <input
                                    type="text"
                                    name={`school-${index}`}
                                    id={`school-${index}`}
                                    placeholder="请输入学校ID"
                                    className="block w-full mt-2 p-2 border rounded"
                                    value={data.school_id || ""}
                                    onChange={(e) => handleChange(index, "school_id", e.target.value)}
                                />
                                <input
                                    type="text"
                                    name={`major-${index}`}
                                    id={`major-${index}`}
                                    placeholder="请输入专业ID"
                                    className="block w-full mt-2 p-2 border rounded"
                                    value={data.major_id || ""}
                                    onChange={(e) => handleChange(index, "major_id", e.target.value)}
                                />
                            </div>
                        ))}
                        <button
                            className="block w-full mt-2 p-2 bg-blue-500 text-white rounded"
                            onClick={submitButtonClicked}
                        >
                            提交
                        </button>
                    </div>
                </div>
            </AnimatedComponent>
        </>
    );
}