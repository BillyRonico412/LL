"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LL = void 0;
const compareTwoArrayString = (a1, a2) => {
    if (a1.length !== a2.length) {
        return false;
    }
    for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
};
const unionArrayArrayString = (item1, item2) => {
    if (item2.length === 0) {
        return item1;
    }
    if (item1.some((item) => compareTwoArrayString(item2[0], item))) {
        return unionArrayArrayString(item1, item2.slice(1));
    }
    return unionArrayArrayString([...item1, item2[0]], item2.slice(1));
};
const concatStringToArrayArrayString = (s, aas) => {
    if (s !== "") {
        const res = [];
        aas.forEach((as, i) => {
            res.push([]);
            res[i].push(s);
            as.forEach((it) => {
                if (it !== "") {
                    res[i].push(it);
                }
            });
        });
        return res;
    }
    return aas;
};
const LL = (k, grammar, symbolStartLL = "X", symbolEndLL = "$") => {
    const grammarLL = {
        terms: [...grammar.terms, symbolEndLL],
        noTerms: [...grammar.noTerms, symbolStartLL],
        productions: [
            {
                noTerm: symbolStartLL,
                sequence: [
                    grammar.firstSymbol,
                    ...(() => {
                        const symbolEndLLMany = [];
                        for (let i = 0; i < k; i++)
                            symbolEndLLMany.push(symbolEndLL);
                        return symbolEndLLMany;
                    })(),
                ],
            },
            ...grammar.productions,
        ],
        firstSymbol: symbolStartLL,
    };
    const first = (k, symbols) => {
        if (symbols.length === 0) {
            return [[""]];
        }
        if (k === 0) {
            return [[""]];
        }
        if (symbols.length === 1 && symbols[0] === "") {
            return [[""]];
        }
        if (symbols.length > 1 && symbols[0] === "") {
            return first(k, symbols.slice(1));
        }
        if (typeof symbols[0] === "string") {
            if (grammarLL.terms.includes(symbols[0])) {
                return concatStringToArrayArrayString(symbols[0], first(k - 1, symbols.slice(1)));
            }
            if (grammarLL.noTerms.includes(symbols[0])) {
                const res = [];
                const productionsBySymbol = grammarLL.productions.filter((production) => production.noTerm === symbols[0]);
                productionsBySymbol.forEach((production) => {
                    res.push(...first(k, [
                        ...production.sequence,
                        ...symbols.slice(1),
                    ]));
                });
                return res;
            }
        }
        else {
            return follow(k, symbols[0].noterm);
        }
        throw new Error("First Error");
    };
    const follow = (k, symbol) => {
        if (!grammar.noTerms.includes(symbol)) {
            throw new Error("Follow Error");
        }
        let res = [];
        const followers = grammarLL.productions.filter((production) => production.sequence.includes(symbol));
        followers.forEach((follower) => {
            const indexSymbolInProd = [];
            follower.sequence.forEach((seq, i) => {
                if (seq === symbol) {
                    indexSymbolInProd.push(i);
                }
            });
            indexSymbolInProd.forEach((index) => {
                if (follower.noTerm === symbol &&
                    index === follower.sequence.length - 1) {
                }
                else {
                    res = unionArrayArrayString(res, first(k, [
                        ...follower.sequence.slice(index + 1),
                        { noterm: follower.noTerm },
                    ]));
                }
            });
        });
        return res;
    };
    const lookahead = (k, production) => {
        return first(k, [
            ...production.sequence,
            { noterm: production.noTerm },
        ]);
    };
    const computeAnalysisTables = () => {
        const res = { analysisTables: [], lookaheads: [] };
        grammarLL.productions.forEach((production) => {
            const lookaheadForProd = lookahead(k, production);
            res.lookaheads.push({ production, value: lookaheadForProd });
            lookaheadForProd.forEach((it) => {
                res.analysisTables.push({
                    noTerm: production.noTerm,
                    terms: it,
                    production,
                });
            });
        });
        return res;
    };
    const computeAnalysisTablesRes = computeAnalysisTables();
    const { analysisTables, lookaheads } = computeAnalysisTablesRes;
    const isLL = () => grammarLL.noTerms.every((noTerm) => {
        const arrayArrayLookheadByNoTerm = analysisTables
            .filter((analysisTable) => analysisTable.noTerm === noTerm)
            .map((analysisTable) => analysisTable.terms);
        for (let i = 0; i < arrayArrayLookheadByNoTerm.length; i++) {
            for (let j = i + 1; j < arrayArrayLookheadByNoTerm.length; j++) {
                if (compareTwoArrayString(arrayArrayLookheadByNoTerm[i], arrayArrayLookheadByNoTerm[j])) {
                    return false;
                }
            }
        }
        return true;
    });
    if (isLL()) {
        return {
            k,
            analysisTables,
            lookaheads,
            grammar: grammarLL,
            symbolStartLL,
            symbolEndLL,
        };
    }
    return false;
};
exports.LL = LL;
