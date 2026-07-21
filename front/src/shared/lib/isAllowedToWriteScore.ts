export const isAllowedToWriteScore = (status: number) => {
    if (status === 2 || status > 4) {
        return false;
    }
    return true;
};
