import { Injectable } from '@nestjs/common';
import { CryptoService } from 'src/auth/crypto_service';
import { AuthCenterdrizzleService } from 'src/dbmodels/authcenter/authcenter.drizzle.service';
import { google_clientsInMasters, product_rolesInMasters, productsInMasters, usersInMasters } from 'src/dbmodels/drizzle/authcenter/migrations/schema';
import { eq, and, sql } from 'drizzle-orm';
import { retry } from 'rxjs';
import { ApiResponse } from 'Util/APiResponse';

@Injectable()
export class MastersService {
    constructor(private readonly authdb: AuthCenterdrizzleService) { }

    async getProductWithRoles() {
        const products = await this.authdb.db.select({
            product: productsInMasters.name,
            description: productsInMasters.description,
            client_id: google_clientsInMasters.client_id,
            client_secret: google_clientsInMasters.client_secret,
            redirect_url: google_clientsInMasters.redirect_uri,
            success_url: google_clientsInMasters.authorised_url,
            unauthorised_url: google_clientsInMasters.unauthorised_url,
            roles: sql`json_agg(
                json_build_object(
                  'role_id', ${product_rolesInMasters.id},
                  'role_description', ${product_rolesInMasters.description},
                  'role', ${product_rolesInMasters.role}
                )
              )`
        }).from(productsInMasters)
            .innerJoin(product_rolesInMasters, and(eq(productsInMasters.id, product_rolesInMasters.product_id)))
            .innerJoin(google_clientsInMasters, and(eq(productsInMasters.id, google_clientsInMasters.product_id)))
            .where(and(eq(productsInMasters.is_active, true), eq(product_rolesInMasters.is_active, true), eq(google_clientsInMasters.is_active, true)))
            .groupBy(
                productsInMasters.id,
                google_clientsInMasters.client_id,
                google_clientsInMasters.client_secret,
                google_clientsInMasters.redirect_uri,
                google_clientsInMasters.authorised_url,
                google_clientsInMasters.unauthorised_url
            );

        return ApiResponse.ReturnResponse(200, "Success", {
            products: products
        });
    }

}
