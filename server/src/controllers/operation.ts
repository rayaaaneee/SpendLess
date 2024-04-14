import { db, logger } from "../main";
import { Request, Response } from "express";
import {SpendMoney, UpdateAccount, AddToBalance} from "./account";
import {getIdByToken, verifyToken} from "../functions/token";

export const GetOperations = async (req: Request, res: Response) => {
    const stmt = db.prepare("SELECT * FROM operation");
    const operations = stmt.all();
    res.json(operations);
    logger.info("GetOperations");
    return;
}

export const GetOperation = async (req: Request, res: Response) => {
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

    const user_id = getIdByToken(token);
    const stmt = db.prepare("SELECT * FROM operation WHERE id = ?");
    const operation = stmt.get(user_id);
    res.json(operation);
    logger.info("GetOperation");
    return;
}

export const CreateOperation =  async (req: Request, res: Response) => {
    const { price, date, category_id, token } = req.body;

    const tokenIsValid = verifyToken(token);
    if (!tokenIsValid) {
        logger.error("Token is not valid !");
        res.status(500).send({
            message: 'Token is not valid !',
            success: false
        });
        return;
    }

    const user_id = getIdByToken(token);

    const stmt = db.prepare("INSERT INTO operation (price, date, category_id, user_id) VALUES (?, ?, ?, ?)");
    stmt.run(price, date, category_id, user_id);

    SpendMoney(user_id, price);
    res.status(200).send({
        message: 'Operation created !',
        success: true
    });

    logger.info("CreateOperation");
    return;
}

export const UpdateOperation = async (req: Request, res: Response) => {
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
    const { price, date, category_id, user_id } = req.body;
    const stmt = db.prepare("UPDATE operation SET price = ?, date = ?, category_id = ?, user_id = ? WHERE id = ?");
    const info = stmt.run(price, date, category_id, user_id, id);
    res.json(info);
    logger.info("UpdateOperation");
    return;
}

export const DeleteOperation = async (req: Request, res: Response) => {
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
    const stmt = db.prepare("DELETE FROM operation WHERE id = ?");
    const info = stmt.run(id);
    res.json(info);
    logger.info("DeleteOperation");
    return;
}