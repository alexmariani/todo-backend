import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, ValidationArguments } from 'class-validator';
import { getItalianValidationMessage } from 'src/validation/get-validation.message';

export class AddTodoDto {
  @IsString({
    message: (args: ValidationArguments) =>
      getItalianValidationMessage('isString', args),
  })
  @ApiProperty({
    description: 'Titolo del todo',
  })
  public readonly title: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    {
      message: (args: ValidationArguments) =>
        getItalianValidationMessage('isNumber', args),
    },
  )
  @ApiProperty({
    description: 'Id utente proprietario del todo',
  })
  public readonly userId: number;

  public constructor(opts?: Partial<AddTodoDto>) {
    Object.assign(this, opts);
  }
}
