"use client";
import { Suspense } from "react";
import { ResetPassword } from "@/components/ResetPassword";

const VerifyPage = () => {
    return (
        <Suspense>
            <div style={{ textAlign: "center" }}>
                <ResetPassword />
            </div>
        </Suspense>
    );
};

export default VerifyPage;