import { app } from './main';
import request from 'supertest';

export async function getToken(): Promise<string> {
    console.log("before all");
    const res = await request(app)
        .post('/accounts/login')
        .send({
            username: "puneeth",
            password: "littlePassword",
        });

    let token = res.body.token;
    console.log("Token login : " + token);

    if (token === undefined) {
        const res = await request(app)
            .post('/accounts')
            .send({
                username: "puneeth",
                password: "littlePassword",
            });
        token = res.body.token;
        console.log("Token insc : " + token);
    }

    return token;
}
