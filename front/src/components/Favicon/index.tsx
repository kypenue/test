import { useEffect, useState } from "react";

export default function Favicon() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial preference
        setIsDarkMode(
            window.matchMedia("(prefers-color-scheme: dark)").matches,
        );

        // Set up listener for changes
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) =>
            setIsDarkMode(e.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <link
            rel="icon"
            href={isDarkMode ? "/favicon-dark.svg" : "/favicon-light.svg"}
        />
    );
}
