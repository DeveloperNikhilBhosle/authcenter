import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Injectable()
export class AddProduct {
    @ApiProperty()
    name: string

    @ApiProperty()
    description: string

    @ApiProperty()
    client_id: string

    @ApiProperty()
    client_secret: string

    @ApiProperty()
    auth_code: string

    @ApiProperty()
    un_authorised_url: string

    @ApiProperty()
    success_url: string

    @ApiProperty()
    responsible_email: string
}

export class AddRoleToProduct {
    @ApiProperty()
    product_id: number

    @ApiProperty()
    role: string

    @ApiProperty()
    role_description: string

    @ApiProperty()
    responsible_email: string

}