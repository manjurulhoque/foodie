interface SpinnerProps {
    size?: "sm" | "md" | "lg" | number;
    color?: string;
    className?: string;
}

const Spinner = ({
    size = "md",
    color = "#000",
    className = "",
}: SpinnerProps) => {
    const getSize = () => {
        if (typeof size === "number") return size;

        switch (size) {
            case "sm":
                return 16;
            case "lg":
                return 32;
            case "md":
            default:
                return 24;
        }
    };

    const dimensions = getSize();

    return (
        <div className={className}>
            <svg
                width={dimensions}
                height={dimensions}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke={color}
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill={color}
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

export default Spinner;
