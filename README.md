# LL

Ceci est une librairie permettant de creer un scanner et un parser se basant sur les principes des grammaires [LL(k)](https://en.wikipedia.org/wiki/LL_grammar).

## Comment l'utiliser ?

```ts
import {scanner, LL, parser} from "@ronico.billy/ll";
```

### Scanner

Pour définir un scanner, on doit définir la liste des lexems.
Un lexem est un symbole terminal de notre langage.

```ts
scanner(lexems: Lexem[], text: string) => Token[] | ErrorLexical
```

#### Interface

```ts
interface Lexem {
    name: string; // Le nom du Lexem (Permet de l'identifier).
    value: string; // Le regex correspondant.
    extensible?: true; // Vrai si le regex est extensible c'est à dire que le prochain caractère peut appartenir à ce même regex.
}

interface Token {
    lexem: Lexem; // Le lexem matché
    value: string; // La valeur matché
}

export interface ErrorLexical {
    line: number; // La ligne contenant l'érreur.
    col: number; // La colonne contenant l'érreur.
    unknownChar: string; // Le caractère non matché.
    stringWithColored: string; // L'érreur sous format string.
}
```  

##### Exemple

```ts
const lexems: Lexem[] = [
    {
        name: "OpenBrace",
        value: "^\\{$",
    },
    {
        name: "CloseBrace",
        value: "^\\}$",
    },
    {
        name: "TwoPoint",
        value: "^\\:$",
    },
    {
        name: "InterogationTwoPoint",
        value: "^\\?\\:$",
    },
    {
        name: "Separator",
        value: "^\\;$",
    },
    {
        name: "Blank",
        value: "^(( +)|(\\n+)|(\\t+))$",
        extensible: true,
    },
    {
        name: "TypeBase",
        value: "^(number|string|boolean|null|undefined)$",
    },
    {
        name: "Key",
        value: "^((_[a-zA-Z0-9_]*)|([a-zA-Z][a-zA-Z0-9_]*))$",
        extensible: true,
    },
    {
        name: "Array",
        value: "^\\[\\]$",
        extensible: true,
    },
    {
        name: "Pipe",
        value: "^\\|$",
    },
    {
        name: "OpenParenthesis",
        value: "^\\($",
    },
    {
        name: "CloseParenthesis",
        value: "^\\)$",
    },
];

parser(lexems, "{x: (number[]|string)[];}")
```

