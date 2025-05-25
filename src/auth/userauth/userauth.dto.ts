import { ApiProperty } from "@nestjs/swagger";

export class AccessToken {
    @ApiProperty()
    refresh_token: string
}