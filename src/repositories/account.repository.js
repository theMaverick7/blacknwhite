import {BaseRepository} from './base.repository.js';
import Account from '../db/models/account.model.js';

export default class AccountRepository extends BaseRepository {
    constructor() {
        super(Account);
    }
}