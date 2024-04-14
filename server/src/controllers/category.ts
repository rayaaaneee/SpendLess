import { getIdByToken, verifyToken } from "../functions/token";
import { db, logger } from "../main";
import { Request, Response } from "express";

export const GetCategories = async (req: Request, res: Response) => {
    const stmt = db.prepare("SELECT * FROM category");
    const categories = stmt.all();
    res.status(200).json(
        categories
    );
    logger.info("GetCategories");
    return;
}

export const GetCategory = async (req: Request, res: Response) => {
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
    const stmt = db.prepare("SELECT * FROM category WHERE id = ?");
    const category = stmt.get(id);
    res.status(200).json(
        category
    );
    logger.info("GetCategory");
    return
}

export const CreateCategory =  async (req: Request, res: Response) => {
    const { title, user_id } = req.body;

    const  result:{ message: string; success: boolean } = verifyCategoryName(title);
    let message: string = result.message;

    if (!result.success) {
        logger.error(message);
        res.status(500).json({message});
        return;
    }

    const stmt = db.prepare("INSERT INTO category (title, user_id) VALUES (?, ?)");
    const info = stmt.run(title, user_id);
    res.status(200).json(
        info
    );
    logger.info("CreateCategory");
    return;
}

export const UpdateCategory = async (req: Request, res: Response) => {
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
    const { title, user_id } = req.body;
    const stmt = db.prepare("UPDATE category SET title = ?, user_id = ? WHERE id = ?");
    const info = stmt.run(title, user_id, id);
    res.json(info);
    logger.info("UpdateCategory");
    return;
}

export const DeleteCategory = async (req: Request, res: Response) => {
    const { token, id } = req.params;
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

    const stmt = db.prepare("DELETE FROM category WHERE id = ? AND user_id = ?");
    stmt.run(id, user_id);

    res.status(200).send({
        message: 'Category deleted !',
        success: true
    });
    logger.info("DeleteCategory");
    return;
}

export const verifyCategoryName = (title: string): {
    message: string,
    success: boolean
} => {

    if (!title) {
        logger.error('Title missing !');
        return {
            message: 'Title missing !',
            success: false
        };
    } else if (title.length > 24) {
        logger.error('Title too long !');
        return {
            message: 'Title too long !',
            success: false
        };
    } else {
        logger.info('Your title was successfully changed !');
        return {
            message: 'Your title was successfully changed !',
            success: true
        };
    }
}