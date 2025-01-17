"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRslServices = exports.RslModule = void 0;
const langium_1 = require("langium");
const module_1 = require("./generated/module");
const rsl_validator_1 = require("./rsl-validator");
const rsl_code_actions_1 = require("./rsl-code-actions");
const rsl_scope_provider_1 = require("./rsl-scope-provider");
const rsl_naming_1 = require("./rsl-naming");
const rsl_scope_computation_1 = require("./rsl-scope-computation");
const rsl_completion_1 = require("./rsl-completion");
const rsl_linker_1 = require("./rsl-linker");
const elk_layout_1 = require("sprotty-elk/lib/elk-layout");
const langium_sprotty_1 = require("langium-sprotty");
const rsl_diagram_generator_1 = require("./rsl-diagram-generator");
const elk_bundled_1 = __importDefault(require("elkjs/lib/elk.bundled"));
const rsl_layout_config_1 = require("./rsl-layout-config");
/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
exports.RslModule = {
    references: {
        ScopeComputation: (services) => new rsl_scope_computation_1.RslScopeComputation(services),
        ScopeProvider: (services) => new rsl_scope_provider_1.RslScopeProvider(services),
        Linker: (services) => new rsl_linker_1.RslLinker(services),
        NameProvider: () => new rsl_naming_1.RslNameProvider(),
    },
    lsp: {
        CodeActionProvider: () => new rsl_code_actions_1.RslActionProvider(),
        CompletionProvider: (services) => new rsl_completion_1.RslCompletionProvider(services),
    },
    diagram: {
        DiagramGenerator: services => new rsl_diagram_generator_1.RslDiagramGenerator(services),
        ModelLayoutEngine: services => new elk_layout_1.ElkLayoutEngine(services.layout.ElkFactory, services.layout.ElementFilter, services.layout.LayoutConfigurator)
    },
    layout: {
        ElkFactory: () => () => new elk_bundled_1.default({ algorithms: ['layered'] }),
        ElementFilter: () => new elk_layout_1.DefaultElementFilter,
        LayoutConfigurator: () => new rsl_layout_config_1.RslLayoutConfigurator
    },
    validation: {
        RslValidator: () => new rsl_validator_1.RslValidator(),
    }
};
/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
function createRslServices(context) {
    const shared = (0, langium_1.inject)((0, langium_1.createDefaultSharedModule)(context), module_1.RslGeneratedSharedModule, langium_sprotty_1.SprottySharedModule);
    const Rsl = (0, langium_1.inject)((0, langium_1.createDefaultModule)({ shared }), module_1.RslGeneratedModule, exports.RslModule);
    shared.ServiceRegistry.register(Rsl);
    (0, rsl_validator_1.registerValidationChecks)(Rsl);
    return { shared, Rsl };
}
exports.createRslServices = createRslServices;
//# sourceMappingURL=rsl-module.js.map