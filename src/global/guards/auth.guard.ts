import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { Role } from "../enum/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector,  private configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // cek token login
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if(!token) throw new UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(
                token, {
                    secret: this.configService.get<string>('JWT_SERVICE')
                }
            );
            request['user'] = payload
        } catch {
            throw new UnauthorizedException
        }
        // return true

        // cek role
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if(!requiredRoles) {
            return true
        }
        const { user } = context.switchToHttp().getRequest();
        if(!user || !requiredRoles.includes(user.role_user)) throw new ForbiddenException('Access Denied');
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}