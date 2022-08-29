import { parser } from "./parser";
import { scanner } from "./scanner";

const ll = {
    k: 2,
    analysisTables: [
        {
            noTerm: "X",
            terms: ["a", "b"],
            production: {
                noTerm: "X",
                sequence: ["A", "$", "$"],
            },
        },
        {
            noTerm: "X",
            terms: ["a", "c"],
            production: {
                noTerm: "X",
                sequence: ["A", "$", "$"],
            },
        },
        {
            noTerm: "A",
            terms: ["a", "b"],
            production: {
                noTerm: "A",
                sequence: ["a", "B"],
            },
        },
        {
            noTerm: "A",
            terms: ["a", "c"],
            production: {
                noTerm: "A",
                sequence: ["a", "C"],
            },
        },
        {
            noTerm: "B",
            terms: ["b", "$"],
            production: {
                noTerm: "B",
                sequence: ["b"],
            },
        },
        {
            noTerm: "C",
            terms: ["c", "$"],
            production: {
                noTerm: "C",
                sequence: ["c"],
            },
        },
    ],
    lookaheads: [
        {
            production: {
                noTerm: "X",
                sequence: ["A", "$", "$"],
            },
            value: [
                ["a", "b"],
                ["a", "c"],
            ],
        },
        {
            production: {
                noTerm: "A",
                sequence: ["a", "B"],
            },
            value: [["a", "b"]],
        },
        {
            production: {
                noTerm: "A",
                sequence: ["a", "C"],
            },
            value: [["a", "c"]],
        },
        {
            production: {
                noTerm: "B",
                sequence: ["b"],
            },
            value: [["b", "$"]],
        },
        {
            production: {
                noTerm: "C",
                sequence: ["c"],
            },
            value: [["c", "$"]],
        },
    ],
    grammar: {
        terms: ["a", "b", "c", "$"],
        noTerms: ["A", "B", "C", "X"],
        productions: [
            {
                noTerm: "X",
                sequence: ["A", "$", "$"],
            },
            {
                noTerm: "A",
                sequence: ["a", "B"],
            },
            {
                noTerm: "A",
                sequence: ["a", "C"],
            },
            {
                noTerm: "B",
                sequence: ["b"],
            },
            {
                noTerm: "C",
                sequence: ["c"],
            },
        ],
        firstSymbol: "X",
    },
    symbolStartLL: "X",
    symbolEndLL: "$",
};

const myParserFunc = parser(ll);

const lexems = [
    {
        name: "a",
        value: "^a$",
    },
    {
        name: "b",
        value: "^b$",
    },
    {
        name: "c",
        value: "^c$",
    },
];

const tokens = scanner(lexems, "ab");

if (Array.isArray(tokens)) {
    console.log(JSON.stringify(myParserFunc(tokens), null, "\t"));
}

