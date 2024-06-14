import { IsNotEmpty, IsString, MaxLength, MinLength, ValidationArguments } from "class-validator";
import { UserDto } from "./user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { getItalianValidationMessage } from "src/validation/get-validation.message";

export class PostUserDto {
    @IsString({ message: (args: ValidationArguments) => getItalianValidationMessage('isString', args) })
    @IsNotEmpty({ message: (args: ValidationArguments) => getItalianValidationMessage('IsNotEmpty', args) })
    @MinLength(5, { message: (args: ValidationArguments) => getItalianValidationMessage('minLength', args) })
    @MaxLength(20, { message: (args: ValidationArguments) => getItalianValidationMessage('maxLength', args) })
    @ApiProperty({
        description: 'Username utente',
    })
    public readonly username: string;

    @IsString({ message: (args: ValidationArguments) => getItalianValidationMessage('isString', args) })
    @IsNotEmpty({ message: (args: ValidationArguments) => getItalianValidationMessage('IsNotEmpty', args) })
    @MinLength(5, { message: (args: ValidationArguments) => getItalianValidationMessage('minLength', args) })
    @MaxLength(20, { message: (args: ValidationArguments) => getItalianValidationMessage('maxLength', args) })
    @ApiProperty({
        description: 'Password utente',
    })
    public readonly password: string;

    public constructor(opts?: Partial<UserDto>) {
        Object.assign(this, opts);
    }
}