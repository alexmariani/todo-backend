import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, ValidationArguments } from "class-validator";
import { getItalianValidationMessage } from "src/validation/get-validation.message";

export class EditTodoDto {
  @IsNotEmpty({ message: (args: ValidationArguments) => getItalianValidationMessage('IsNotEmpty', args) })
  @IsString({ message: (args: ValidationArguments) => getItalianValidationMessage('isString', args) })
  @ApiProperty({
    description: 'Titolo del todo',
  })
  public readonly title: string;

  @ApiProperty({
    description: 'Stato completato',
  })
  @IsBoolean({ message: (args: ValidationArguments) => getItalianValidationMessage('isString', args) })
  public readonly completed: boolean;

  public constructor(opts?: Partial<EditTodoDto>) {
    Object.assign(this, opts);
  }

}