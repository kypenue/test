import { Avatar, Flex, Tooltip } from "antd";
import Link from "next/link";
import s from "../style.module.scss";
import { UserOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

export interface ParticipantProps {
    userId?: number;
    photo?: string;
    login?: string;
    onSupport?: () => void;
    isSupported?: boolean;
    isButtonDisabled?: boolean;
    isBetAllowed: boolean;
}

export const Participant = ({
    userId,
    photo,
    login,
    onSupport,
    isSupported = false,
    isButtonDisabled = false,
    isBetAllowed,
}: ParticipantProps) => {
    
    const buttonVariants = {
        tap: {
            scale: isButtonDisabled || isSupported ? 1 : 0.95,
        },
        supported: {
            scale: 1.2,
            transition: { duration: 0.3 },
        },
    };

    const handleOnSupport = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!isSupported && !isButtonDisabled) {
            onSupport?.();
        }
    };

    return (
        <Flex justify={"space-between"} align={"center"}>
            <Link href={`/account/${userId}`} className={s.avatar}>
                <Avatar
                    size={24}
                    icon={
                        photo ? (
                            <img src={photo} alt={"Аватарка"} />
                        ) : (
                            <UserOutlined />
                        )
                    }
                />{" "}
                {login}
            </Link>
            {isBetAllowed && <Tooltip title={!isSupported && !isButtonDisabled ? '💪 Поддержать' : ''}>
                <motion.div
                    initial={isSupported ? "supported" : {}}
                    animate={isSupported ? "supported" : {}}
                    whileTap="tap"
                    variants={buttonVariants}
                >
                    <button 
                        className={`${s.supportButton} ${isSupported ? s.supportedButton : ""}`}
                        onClick={handleOnSupport}
                        disabled={isButtonDisabled}
                        type="button"
                    >
                        ⌃
                    </button>
                </motion.div>
            </Tooltip>}
        </Flex>
    );
};
