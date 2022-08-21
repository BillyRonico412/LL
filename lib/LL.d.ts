import { Grammar, LLInterface } from "./interface";
export declare const LL: (k: number, grammar: Grammar, symbolStartLL?: string, symbolEndLL?: string) => LLInterface | false;
