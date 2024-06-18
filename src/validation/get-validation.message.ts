import { ValidationArguments } from 'class-validator';
import { italianValidationMessages } from './validation.message';

export function getItalianValidationMessage(
  validationType: string,
  args: ValidationArguments,
): string {
  const messageTemplate = italianValidationMessages[validationType];
  if (!messageTemplate) {
    return `Errore di validazione per il campo ${args.property}`;
  }
  return messageTemplate
    .replace('$property', args.property)
    .replace('$constraint1', args.constraints[0] ?? '');
}
