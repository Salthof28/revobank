import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";


// use global for use all module without register module each module
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}