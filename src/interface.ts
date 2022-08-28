/* 
    Un Lexem est un couple composé d'un nom et d'une définition en Regex (ou plusieurs)
*/

export interface Lexem {
    name: string;
    value: string;
    extensible?: true;
}

/* 
    Un token est un couple composé d'un nom et d'une valeur a été scanné.
*/
export interface Token {
    lexem: Lexem;
    value: string;
}

/* 
    Une production représenté par le terminaux et le non terminaux
*/

export interface Production {
    noTerm: string;
    sequence: string[];
}

export interface AnalysisTable {
    terms: string[];
    noTerm: string;
    production: Production;
}

export interface ErrorSyntax {
    line: number;
    col: number;
    message: string;
    stringWithColored: string; // **
}

export interface ErrorLexical {
    line: number;
    col: number;
    unknownChar: string;
    stringWithColored: string;
}

export interface Grammar {
    terms: string[];
    noTerms: string[];
    productions: Production[];
    firstSymbol: string;
}

export interface Lookahead {
    production: Production;
    value: string[][];
}

export interface LLInterface {
    k: number;
    grammar: Grammar;
    analysisTables: AnalysisTable[];
    lookaheads: Lookahead[];
    symbolStartLL: string;
    symbolEndLL: string;
}
