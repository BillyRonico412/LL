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
    Un noeud representant un type dans l'arborescence
*/

export enum TypeNode {
    TypeObject,
    Key,
    Compo,
    TypeBase,
}

export interface Node {
    parent: Node | null;
    type: TypeNode;
    value: string;
    childrens: Node[];
    isArray: boolean;
}

export class TypeObject implements Node {
    type: TypeNode.TypeObject;
    value: string;
    childrens: Key[];
    isArray: false;
    parent: Node | null;
    constructor(parent: Node | null, childrens: Key[]) {
        this.type = TypeNode.TypeObject;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArray = false;
    }
}

export class Key implements Node {
    parent: TypeObject;
    type: TypeNode.Key;
    value: string;
    childrens: Compo[];
    isArray: false;
    constructor(parent: TypeObject, value: string, childrens: Compo[]) {
        this.type = TypeNode.Key;
        this.parent = parent;
        this.value = value;
        this.childrens = childrens;
        this.isArray = false;
    }
}

export class Compo implements Node {
    parent: Key | Compo;
    type: TypeNode.Compo;
    value: string;
    childrens: (Compo | TypeObject | TypeBase)[];
    isArray: false;
    constructor(
        parent: Key | Compo,
        childrens: (Compo | TypeObject | TypeBase)[]
    ) {
        this.type = TypeNode.Compo;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArray = false;
    }
}

export class TypeBase implements Node {
    parent: Compo;
    type: TypeNode.TypeBase;
    value: "number" | "string" | "boolean";
    childrens: [];
    isArray: false;

    constructor(parent: Compo, value: "number" | "string" | "boolean") {
        this.type = TypeNode.TypeBase;
        this.parent = parent;
        this.value = value;
        this.childrens = [];
        this.isArray = false;
    }
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

export interface LLInterface {
    k: number;
    grammar: Grammar;
    analysisTables: AnalysisTable[];
    lookahead: (k: number, production: Production) => string[][];
    symbolStartLL: string;
    symbolEndLL: string;
}
