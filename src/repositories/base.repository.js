export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findById(id, attributes = undefined, options = {}) {
        return this.model.findByPk(id, { attributes: attributes, ...options });
    }

    async findOne(where, options = {}) {
        return this.model.findOne({ where, ...options });
    }

    async findAll(where = {}, attributes = undefined, options = {}) {
        return this.model.findAll({ where, attributes: attributes, ...options });
    }

    async create(data, options = {}) {
        return this.model.create(data, options);
    }

    async update(data, where = {}, options = {}) {
        const [affectedCount] = await this.model.update(data, {
            where,
            ...options
        });
        return affectedCount;
    }

    async delete(where, options = {}) {
        return this.model.destroy({ where, ...options });
    }
}