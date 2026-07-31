import {BaseRepository} from './base.repository.js';
import Account from '../db/models/account.model.js';

export default class AccountRepository extends BaseRepository {
    constructor() {
        super(Account);
    }

    //   async findPendingParse(limit = 50) {
    //     return this.model.findAll({
    //       where: { status: 'pending' },
    //       limit,
    //       order: [['createdAt', 'ASC']],
    //     });
    //   }

    //   async markParsed(id, ocrText, options = {}) {
    //     return this.model.update(
    //       { status: 'parsed', ocrText, parsedAt: new Date() },
    //       { where: { id }, ...options }
    //     );
    //   }
}