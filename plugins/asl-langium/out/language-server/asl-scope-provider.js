"use strict";
/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AslScopeProvider = void 0;
const langium_1 = require("langium");
const ast_1 = require("./generated/ast");
/**
 * Special scope provider that matches symbol names regardless of lowercase or uppercase.
 */
class AslScopeProvider extends langium_1.DefaultScopeProvider {
    constructor(services) {
        super(services);
        this.astNodeLocator = services.workspace.AstNodeLocator;
        this.langiumDocuments = services.shared.workspace.LangiumDocuments;
    }
    getScope(context) {
        return this.getScopeInternal(context, context.container);
    }
    getGlobalScope(referenceType, context) {
        let fqNameToRemove = '';
        const system = (0, langium_1.getContainerOfType)(context.container, ast_1.isSystem);
        if (system) {
            fqNameToRemove = this.nameProvider.getQualifiedName(system);
        }
        const model = (0, langium_1.getContainerOfType)(context.container, ast_1.isPackageSystem);
        if (!model) {
            return langium_1.EMPTY_SCOPE;
        }
        const imports = model.imports;
        let matchingElements = [];
        for (let element of this.indexManager.allElements(referenceType)) {
            let node = element.node;
            let path = element.path;
            let name = element.name;
            const imp = imports.find((x) => matchingImport(x, name)); // sort first by the ones that end with * ?
            if (imp) {
                name = normalizeImport(imp, name);
            }
            else {
                name = name.replace(`${fqNameToRemove}.`, '');
            }
            const newElement = {
                node: node,
                name: name,
                nameSegment: element.nameSegment,
                selectionSegment: element.selectionSegment,
                type: element.type,
                documentUri: element.documentUri,
                path: path,
            };
            matchingElements.push(newElement);
        }
        if (referenceType === 'System' || referenceType === 'State') {
            matchingElements = matchingElements.filter((x) => x.name.split('.').length === 1);
        }
        if (matchingElements.length === 0) {
            return langium_1.EMPTY_SCOPE;
        }
        return new langium_1.StreamScope((0, langium_1.stream)(matchingElements));
    }
    getScopeInternal(refInfo, context) {
        if (!context) {
            return super.getScope(refInfo);
        }
        if ((0, ast_1.isDataTableHeader)(context)) {
            let data = (0, langium_1.getContainerOfType)(context, ast_1.isData);
            let elements = [];
            for (let element of super.getScope(refInfo).getAllElements()) {
                if (data && data.type.ref) {
                    const attributes = data.type.ref.attributes;
                    if (!attributes.some((x) => this.astNodeLocator.getAstNodePath(x) === element.path)) {
                        continue;
                    }
                    element.name = element.name.slice(data.type.ref.name.length + 1);
                    elements.push(element);
                }
            }
            return this.createScope(elements);
        }
        else if ((0, ast_1.isIncludeElementGeneric)(context)) {
            if ((0, ast_1.isIncludeElement)(context) && refInfo.property === 'element') {
                return this.getIncludeElementScope(refInfo, context);
            }
            const contextDocument = (0, langium_1.getDocument)(context);
            let elements = [];
            for (let element of super.getScope(refInfo).getAllElements()) {
                if (element.documentUri.fsPath === contextDocument.uri.fsPath) {
                    continue;
                }
                elements.push(element);
            }
            return this.createScope(elements);
        }
        else if ((0, ast_1.isView)(context.$container)) {
            if (!context.$container.type) {
                return super.getScope(refInfo);
            }
            if (refInfo.property === 'references') {
                if (context.$container.type.type === 'UseCaseView') {
                    let elements = super.getScope(refInfo).getAllElements().filter(x => x.type === 'UseCase').toArray();
                    return this.createScope(elements);
                }
                else if (context.$container.type.type === 'ActiveStructureView') {
                    let elements = super.getScope(refInfo).getAllElements().filter(x => x.type === 'ActiveStructure').toArray();
                    return this.createScope(elements);
                }
                else if (context.$container.type.type === 'ActiveView') {
                    let elements = super.getScope(refInfo).getAllElements().filter(x => x.type === 'Active').toArray();
                    return this.createScope(elements);
                }
                else if (context.$container.type.type === 'PassiveStructureView') {
                    let elements = super.getScope(refInfo).getAllElements().filter(x => x.type === 'PassiveStructure').toArray();
                    return this.createScope(elements);
                }
                else if (context.$container.type.type === 'UIView') {
                    let elements = super.getScope(refInfo).getAllElements().filter(x => x.type === 'UI').toArray();
                    return this.createScope(elements);
                }
            }
        }
        else if ((0, ast_1.isUCExtends)(context)) {
            if (refInfo.property !== 'extensionPoint')
                return super.getScope(refInfo);
            let elements = [];
            for (let element of super.getScope(refInfo).getAllElements()) {
                if (element.name.substring(0, context.usecase.$refText.length) === context.usecase.$refText) {
                    element.name = element.name.slice(context.usecase.$refText.length + 1);
                    elements.push(element);
                }
            }
            return this.createScope(elements);
        }
        return super.getScope(refInfo);
    }
    getIncludeElementScope(refInfo, includeElement) {
        var _a;
        let type = includeElement.type;
        let system = (_a = includeElement.system) === null || _a === void 0 ? void 0 : _a.ref;
        if (!type || !system) {
            return super.getScope(refInfo);
        }
        let packageSystem = system.$container;
        if (!packageSystem) {
            return super.getScope(refInfo);
        }
        let elements = system.systemConcepts.filter((x) => x.$type === type.type);
        return this.createScopeForNodes(elements);
    }
}
exports.AslScopeProvider = AslScopeProvider;
function matchingImport(imp, qualifiedName) {
    let importedNamespace = imp.importedNamespace.split('.');
    let elementQualifiedName = qualifiedName.split('.');
    if (importedNamespace.length === 0 || elementQualifiedName.length === 0) {
        return false;
    }
    for (let i = 0; i < importedNamespace.length; i++) {
        if (importedNamespace[i] === '*') {
            continue;
        }
        if (importedNamespace[i] !== elementQualifiedName[i]) {
            return false;
        }
    }
    return true;
}
function normalizeImport(imp, name) {
    let importedNamespace = imp.importedNamespace.split('.');
    if (imp.importedNamespace === name) {
        return importedNamespace[importedNamespace.length - 1];
    }
    if (importedNamespace[importedNamespace.length - 1] !== '*') {
        return name.replace(`${imp.importedNamespace}.`, '');
    }
    importedNamespace.pop();
    return name.replace(`${importedNamespace.join('.')}.`, '');
}
//# sourceMappingURL=asl-scope-provider.js.map