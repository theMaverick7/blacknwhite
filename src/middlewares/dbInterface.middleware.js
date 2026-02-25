import Document from '../models/documents.model.js';


export default function (req, res, next) {
    req.dbInterface = new Document(req.params.user_id);
    next();
}