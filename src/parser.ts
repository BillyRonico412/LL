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

    const parserFunc = (tokens: Token[]): boolean | ErrorSyntax => {
        const tokensLL = [...tokens];
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
        const parserFuncFunc = (
            tokens: Token[],
            symbols: string[] = [LL.symbolStartLL],
            tokenAlreadyRead: Token[] = []
        ): boolean | ErrorSyntax => {
            if (tokens.length === 0 && symbols.length === 0) {
                return true;
            }
            if (
                tokens.length !== 0 &&
                symbols.length === 0 &&
                !tokens.every((tok) => ignoreTerms.includes(tok.lexem.name))
            ) {
                const myCoordError = coordError(tokenAlreadyRead);
                return {
                    ...myCoordError,
                    message: "Syntax Error",
                    stringWithColored:
                        tokenAlreadyRead.map((tok) => tok.value).join("") +
                        "*" +
                        tokens.map((tok) => tok.value).join("") +
                        "*",
                };
            }

            if (tokens.length === 0 && symbols.length !== 0) {
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
                        tokenAlreadyRead.map((tok) => tok.value).join("") +
                        "* *",
                };
            }

            if (ignoreTerms.includes(tokens[0].lexem.name)) {
                return parserFuncFunc(tokens.slice(1), symbols, [
                    ...tokenAlreadyRead,
                    tokens[0],
                ]);
            }
            if (LL.grammar.noTerms.includes(symbols[0])) {
                const analyseTableValid = LL.analysisTables.find(
                    (analyseTable) =>
                        checkFirstTwoStringArrayEquals(
                            LL.k,
                            analyseTable.terms,
                            tokens.map((token) => token.lexem.name)
                        ) && analyseTable.noTerm === symbols[0]
                );
                if (analyseTableValid) {
                    if (
                        analyseTableValid.production.sequence.length === 1 &&
                        analyseTableValid.production.sequence[0] === ""
                    ) {
                        return parserFuncFunc(tokens, symbols.slice(1), [
                            ...tokenAlreadyRead,
                        ]);
                    } else {
                        return parserFuncFunc(
                            tokens,
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
                            tokens.map((tok) => tok.value).join("") +
                            "*",
                    };
                }
            } else if (tokens[0].lexem.name === symbols[0]) {
                pop(tokens[0].lexem.name, tokens[0].value);
                return parserFuncFunc(tokens.slice(1), symbols.slice(1), [
                    ...tokenAlreadyRead,
                    tokens[0],
                ]);
            } else {
                throw new Error(`Parser Error`);
            }
        };
        return parserFuncFunc(tokensLL);
    };
    return parserFunc;
};
