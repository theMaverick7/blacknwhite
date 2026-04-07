import Account from '../models/account.model.js';
import Document from '../models/documents.model.js';

export function documentDbInterface(req, res, next) {
    req.documentDbInterface = new Document(req.params?.user_id);
    next();
}

export function accountDbInterface(req, res, next) {
    req.accountDbInterface = new Account(req.params?.account_id);
    next();
}