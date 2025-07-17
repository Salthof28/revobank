import { RoleUser } from "@prisma/client";

// import { RoleUser } from "generated/prisma";


export class User {
    id: number;
    email:string;
    name:string;
    phone:string;
    number_ktp:string;
    password:string;
    role_user: RoleUser;
    created_at: Date | null;
    updated_at: Date | null;
}
