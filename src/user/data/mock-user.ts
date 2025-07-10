import { User } from "../entities/user.entity";


export const mockUsers: User[] = [
    {
        id: 1,
        email: "jane@mail.com",
        name: "Jane",
        phone: '082312344329',
        number_ktp: '38193456',
        password: "jane123",
        role: 'admin'
    },
    {
        id: 2,
        email: "john@mail.com",
        name: "John Doe",
        phone: '082314356329',
        number_ktp: '32133246',
        password: "john123",
        role: 'customer'
    }
]