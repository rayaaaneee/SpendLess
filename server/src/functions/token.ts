import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): boolean => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY as string);
        if (!decoded) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export const getIdByToken = (token: string): number => {
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_KEY as string);
        return decoded.user_id;
    } catch (error) {
        return -1;
    }
}