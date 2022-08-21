export interface Lexem {
    name: string;
    value: string;
    extensible?: true;
}
export interface Token {
    lexem: Lexem;
    value: string;
}
export declare enum TypeNode {
    TypeObject = 0,
    Key = 1,
    Compo = 2,
    TypeBase = 3
}
export interface Node {
    parent: Node | null;
    type: TypeNode;
    value: string;
    childrens: Node[];
    isArray: boolean;
    isRequired: boolean;
}
export declare class TypeObject implements Node {
    type: TypeNode.TypeObject;
    value: string;
    childrens: Key[];
    isArray: false;
    parent: Node | null;
    isRequired: boolean;
    constructor(parent: Node | null, childrens: Key[]);
}
export declare class Key implements Node {
    parent: TypeObject;
    type: TypeNode.Key;
    value: string;
    childrens: Compo[];
    isArray: false;
    isRequired: boolean;
    constructor(parent: TypeObject, value: string, childrens: Compo[]);
}
export declare class Compo implements Node {
    parent: Key | Compo;
    type: TypeNode.Compo;
    value: string;
    childrens: (Compo | TypeObject | TypeBase)[];
    isArray: false;
    isRequired: boolean;
    constructor(parent: Key | Compo, childrens: (Compo | TypeObject | TypeBase)[]);
}
export declare class TypeBase implements Node {
    parent: Compo;
    type: TypeNode.TypeBase;
    value: "number" | "string" | "boolean";
    childrens: [];
    isArray: false;
    isRequired: boolean;
    constructor(parent: Compo, value: "number" | "string" | "boolean");
}
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
    stringWithColored: string;
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
export interface LLInterface {
    k: number;
    grammar: Grammar;
    analysisTables: AnalysisTable[];
    lookahead: (k: number, production: Production) => string[][];
    symbolStartLL: string;
    symbolEndLL: string;
}
