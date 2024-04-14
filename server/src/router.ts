import { app } from "./main";
import {
    CreateAccount,
    DeleteAccount,
    GetAccount,
    GetAccounts, GetCategoriesOfUser,
    GetOperationsOfUser,
    Login,
    UpdateAccount,
    AddToBalance
} from "./controllers/account";

app.get("/accounts", GetAccounts);
app.get("/accounts/:token", GetAccount);
app.post("/accounts/login", Login);
app.post("/accounts", CreateAccount);
app.put("/accounts/:token", UpdateAccount);
app.put("/accounts/:token/balance", AddToBalance);
app.delete("/accounts/:token", DeleteAccount);

app.get("/accounts/:token/operations", GetOperationsOfUser);
app.get("/accounts/:token/categories", GetCategoriesOfUser);

import {CreateCategory, DeleteCategory, GetCategories, GetCategory, UpdateCategory} from "./controllers/category";

app.get("/categories", GetCategories);
app.get("/categories/:token", GetCategory);
app.post("/categories", CreateCategory);
app.put("/categories/:token", UpdateCategory);
app.delete("/categories/:token/:id", DeleteCategory);


import {CreateOperation, DeleteOperation, GetOperation, GetOperations, UpdateOperation} from "./controllers/operation";

app.get("/operations", GetOperations);
app.get("/operations/:token", GetOperation);
app.post("/operations", CreateOperation);
app.put("/operations/:token", UpdateOperation);
app.delete("/operations/:token", DeleteOperation);

