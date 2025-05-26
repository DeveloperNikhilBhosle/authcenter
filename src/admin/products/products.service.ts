import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthCenterdrizzleService } from 'src/dbmodels/authcenter/authcenter.drizzle.service';
import { AddProduct, AddRoleToProduct } from './product.dto';
import { google_clientsInMasters, product_rolesInMasters, productsInMasters } from 'src/dbmodels/drizzle/authcenter/migrations/schema';
import { eq, and, sql, or, ilike } from 'drizzle-orm';
import { ApiResponse } from 'Util/APiResponse';


@Injectable()
export class ProductsService {
    constructor(private readonly authcenter: AuthCenterdrizzleService) { }

    async AddProduct(ip: AddProduct) {
        const validate = await this.authcenter.db.select().from(google_clientsInMasters)
            .where(or(eq(google_clientsInMasters.client_id, ip.client_id)
                , eq(google_clientsInMasters.client_secret, ip.client_secret)
                , eq(google_clientsInMasters.is_active, true)));

        if (validate.length > 0) {
            throw new BadRequestException("Product already exists with same ClientId and ClientSecret");
        }

        var productObj = {
            name: ip.name,
            description: ip.description,
            responsible_person: ip.responsible_email
        }

        const product = await this.authcenter.db.insert(productsInMasters).values(productObj).returning();

        var googleClientObj = {
            product_id: product[0].id,
            client_id: ip.client_id,
            client_secret: ip.client_secret,
            redirect_uri: process.env.AUTHCENTER_REDIRECT_URL ?? '',
            auth_code: ip.auth_code,
            unauthorised_url: ip.un_authorised_url,
            authorised_url: ip.success_url
        }

        await this.authcenter.db.insert(google_clientsInMasters).values(googleClientObj);

        return ApiResponse.ReturnResponse(200, "Product Added Successfully");

    }

    async AddRoleToProduct(ip: AddRoleToProduct) {

        const product = await this.authcenter.db.select().from(productsInMasters)
            .where(and(eq(productsInMasters.id, ip.product_id), eq(productsInMasters.is_active, true)));

        if (product.length == 0) {
            throw new BadRequestException("Cannot proceed: product missing or inactive!");
        }

        const validation = await this.authcenter.db.select().from(product_rolesInMasters)
            .where(and(ilike(product_rolesInMasters.role, ip.role), eq(product_rolesInMasters.product_id, ip.product_id)));

        if (validation.length > 0) {
            throw new BadRequestException("Similar role already exists for this product!");
        }

        const objPRole = {
            product_id: ip.product_id,
            role: ip.role,
            description: ip.role_description,
            responsible_person: ip.responsible_email
        }

        await this.authcenter.db.insert(product_rolesInMasters).values(objPRole);
        return ApiResponse.ReturnResponse(200, "Role linked to product successfully.");

    }
}
