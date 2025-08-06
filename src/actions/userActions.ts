"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/index";
import { users } from "@/db/schema";

interface User {
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
}

export const addUser = async (user: User) => {
    try {
        console.log("Attempting to insert user:", user);

        const result = await db
            .insert(users)
            .values({
                clerkId: user.clerkId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            })
            .returning({
                id: users.id,
                clerkId: users.clerkId,
                email: users.email
            });

        console.log("User inserted successfully:", result);

        // Uncomment if you need to revalidate paths
        // revalidatePath("/");

        return { success: true, data: result[0] };
    } catch (error) {
        console.error("Error inserting user:", error);

        // Handle specific database errors
        if (error instanceof Error) {
            if (error.message.includes('duplicate key')) {
                console.log("User with this clerk ID or email already exists");
                return { success: false, error: "User already exists" };
            }
        }

        throw error; // Re-throw unexpected errors
    }
};
