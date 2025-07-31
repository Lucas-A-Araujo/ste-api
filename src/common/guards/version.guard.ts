import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { API_VERSION_KEY } from '../decorators/api-version.decorator';

@Injectable()
export class VersionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredVersions = this.reflector.getAllAndOverride<string[]>(API_VERSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredVersions || requiredVersions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const version = this.extractVersion(request);

    if (!version) {
      throw new BadRequestException('Versão da API não especificada');
    }

    if (!requiredVersions.includes(version)) {
      throw new BadRequestException(`Versão ${version} não é suportada para este endpoint`);
    }

    return true;
  }

  private extractVersion(request: any): string | null {
    const headerVersion = request.headers['x-api-version'];
    if (headerVersion) return headerVersion;

    const urlMatch = request.url.match(/^\/v(\d+)/);
    if (urlMatch) return urlMatch[1];

    const queryVersion = request.query.version;
    if (queryVersion) return queryVersion;

    return null;
  }
} 