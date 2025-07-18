import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsDate, IsString } from "class-validator";


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsDate()
    updated_at: Date | null;
}