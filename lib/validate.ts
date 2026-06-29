import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export async function validateBody<T extends object>(targetClass: new () => T, body: any) {
    const instance = plainToInstance(targetClass, body);
    const errors = await validate(instance, {
        whitelist: true,
        forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
        const errorMessages = errors.map(err => ({
            property: err.property,
            constraints: err.constraints,
        }));
        return { errors: errorMessages, data: null };
    }

    return { errors: null, data: instance };
}