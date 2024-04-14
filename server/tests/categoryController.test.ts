import {app} from '../src/main'
import request from 'supertest'
import {getToken} from "../src/utils";
describe("test category endpoints",()=>{
    let token: string;

    beforeAll(async () => {
        token = await getToken();
    });
    it("test get all category",async()=>{
        const res = await request(app)
            .get('/categories')
        expect(res.status).toBe(200)
    })
    it("post category",async()=>{
        const res = await request(app)
            .post('/categories')
            .send({
                title:"Restaurants",
                user_id:2
            })
        expect(res.status).toBe(200)
    })
    it("test get single category",async()=>{
        const res = await request(app)
            .get('/categories/'+token)
        expect(res.status).toBe(200)
    })
    it("update category",async()=>{
        const res = await request(app)
            .put('/categories/'+token)
            .send({
                title:"Vivre",
                user_id:1
            })
        expect(res.status).toBe(200)
    })
    it("delete category",async()=>{
        const res = await request(app)
            .delete('/categories/'+token)
        expect(res.status).toBe(404)
    })
    it("fail test post category no title",async()=>{
        const res = await request(app)
            .post('/categories')
        expect(res.status).toBe(500)
    })
    it("fail test post category too long",async()=>{
        const res = await request(app)
            .post('/categories')
            .send({
                title:"RestaurantsRestaurantsRestaurantsRestaurantsRestaurants"
            })
        expect(res.status).toBe(500)
    })
    it("invalid token get single category",async()=>{
        const res = await request(app)
            .get('/categories/'+"invalidToken")
        expect(res.status).toBe(500)
    })
    it("invalid token update category",async()=>{
        const res = await request(app)
            .put('/categories/'+"invalidToken")
            .send({
                title:"Vivre",
                user_id:1
            })
        expect(res.status).toBe(500)
    })

})
