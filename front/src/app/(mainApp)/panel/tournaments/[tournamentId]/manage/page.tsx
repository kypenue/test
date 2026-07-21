"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ManagePage = () => {
    const router = useRouter();
    useEffect(() => {
        router.replace("./manage/participants");
    }, []);
    return <div></div>;
};

export default ManagePage;
