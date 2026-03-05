import { memo } from "react"

export const MinimizeIcon = memo(({ className, ...props }: React.ComponentPropsWithoutRef<"svg">) => {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M4 14h6v6" />
            <path d="M20 10h-6V4" />
            <path d="M14 10l7-7" />
            <path d="M3 21l7-7" />
        </svg>
    )
})

MinimizeIcon.displayName = "MinimizeIcon"
