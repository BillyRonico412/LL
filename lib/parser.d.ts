import { ErrorSyntax, LLInterface, ParseInfo, Token } from "./interface";
export declare const parser: (LL: LLInterface, pop?: (term: string, value: string) => void, ignoreTerms?: string[]) => (tokens: Token[]) => {
    res: boolean | ErrorSyntax;
    parseInfos: ParseInfo[];
};
