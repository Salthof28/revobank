import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsDate, IsOptional, IsString } from "class-validator";


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsDate()
    updated_at: Date | null;
}