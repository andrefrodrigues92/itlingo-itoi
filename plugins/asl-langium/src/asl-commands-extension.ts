import * as vscode from 'vscode';
import * as path from 'path';
import * as cp from "child_process";


export class ASLCustomCommands implements vscode.Disposable {

    context: vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext){
        this.context = context;
    }
    dispose() {
        //clear any resources alocated.
    }

    registerCommands(){
        console.log('REGISTERED COMMANDS: asl.genie and asl.zip');
        //vscode.commands.registerCommand('genie.import',this.genieCallBack);
        vscode.commands.registerCommand('zip.import',this.zipCallBack, this);
        vscode.commands.registerCommand('genio.export',this.exportGenieCallBack, this);
        vscode.commands.registerCommand('asl.export',this.exportAslCallBack, this);
    } 

    genieCallBack(...context: any[]){
        console.log("GenieCallback");
    }

    zipCallBack(...context: any[]){
        let fileUri = context[0];
        console.log(fileUri);
        console.log(context[1]);
        console.log(context);
        let importerPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','importer.sh'));
        let importerType = 'GENIO';

        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
        console.log(workspaceRoot)
	    if (!workspaceRoot) {
		    return;
	    }

        const commandString :string = `${importerPath} ${importerType} ${workspaceRoot} ${fileUri.path}`
        console.log(commandString);
        cp.execSync(commandString);
        
    }


    exportGenieCallBack(...callcontext: any[]){
        console.log("exportGenie");
        let fileUri = callcontext[0];
        console.log(fileUri);
        console.log("exportGenie-context");
        console.log(callcontext.length)
        console.log(callcontext)

        let generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','generator.sh'));
        let generatorType = 'Genio';
        
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	    if (!workspaceRoot) {
		    return;
	    }


        const commandString :string = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`
        cp.execSync(commandString);
    }

    exportAslCallBack(...callcontext: any[]){
        let fileUri = callcontext[0];


        let generatorPath = this.context.asAbsolutePath(path.join('server', 'asl', 'bin','generator.sh'));
        let generatorType = 'Asl';
        
        const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	    if (!workspaceRoot) {
		    return;
	    }

        const commandString :string = `${generatorPath} ${generatorType} ${fileUri.path} ${workspaceRoot}`
        cp.execSync(commandString);
    }
}