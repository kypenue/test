import * as yup from "yup";

const arrayOfString = yup.array().of(yup.string().required());
const arrayOfNumber = yup.array().of(yup.number().required());

export const spaceSchema = yup
    .object({
        communityId: yup.string().required(),
        title: yup.string(),
        description: yup.string(),
        social_links: arrayOfString,
        game_ids: arrayOfNumber,
        avatar_id: yup.number(),
        header_id: yup.number(),
        slug: yup.string(),
    })
    .required();
