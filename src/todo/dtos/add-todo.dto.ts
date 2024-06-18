import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidationArguments } from 'class-validator';
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

  public constructor(opts?: Partial<AddTodoDto>) {
    Object.assign(this, opts);
  }
}
