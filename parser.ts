import {
    AnalysisTable,
    ErrorSyntax,
    Grammar,
    LLInterface,
    Token,
} from "./interface";

const verifArgsParser = (grammar: Grammar, analysisTables: AnalysisTable[]) =>
    grammar.noTerms.includes(grammar.firstSymbol) &&
    grammar.productions.every(
        (production) =>
            grammar.noTerms.includes(production.noTerm) &&
            production.sequence.every((it) =>
                [...grammar.terms, ...grammar.noTerms, ""].includes(it)
            )
    ) &&
    grammar.terms.every((term) =>
        grammar.noTerms.every((noTerm) => term !== noTerm)
    );

const coordError = (tokenAlreadyRead: Token[]) => {
    const text = tokenAlreadyRead.map((tok) => tok.value).join("");
    const lineText = text.split("\n");
    const line = lineText.length;
    const col = lineText[lineText.length - 1].length;
    return { line, col };
};

const waitingTokenBySymbol = (
    symbol: string,
    noTerms: string[],
    analysisTables: AnalysisTable[]
) => {
    if (noTerms.includes(symbol)) {
        const analyseTableValid = analysisTables.filter(
            (analyseTable) => analyseTable.noTerm === symbol
        );
        return analyseTableValid.map((it) => it.terms);
    } else {
        return [symbol];
    }
};

const checkFirstTwoStringArrayEquals = (
    k: number,
    as1: string[],
    as2: string[]
) => {
    if (as1.length < k || as2.length < k) {
        return false;
    }
    for (let i = 0; i < k; i++) {
        if (as1[i] !== as2[i]) {
            return false;
        }
    }
    return true;
};

export const parser = (
    LL: LLInterface,
    pop: (term: string, value: string) => void = () => {},
    ignoreTerms: string[] = []
) => {
    if (!verifArgsParser(LL.grammar, LL.analysisTables)) {
        throw new Error("Parser Error!");
    }

    const parserFunc = (
        tokens: Token[],
        symbols: string[] = [LL.symbolStartLL],
        tokenAlreadyRead: Token[] = []
    ): boolean | ErrorSyntax => {
        const tokensLL = [...tokens];
        if (tokenAlreadyRead.length === 0) {
            for (let i = 0; i < LL.k; i++) {
                tokensLL.push({
                    lexem: {
                        name: LL.symbolEndLL,
                        value: LL.symbolEndLL,
                        extensible: true,
                    },
                    value: LL.symbolEndLL,
                });
            }
        }

        if (tokensLL.length === 0 && symbols.length === 0) {
            return true;
        }
        if (
            tokensLL.length !== 0 &&
            symbols.length === 0 &&
            !tokensLL.every((tok) => ignoreTerms.includes(tok.lexem.name))
        ) {
            const myCoordError = coordError(tokenAlreadyRead);
            return {
                ...myCoordError,
                message: "Syntax Error",
                stringWithColored:
                    tokenAlreadyRead.map((tok) => tok.value).join("") +
                    "*" +
                    tokensLL.map((tok) => tok.value).join("") +
                    "*",
            };
        }

        if (tokensLL.length === 0 && symbols.length !== 0) {
            const myCoordError = coordError(tokenAlreadyRead);
            return {
                ...myCoordError,
                message:
                    "Syntax Error, Waiting [" +
                    waitingTokenBySymbol(
                        symbols[0],
                        LL.grammar.noTerms,
                        LL.analysisTables
                    ) +
                    "]",
                stringWithColored:
                    tokenAlreadyRead.map((tok) => tok.value).join("") + "* *",
            };
        }

        if (ignoreTerms.includes(tokensLL[0].lexem.name)) {
            return parserFunc(tokensLL.slice(1), symbols, [
                ...tokenAlreadyRead,
                tokensLL[0],
            ]);
        }
        if (LL.grammar.noTerms.includes(symbols[0])) {
            const analyseTableValid = LL.analysisTables.find(
                (analyseTable) =>
                    checkFirstTwoStringArrayEquals(
                        LL.k,
                        analyseTable.terms,
                        tokensLL.map((token) => token.lexem.name)
                    ) && analyseTable.noTerm === symbols[0]
            );
            if (analyseTableValid) {
                if (
                    analyseTableValid.production.sequence.length === 1 &&
                    analyseTableValid.production.sequence[0] === ""
                ) {
                    return parserFunc(tokensLL, symbols.slice(1), [
                        ...tokenAlreadyRead,
                    ]);
                } else {
                    return parserFunc(
                        tokensLL,
                        [
                            ...analyseTableValid.production.sequence,
                            ...symbols.slice(1),
                        ],
                        [...tokenAlreadyRead]
                    );
                }
            } else {
                return {
                    ...coordError(tokenAlreadyRead),
                    message:
                        "Syntax Error, Waiting [" +
                        waitingTokenBySymbol(
                            symbols[0],
                            LL.grammar.noTerms,
                            LL.analysisTables
                        ) +
                        "]",
                    stringWithColored:
                        tokenAlreadyRead.map((tok) => tok.value).join("") +
                        "*" +
                        tokensLL.map((tok) => tok.value).join("") +
                        "*",
                };
            }
        } else if (tokensLL[0].lexem.name === symbols[0]) {
            pop(tokensLL[0].lexem.name, tokensLL[0].value);
            return parserFunc(tokensLL.slice(1), symbols.slice(1), [
                ...tokenAlreadyRead,
                tokensLL[0],
            ]);
        } else {
            throw new Error(`Parser Error`);
        }
    };
    return parserFunc;
};
