import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pluralize or singularize text on input count argument.
 * 
 * Usage:
 * {{ value.count | plural: 'singularLabel' }}
 * or
 * {{ value.count | plural: 'singularLabel':'pluralLabel' }}
 * or
 * {{ value.count | plural: 'singularLabel':'':false }} to not include input in the output string
 * 
 * Programmatic:
 * new PluralPipe().transform(value.count, 'singularLabel', 'pluralLabel', true)
 * 
 * @param input the count/number
 * @param singularLabel the singular output label text (when input count is 1)
 * @param pluralLabel the plural output label text (when input count is 0 or more than 1); default is ''
 * @param includeInput set to true to include input in the resulting string, otherwise false; default is true
 */
@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
    transform(input: number, singularLabel: string, pluralLabel: string = '', includeInput: boolean = true): string {
        input = input || 0;

        if (input === 1) {
            return includeInput ? `${input} ${singularLabel}` : singularLabel;
        } else if (pluralLabel) {
            return includeInput ? `${input} ${pluralLabel}` : pluralLabel;
        } else {
            return includeInput ? `${input} ${singularLabel}s` : `${singularLabel}s`;
        }
    }
}