import {app} from '../src/main'
import request from 'supertest'
import {getToken} from "../src/utils";
import {SpendMoney} from "../src/controllers/account";
describe("test account endpoints",()=>{
    let token: string;

    beforeAll(async () => {
        token = await getToken();
    });
    it("test get all account",async()=>{
        const res = await request(app)
            .get('/accounts')
        expect(res.status).toBe(200)
    })
    it("post account",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                username:"puneeth",
                password:"littlePassword"
            })
        if (res.body.token !== undefined)
            token = res.body.token;
        expect(res.status).toBe(200)

    })
    it("test get single account",async()=>{
        const res = await request(app)
            .get('/accounts/'+token)
        expect(res.status).toBe(200)
        console.log(token)
    })
    it("update account",async()=>{
        const res = await request(app)
            .put('/accounts/'+token)
            .send({
                username:"puneeth",
                password:"littlePassword"
            })
        expect(res.status).toBe(200)
    })
    it("delete account",async()=>{
        const res = await request(app)
            .delete('/accounts/'+token)
        expect(res.status).toBe(200)
    })
    it("fail test post account",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                username:"puneeth",
            })
        expect(res.status).toBe(500)
    })
    it("fail password too short post account",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                username:"puneeth",
                password:"short"
            })
        expect(res.status).toBe(500)
    })
    it("fail password too long post account",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                username:"puneeth",
                password:"longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
            })
        expect(res.status).toBe(500)
    })
    it("fail password too long post account",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                password:"longlonglonglonglong"
            })
        expect(res.status).toBe(500)
    })
    it(" invalid token get account",async()=>{
        const res = await request(app)
            .get('/accounts/'+"invalidtoken")
        expect(res.status).toBe(500)
    })
    it(" invalid token put account",async()=>{
        const res = await request(app)
            .put('/accounts/'+"invalidtoken")
            .send({
                username:"puneeth",
                password:"littlePassword"
            })
        expect(res.status).toBe(500)
    })
    it(" invalid token delete account",async()=>{
        const res = await request(app)
            .delete('/accounts/'+"invalidtoken")
        expect(res.status).toBe(500)
    })
    it(" invalid token get account",async()=>{
        const res = await request(app)
            .get('/accounts/'+"invalidtoken")
        expect(res.status).toBe(500)
    })
    it("get operations account",async()=>{
        const res = await request(app)
            .get('/accounts/'+token+"/operations")
        expect(res.status).toBe(200)
    })
    it("invalid token get operations account",async()=>{
        const res = await request(app)
            .get('/accounts/'+"invalidtoken"+"/operations")
        expect(res.status).toBe(500)
    })
    it("get categories account",async()=>{
        const res = await request(app)
            .get('/accounts/'+token+"/categories")
        expect(res.status).toBe(200)
    })
    it("invalid token get categories account",async()=>{
        const res = await request(app)
            .get('/accounts/'+"invalidtoken"+"/categories")
        expect(res.status).toBe(500)
    })
    it("create account too long username",async()=>{
        const res = await request(app)
            .post('/accounts')
            .send({
                username:"puneetheakzjelakjealkjealjelakzjelakjealzjealkejalkzje",
                password:"littlePassword"
            })
        expect(res.status).toBe(500)
    })
})