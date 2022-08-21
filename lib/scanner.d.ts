import { ErrorLexical, Lexem, Token } from "./interface";
export declare const scanner: (lexems: Lexem[], text: string) => Token[] | ErrorLexical;
