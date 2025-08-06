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
    await db
        .insert(users)
        .values({
            clerkId: user.clerkId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        })
        .returning({ clerkClientId: users?.clerkId });

    // revalidatePath("/");
};
