import Image from "next/image";

interface EmptyStateProps {
    title: string;
    description: string;
    image?: string;
}

export function EmptyState({
    title,
    description,
    image = "/img/empty-menu.svg",
}: EmptyStateProps) {
    return (
        <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Image
                        src={image}
                        alt="Empty state illustration"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                    />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
