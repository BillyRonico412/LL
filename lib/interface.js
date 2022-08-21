"use strict";
/*
    Un Lexem est un couple composé d'un nom et d'une définition en Regex (ou plusieurs)
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeBase = exports.Compo = exports.Key = exports.TypeObject = exports.TypeNode = void 0;
/*
    Un noeud representant un type dans l'arborescence
*/
var TypeNode;
(function (TypeNode) {
    TypeNode[TypeNode["TypeObject"] = 0] = "TypeObject";
    TypeNode[TypeNode["Key"] = 1] = "Key";
    TypeNode[TypeNode["Compo"] = 2] = "Compo";
    TypeNode[TypeNode["TypeBase"] = 3] = "TypeBase";
})(TypeNode = exports.TypeNode || (exports.TypeNode = {}));
class TypeObject {
    constructor(parent, childrens) {
        this.type = TypeNode.TypeObject;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArray = false;
    }
}
exports.TypeObject = TypeObject;
class Key {
    constructor(parent, value, childrens) {
        this.type = TypeNode.Key;
        this.parent = parent;
        this.value = value;
        this.childrens = childrens;
        this.isArray = false;
    }
}
exports.Key = Key;
class Compo {
    constructor(parent, childrens) {
        this.type = TypeNode.Compo;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArray = false;
    }
}
exports.Compo = Compo;
class TypeBase {
    constructor(parent, value) {
        this.type = TypeNode.TypeBase;
        this.parent = parent;
        this.value = value;
        this.childrens = [];
        this.isArray = false;
    }
}
exports.TypeBase = TypeBase;
