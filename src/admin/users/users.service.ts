import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoService } from 'src/auth/crypto_service';
import { AuthCenterdrizzleService } from 'src/dbmodels/authcenter/authcenter.drizzle.service';
import { AddUser, MapUserToProduct } from './users.dto';
import { product_rolesInMasters, productsInMasters, user_productsInMasters, usersInMasters } from 'src/dbmodels/drizzle/authcenter/migrations/schema';
import { eq, and, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from 'Util/APiResponse';


@Injectable()
export class UsersService {
    constructor(private readonly authdb: AuthCenterdrizzleService
        , private readonly cryptoService: CryptoService) { }


    async AddUser(ip: AddUser) {

        const hashEmail = this.cryptoService.hash(ip.email);

        const old = await this.authdb.db.select().from(usersInMasters)
            .where(and(eq(usersInMasters.email_hash, hashEmail)
                , eq(usersInMasters.is_active, true)));

        if (old.length > 0) {
            throw new BadRequestException("User Already Exists with same email");
        }

        const new_user_code = uuidv4();
        var userObj = {
            code: new_user_code,
            email: this.cryptoService.encrypt(ip.email),
            mobile_number: this.cryptoService.encrypt(ip.mobile_number),
            created_at: sql`CURRENT_TIMESTAMP`,
            updated_at: sql`CURRENT_TIMESTAMP`,
            mobile_hash: this.cryptoService.hash(ip.mobile_number),
            email_hash: this.cryptoService.hash(ip.email)
        }

        const user = await this.authdb.db.insert(usersInMasters).values(userObj).returning();

        var userProductObj = {
            user_code: new_user_code,
            product_id: ip.product_id,
            role_id: ip.product_role_id,
            created_at: sql`CURRENT_TIMESTAMP`,
            updated_at: sql`CURRENT_TIMESTAMP`,
        }

        await this.authdb.db.insert(user_productsInMasters).values(userProductObj);

        return ApiResponse.ReturnResponse(200, "User Created Successfully", {
            user_code: new_user_code,
            user_id: user[0].id
        })

    }

    async MapUserProduct(ip: MapUserToProduct) {
        const product = await this.authdb.db.select().from(productsInMasters)
            .innerJoin(product_rolesInMasters, and(eq(productsInMasters.id, product_rolesInMasters.product_id)))
            .where(and(eq(productsInMasters.is_active, true), eq(product_rolesInMasters.is_active, true)));


        if (product.length == 0) {
            throw new BadRequestException("Invalid Product and Role Combination");
        }

        const user = await this.authdb.db.select()
            .from(usersInMasters)
            .where(and(eq(usersInMasters.code, ip.user_code), eq(usersInMasters.is_active, true)));


        if (user.length == 0) {
            throw new BadRequestException("User is not available or not active in system!")
        }

        const mapping = await this.authdb.db.select().from(user_productsInMasters)
            .where(and(eq(user_productsInMasters.user_code, ip.user_code), eq(user_productsInMasters.product_id, ip.product_id)
                , eq(user_productsInMasters.role_id, ip.product_role_id), eq(user_productsInMasters.is_active, true)));


        console.log(mapping.length, 'mapping lenhth')
        if (mapping.length > 0) {
            throw new BadRequestException("Mapping is already there in system!");
        }

        var userProductObj = {
            user_code: ip.user_code,
            product_id: ip.product_id,
            role_id: ip.product_role_id,
            created_at: sql`CURRENT_TIMESTAMP`,
            updated_at: sql`CURRENT_TIMESTAMP`,
        }

        await this.authdb.db.insert(user_productsInMasters).values(userProductObj);

        return ApiResponse.ReturnResponse(200, "User Mapped Successfully !");


    }

    async UnMapUserProduct(ip: MapUserToProduct) {

        const mapping = await this.authdb.db.select().from(user_productsInMasters)
            .where(and(eq(user_productsInMasters.user_code, ip.user_code), eq(user_productsInMasters.product_id, ip.product_id)
                , eq(user_productsInMasters.role_id, ip.product_role_id), eq(user_productsInMasters.is_active, true)));
        if (mapping.length == 0) {
            throw new BadRequestException("Mapping is already inactive in system!");
        }

        var userProductObj = mapping[0];
        userProductObj.is_active = false;
        userProductObj.updated_at = new Date().toISOString()

        console.log(userProductObj.updated_at, 'userProductObj.updated_at');

        await this.authdb.db.update(user_productsInMasters).set(userProductObj)
            .where(and(eq(user_productsInMasters.user_code, userProductObj.user_code), eq(user_productsInMasters.product_id, userProductObj.product_id)
                , eq(user_productsInMasters.role_id, userProductObj.role_id), eq(user_productsInMasters.is_active, true)));

        return ApiResponse.ReturnResponse(200, "User UnMapped Successfully !");


    }
}
