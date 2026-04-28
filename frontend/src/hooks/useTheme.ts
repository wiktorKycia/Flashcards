import { useState, useEffect } from 'react'

export default function useTheme()
{
    const [theme, setTheme] = useState<string>(
        () => localStorage.getItem("theme") || "light"
    )

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    function toggleTheme(){
        setTheme((prevState) => (prevState === "light" ? "dark" : "light"))
    }
    return {theme, toggleTheme}
}