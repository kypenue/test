import Link from "next/link";
import { NewCard } from "@/components/NewCard";
import type { GetCommunitiesResponse } from "@/services/Communities/community.model";
import { useGetProfilePhotoByIdQuery } from "@/services/User/user";
import Image from "next/image";
import s from "./style.module.scss";

type SpaceListItem = GetCommunitiesResponse["payload"][number];

function initials(text: string): string {
    const parts = text.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return text.slice(0, 2).toUpperCase();
}

const GRADIENTS = [
    "linear-gradient(135deg, #0e3a54 0%, #0b6b63 100%)",
    "linear-gradient(135deg, #2a2454 0%, #5a3b76 100%)",
    "linear-gradient(135deg, #133a7a 0%, #1b6aa2 100%)",
    "linear-gradient(135deg, #4a3c2a 0%, #9a6b34 100%)",
    "linear-gradient(135deg, #143f4a 0%, #1d6d7a 100%)",
    "linear-gradient(135deg, #2e2c4f 0%, #3f5fa8 100%)",
] as const;

function gradientForKey(key: string) {
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
        hash = (hash * 31 + key.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[idx];
}

export interface SpaceMiniCardProps {
    space: SpaceListItem;
}

export const SpaceMiniCard = ({ space }: SpaceMiniCardProps) => {
    const creatorId = String(space.creator?.id ?? "");
    const { data: creatorPhoto } = useGetProfilePhotoByIdQuery(
        { id: creatorId },
        { skip: !creatorId },
    );

    const creatorUsername = space.creator?.username ?? space.creator?.name ?? "";

    return (
        <div className={s.slideWrapper} key={space.id}>
            <NewCard
                style={{ width: "100%" }}
                cover={
                    <div
                        className={s.cover}
                        style={{
                            backgroundImage: gradientForKey(space.slug ?? space.id),
                        }}
                    >
                        <div className={s.avatar} aria-hidden>
                            {creatorPhoto ? (
                                <Image
                                    src={creatorPhoto}
                                    alt=""
                                    width={124}
                                    height={124}
                                    className={s.avatarImg}
                                />
                            ) : (
                                <span className={s.avatarText}>
                                    {initials(creatorUsername || space.title)}
                                </span>
                            )}
                        </div>
                    </div>
                }
            >
                <Link href={`/s/${space.slug ?? space.id}`}>
                    <h3 className={s.nickname} title={creatorUsername}>
                        {creatorUsername}
                    </h3>
                    <p className={s.role}>Стример</p>
                    <p className={s.desc} title={space.description}>
                        {space.description}
                    </p>
                </Link>
            </NewCard>
        </div>
    );
};
