"use client";
import { VerifyEmail } from "@/components/VerifyEmail";
import { Suspense } from "react";

const ResetPasswordPage = () => {
    return (
        <Suspense>
            <div style={{ textAlign: "center" }}>
                <VerifyEmail />
            </div>
        </Suspense>
    );
};

export default ResetPasswordPage;