import { useLocalStorage } from "usehooks-ts";

export const useToken = () => {
    const [token, setToken, removeToken] = useLocalStorage("token", null, {
        deserializer: (v) => v,
    });

    const isTokenAvailable = Boolean(token);
    return {
        token,
        setToken,
        removeToken,
        isTokenAvailable,
    };
};