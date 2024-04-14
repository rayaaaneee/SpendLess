import {app} from '../src/main'
import request from 'supertest'
import {getToken} from '../src/utils';

describe("test operation endpoints",()=>{
    let token: string;

    beforeAll(async () => {
        token = await getToken();
    });
    it("test get all operation",async()=>{
        const res = await request(app)
            .get('/operations')
        expect(res.status).toBe(200)
    })
    it("post operation",async()=>{
        const res = await request(app)
            .post('/operations')
            .send({
                price:30,
                date:"2021-05-05",
                category_id:2,
                token:token
            })
        expect(res.status).toBe(200)
    })
    it("test get single operation",async()=>{
        const res = await request(app)
            .get('/operations/'+token)
        expect(res.status).toBe(200)
    })
    it("update operation",async()=>{
        const res = await request(app)
            .put('/operations/'+token)
            .send({
                price:39,
                date:"2021-05-05",
                category_id:1,
                user_id:1
            })
        expect(res.status).toBe(200)
    })
    it("delete operation",async()=>{
        const res = await request(app)
            .delete('/operations/'+token)
        expect(res.status).toBe(200)
    })
    it("invalid token get operation",async()=>{
        const res = await request(app)
            .get('/operations/'+"invalidtoken")
        expect(res.status).toBe(500)
    })
    it("invalid token post operation",async()=>{
        const res = await request(app)
            .post('/operations')
            .send({
                price:30,
                date:"2021-05-05",
                category_id:2,
                token:"invalidtoken"
            })
        expect(res.status).toBe(500)
    })
    it("invalid token update operation",async()=>{
        const res = await request(app)
            .put('/operations/'+"invalidtoken")
            .send({
                price:39,
                date:"2021-05-05",
                category_id:1,
                user_id:1
            })
        expect(res.status).toBe(500)
    })
    it("invalid token delete operation",async()=>{
        const res = await request(app)
            .delete('/operations/'+"invalidtoken")
        expect(res.status).toBe(500)
    })

})
