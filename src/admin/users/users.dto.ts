import { ApiProperty } from "@nestjs/swagger";

export class AddUser {

    @ApiProperty()
    name: string

    @ApiProperty()
    email: string

    @ApiProperty()
    mobile_number: string

    @ApiProperty()
    product_id: number

    @ApiProperty()
    product_role_id: number
}

export class MapUserToProduct {
    @ApiProperty()
    user_code: string

    @ApiProperty()
    product_id: number

    @ApiProperty()
    product_role_id: number

}