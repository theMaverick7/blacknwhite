import * as bcrypt from 'bcrypt';


export async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export async function comparePassword(input, hashed) {
    return await bcrypt.compare(input, hashed);
}