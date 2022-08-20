import { ErrorLexical, Lexem, Token } from "./interface";

/* 
    Une fonction qui permet de retourner une liste de Token en fonction
    des lexems définit.
    Attention: L'ordre des lexems est important
*/

const coordError = (text: string, lookHead: number) => {
    const lineText = text.slice(0, lookHead + 1).split("\n");
    const line = lineText.length;
    const col = lineText[lineText.length - 1].length;
    return { line, col };
};

export const scanner = (
    lexems: Lexem[],
    text: string
): Token[] | ErrorLexical => {
    let lookHead = 0;
    const tokens: Token[] = [];
    let lexemOnExtension: Lexem | null = null;
    for (let i = 0; i < text.length; i++) {
        const tokenLooked = text.slice(lookHead, i + 1);
        const lexemValid = lexems.find((lexem) => {
            if (new RegExp(lexem.value).test(tokenLooked)) {
                return true;
            }
            return false;
        });
        if (lexemValid) {
            if (lexemOnExtension) {
                if (lexemOnExtension.name === lexemValid.name) {
                    if (i === text.length - 1) {
                        tokens.push({
                            lexem: lexemOnExtension,
                            value: tokenLooked,
                        });
                    }
                    continue;
                } else {
                    tokens.push({
                        lexem: lexemValid,
                        value: tokenLooked,
                    });
                    lookHead = i + 1;
                    lexemOnExtension = null;
                }
            } else {
                if (!lexemValid.extensible) {
                    tokens.push({
                        lexem: lexemValid,
                        value: tokenLooked,
                    });
                    lookHead = i + 1;
                    lexemOnExtension = null;
                } else {
                    lexemOnExtension = lexemValid;
                }
            }
        } else if (lexemOnExtension) {
            tokens.push({
                lexem: lexemOnExtension,
                value: tokenLooked.slice(0, tokenLooked.length - 1),
            });
            lexemOnExtension = null;
            i--;
            lookHead = i + 1;
        }
    }

    if (lookHead !== text.length && !lexemOnExtension) {
        const myCoordError = coordError(text, lookHead);
        return {
            ...myCoordError,
            unknownChar: text.charAt(lookHead),
            stringWithColored:
                text.slice(0, lookHead) +
                "*" +
                text.charAt(lookHead) +
                "*" +
                text.slice(lookHead + 1),
        };
    }

    return tokens;
};
