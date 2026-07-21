import { nothingToNull } from "@/shared/lib/nothingToNull";
import { STORAGE_KEYS } from "@/shared/constants/storage";

class StorageService {
    public readonly VERSION = "1.0.3";

    private storage = new Map<string, unknown>();

    private readonly getFromStore = <T>(key: string) => {
        const storedObjectWrapperJson = nothingToNull(
            window.localStorage.getItem(key),
        );

        if (storedObjectWrapperJson) {
            try {
                const storedObjectWrapper = JSON.parse(
                    storedObjectWrapperJson,
                ) as {
                    version: string;
                    object: T;
                };

                if (storedObjectWrapper.version !== this.VERSION) {
                    window.localStorage.removeItem(key);
                    return null;
                } else {
                    return storedObjectWrapper.object;
                }
            } catch (error: unknown) {
                return error;
            }
        } else {
            return null;
        }
    };

    private readonly store = <T>(key: string, object: T) =>
        window.localStorage.setItem(
            key,
            JSON.stringify(this.createVersionWrapper(object)),
        );

    private createVersionWrapper = <T>(object: T) => ({
        version: this.VERSION,
        object: object,
    });

    public deleteToken = (): void => {
        window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    };

    public getToken = (): string | null => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
        }
        return null;
    };
}

export const STORAGE = new StorageService();
