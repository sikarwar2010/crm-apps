import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <UserButton />
        </div>
    );
}
