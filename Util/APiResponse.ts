import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { ApiAcceptedResponse } from "@nestjs/swagger";

@Injectable()
export class ApiResponse {
    static ReturnResponse(status: number, message: string, object?: any) {
        if (status == 200) {
            return { status: 201, message: message, data: object };
        } else if (status == 201) {
            return ApiAcceptedResponse(object);
        } else if (status == 400) {
            return new BadRequestException({ remark: message });
        } else if (status == 403) {
            return new ForbiddenException({ remark: message });
        } else if (status == 401) {
            return new UnauthorizedException({ remark: message });
        } else {
            return new InternalServerErrorException({ remark: message });
        }
    }
}