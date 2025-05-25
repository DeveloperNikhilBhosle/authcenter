import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AuthCenterdrizzleService } from 'src/dbmodels/authcenter/authcenter.drizzle.service';
import { google_clientsInMasters, productsInMasters, user_google_profileInMasters, user_productsInMasters, usersInMasters } from 'src/dbmodels/drizzle/authcenter/migrations/schema';
import { eq, and } from 'drizzle-orm';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserauthService {
    constructor(private readonly auth: AuthCenterdrizzleService, private readonly httpService: HttpService, private jwtService: JwtService,) { }

    async googleInitiate(productId: number, productAuthId: string) {
        const product = await this.auth.db.select({
            client_id: google_clientsInMasters.client_id,
            client_secret: google_clientsInMasters.client_secret,
            redirect_url: google_clientsInMasters.redirect_uri
        }).from(productsInMasters)
            .innerJoin(google_clientsInMasters, and(eq(productsInMasters.id, google_clientsInMasters.product_id), eq(productsInMasters.is_active, true)))
            .where(and(eq(productsInMasters.id, productId), eq(google_clientsInMasters.auth_code, productAuthId), eq(google_clientsInMasters.is_active, true)));

        if (!product) throw new NotFoundException('Product not found');

        const stateObject = {
            productId: productId,
            productAuthId: productAuthId,
        };

        console.log(stateObject, 'state Object');

        const state = encodeURIComponent(JSON.stringify(stateObject));
        const googleOAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        googleOAuthUrl.searchParams.set('client_id', product[0].client_id);
        googleOAuthUrl.searchParams.set('redirect_uri', product[0].redirect_url);
        googleOAuthUrl.searchParams.set('response_type', 'code');
        googleOAuthUrl.searchParams.set('scope', 'openid profile email');
        googleOAuthUrl.searchParams.set('state', state);

        console.log(googleOAuthUrl.href, 'googleOAuthUrl');

        return googleOAuthUrl.href;

    }

    async googleCallback(productId: string, productAuthId: string, code: string) {

        console.log(code, "code");

        const client = await this.auth.db.select({
            client_id: google_clientsInMasters.client_id,
            client_secret: google_clientsInMasters.client_secret,
            redirect_url: google_clientsInMasters.redirect_uri,
            un_authorised_url: google_clientsInMasters.unauthorised_url,
            authorised_url: google_clientsInMasters.authorised_url
        }).from(productsInMasters)
            .innerJoin(google_clientsInMasters, and(eq(productsInMasters.id, google_clientsInMasters.product_id), eq(productsInMasters.is_active, true)))
            .where(and(eq(productsInMasters.id, Number(productId)), eq(google_clientsInMasters.auth_code, productAuthId), eq(google_clientsInMasters.is_active, true)));

        if (!client) throw new NotFoundException('Product not found');

        console.log(client, 'client found');

        const token = await this.GetGoogleToken(code, client[0].client_id, client[0].client_secret, client[0].redirect_url);

        const accessToken = token.access_token;

        console.log(accessToken, 'access token');

        const userInfo = await this.GetGoogleProfile(accessToken);

        console.log(userInfo, 'userinfo');

        // Find or create user
        let user = await this.auth.db.select().from(usersInMasters).where(and(eq(usersInMasters.email, userInfo.email), eq(usersInMasters.is_active, true)));

        //#region Save Google Profile

        const oldGoogleProfile = await this.auth.db.select().from(user_google_profileInMasters)
            .where(and(eq(user_google_profileInMasters.email, userInfo.email), eq(user_google_profileInMasters.is_active, true)));

        oldGoogleProfile.forEach(async g => {
            g.is_active = false;
            await this.auth.db.update(user_google_profileInMasters).set(g).where(and(eq(user_google_profileInMasters.id, g.id)));
        });

        const obj = {
            google_id: userInfo.id,
            email: userInfo.email,
            verified_email: userInfo.verified_email,
            name: userInfo.name,
            given_name: userInfo.given_name,
            family_name: userInfo.family_name,
            picture: userInfo.picture,
            hd: userInfo.hd
        }
        await this.auth.db.insert(user_google_profileInMasters).values(obj);

        //#endregion

        if (user.length == 0) {
            return client[0].un_authorised_url;
        } else {
            let userObj = user[0];
            userObj.email_verified = true;

            await this.auth.db.update(usersInMasters).set(userObj).where(and(eq(usersInMasters.id, userObj.id)));
        }

        const hasAccess = await this.auth.db.select().from(user_productsInMasters)
            .where(and(eq(user_productsInMasters.user_code, user[0].code), eq(user_productsInMasters.is_active, true), eq(user_productsInMasters.product_id, Number(productId))));

        if (hasAccess.length == 0) //throw new ForbiddenException('Access denied to this product'); // Redirect to same product 401 Page 
        {
            return client[0].un_authorised_url;
        }

        const tokens = await this.generateTokens({
            user_code: user[0].code.toString(),
            role: "User"
        });
        const redirectURL = client[0].authorised_url + "?token=" + tokens.access_token + "&refresh_token=" + tokens.refresh_token;
        console.log(redirectURL, 'redirectURL');
        return redirectURL;
    }

    async GetGoogleToken(code: string, client_id: string, client_secret: string, redirect_url: string) {
        const axios = require('axios');
        let data = JSON.stringify({
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": redirect_url,
            "grant_type": "authorization_code"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://oauth2.googleapis.com/token',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const res = await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                return response.data
            })
            .catch((error) => {
                console.log(error);
            });

        return res;

    }

    async GetGoogleProfile(beared_token: string) {
        const axios = require('axios');

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.googleapis.com/oauth2/v2/userinfo',
            headers: {
                'Authorization': 'Bearer ' + beared_token
            }
        };

        const res = await axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
        return res;

    }

    async generateTokens(payload: { user_code: string; role: string }) {
        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d', // 1 day
        });

        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            // no expiresIn means it won't expire (or use a very long time like 30d)
        });

        return {
            access_token,
            refresh_token,
        };
    }

    async refreshAccessToken(refresh_token: string) {
        try {
            const payload = this.jwtService.verify(refresh_token, {
                secret: process.env.JWT_SECRET,
            });

            const newAccessToken = this.jwtService.sign(
                { user_code: payload.user_code, role: payload.role },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '1d',
                },
            );

            return { access_token: newAccessToken };
        } catch (err) {
            throw new Error('Invalid refresh token');
        }
    }



}
