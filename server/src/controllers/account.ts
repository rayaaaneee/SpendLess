import { db, logger } from "../main";
import { Request, Response } from "express";
import * as bcrypt from 'bcrypt';
import Database from "better-sqlite3";
import jwt from 'jsonwebtoken';
import { getIdByToken, verifyToken } from "../functions/token";

export interface Account {
    id: number;
    username: string;
    password: string;
    balance: number;
}

export const GetAccounts = async (req: Request, res: Response) => {
    const stmt = db.prepare("SELECT * FROM account");
    const accounts = stmt.all();
    res.status(200).json(
        accounts
    );
    logger.info("GetAccounts");
    return;
}

export const GetAccount = async (req: Request, res: Response) => {

    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);

    const stmt = db.prepare("SELECT * FROM account WHERE id = ?");
    const account = stmt.get(id);
    res.json(account);
    logger.info("GetAccount");
    return;
}

export const UpdateAccount = async (req: Request, res: Response) => {
    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);
    const { username, balance } = req.body;
    const stmt = db.prepare("UPDATE account SET username = ?, balance = ? WHERE id = ?");
    const info = stmt.run(username, balance, id);
    res.json(info);
    logger.info("UpdateAccount");
    return;
}

export const AddToBalance = async (req: Request, res: Response) => {

    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);

    const balance: number = parseFloat(req.body.balance);
    const info = db.prepare("UPDATE account SET balance = balance + ? WHERE id = ?").run(balance, id);
    res.status(200).send({ ...info, success: true });
    logger.info("UpdateBalance");
    return;
}

export const DeleteAccount = async (req: Request, res: Response) => {
    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);

    const stmt = db.prepare("DELETE FROM account WHERE id = ?");
    const info = stmt.run(id);
    res.json(info);
    logger.info("DeleteAccount");
    return;
}

export const GetOperationsOfUser = async (req: Request, res: Response) => {
    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);

    const stmt = db.prepare("SELECT * FROM operation WHERE user_id = ?");
    const operations = stmt.all(id);
    res.json(operations);
    logger.info("GetOperationsOfUser");
    return;
}

export const GetCategoriesOfUser = async (req: Request, res: Response) => {
    const { token } = req.params;
    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const id = getIdByToken(token);

    const stmt = db.prepare("SELECT * FROM category WHERE user_id = ? OR user_id = 0");
    const categories = stmt.all(id);
    res.json(categories);
    logger.info("GetCategoriesOfUser");
    return;
}

export const SpendMoney = (account_id: number, price: number): {
    message: string,
    success: boolean
} => {
    // Sélectionnez la balance initiale
    const initialBalanceQuery = db.prepare("SELECT balance FROM account WHERE id = ?");
    const initialBalanceResult = initialBalanceQuery.get(account_id) as Account

    if (!initialBalanceResult) {
        return {
            message: 'Account not found',
            success: false
        };
    }

    const balance = initialBalanceResult.balance;
    const newBalance = balance - price;

    // Mettez à jour la balance dans la base de données
    const updateBalanceQuery = db.prepare("UPDATE account SET balance = ? WHERE id = ?");
    const updateResult = updateBalanceQuery.run(newBalance, account_id);

    if (updateResult.changes !== 1) {
        return {
            message: 'Failed to update balance',
            success: false
        };
    }

    logger.info("SpendMoney");

    return {
        message: 'Balance updated!',
        success: true
    };
}


export const verifyUsername = (username: string): {
    message: string,
    success: boolean
} => {
    if (!username) {
        logger.error("Username missing !");
        return {
            message: 'Username missing !',
            success: false
        };
    } else if (username.length > 24) {
        logger.error("Username too long !");
        return {
            message: 'Username too long !',
            success: false
        };
    } else {
        logger.info("Username changed !");
        return {
            message: 'Your username was successfully changed !',
            success: true
        }
    }
}

export const verifyPassword = (password: string): {
    message: string,
    success: boolean
} => {
    if (!password) {
        logger.error("Password missing !");
        return {
            message: 'Username or password missing !',
            success: false
        };
    } else if (password.length < 8) {
        logger.error("Password too short !");
        return {
            message: 'Password too short !',
            success: false
        }
    } else if (password.length > 64) {
        logger.error("Password too long !");
        return {
            message: 'Password too long !',
            success: false
        };
    } else {
        logger.info("Password changed !");
        return {
            message: 'Your password was successfully changed !',
            success: true
        }
    }
}

export const CreateAccount = async (req: Request, res: Response) => {

    const username: string = req.body.username;
    const password: string = req.body.password;

    const passwordResponse: {
        message: string,
        success: boolean
    } = verifyPassword(password);

    if (passwordResponse.success === false) {
        logger.error("Password error !");
        res.status(500).send(passwordResponse);
        return;
    }

    const usernameResponse: {
        message: string,
        success: boolean
    } = verifyUsername(username);

    if (usernameResponse.success === false) {
        logger.error("Username error !");
        res.status(500).send(usernameResponse);
        return;
    }

    bcrypt.hash(password, 10, (err: Error | undefined, hashedPassword: string) => {
        if (err) {
            logger.error("Error while hashing password !");
            res.status(500).send({
                message: 'Error while hashing password',
                success: false
            });
            return;
        } else {
            try {
                let result: Database.RunResult = db.prepare(`INSERT INTO account (username, password) VALUES (?, ?)`).run(username, hashedPassword);

                const accessToken = jwt.sign({ user_id: result.lastInsertRowid }, process.env.JWT_KEY as string);

                res.status(200).send({
                    message: 'You successfully registered !',
                    success: true,
                    token: accessToken
                });
                logger.info("Account created !");
                return;
            } catch (e: any) {
                if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                    logger.error("Username already taken !");
                    res.status(200).send({
                        message: 'Username already taken !',
                        success: false
                    });
                    return;
                } else {
                    logger.error("Error while registering !");
                    res.status(200).send({
                        message: 'Error while registering',
                        success: false
                    });
                    return;
                }
            }
        }
    });
}

export const Login = async (req: Request, res: Response) => {

    const username: string = req.body.username;
    const password: string = req.body.password;

    if (!username || !password) {
        logger.error("Username or password missing !");
        res.status(500).send({
            message: 'Username or password missing !',
            success: false
        });
        return;
    }

    const account: any = db.prepare("SELECT * FROM account WHERE username = ?").get(username);

    if (!account) {
        logger.error("This user does not exist !");
        res.status(500).send({
            message: 'This user does not exist !',
            success: false
        });
        return;
    }

    bcrypt.compare(password, account.password, (err: Error | undefined, result: boolean) => {
        if (err) {
            logger.error("Error while comparing password !");
            res.status(500).send({
                message: 'Error while comparing password',
                success: false
            });
            return;
        } else {
            if (result === true) {
                const accessToken = jwt.sign({ user_id: account.id }, process.env.JWT_KEY as string);

                logger.info("You successfully logged in !");
                res.status(200).send({
                    message: 'You successfully logged in !',
                    success: true,
                    token: accessToken
                });
                return;
            } else {
                logger.error("Username or password incorrect !");
                res.status(500).send({
                    message: 'Username or password incorrect !',
                    success: false
                });
                return;
            }
        }
    });
}