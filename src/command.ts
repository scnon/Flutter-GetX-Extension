
// import mkdirp = require("mkdirp");
import * as changeCase from "change-case";
import { mkdir } from "fs/promises";
import { existsSync, writeFile } from "fs";
import * as vscode from 'vscode';
import { generateBindingTemplate, generateControllerTemplate, generateIndexTemplate, generatePageTemplate } from './template';

function promptForResourceName(): Thenable<string | undefined> {
    const resourceNamePromptOptions: vscode.InputBoxOptions = {
        prompt: "Controller Name, Page or Binding",
        placeHolder: "home",
    };
    return vscode.window.showInputBox(resourceNamePromptOptions);
}

export const createPage = async (uri: vscode.Uri): Promise<void> => {
    const resourceName = await promptForResourceName();
    let projectFolder = uri.fsPath;
    if (!resourceName || resourceName.length === 0) {
        vscode.window.showErrorMessage("You must provide a resource name to generate the files");
        return;
    }

    const bindingTemplate = generateBindingTemplate(resourceName);
    const controllerTemplate = generateControllerTemplate(resourceName);
    const homePageTemplate = generatePageTemplate(resourceName);
    const indexPageTemplate = generateIndexTemplate(resourceName);

    var dirName = changeCase.snakeCase(resourceName);
    var targetPath = `${projectFolder}/${dirName}`;

    if(!existsSync(targetPath)) {
        await mkdir(targetPath);
    }

    await Promise.all([
        createFile(resourceName, targetPath, controllerTemplate, "controller"),
        createFile(resourceName, targetPath, bindingTemplate, "binding"),
        createFile(resourceName, targetPath, homePageTemplate, "page"),
        createFile(resourceName, targetPath, indexPageTemplate, "index")
    ]);
};

async function createFile(
    fileName: string, targetPath: string, fileTemplate: string,
    type: "controller" | "binding" | "page" | "index"
): Promise<void> {
    let targetFile: string;

    if (type === "binding") {
        targetFile = `${targetPath}/binding.dart`;
    } else if (type === "controller") {
        targetFile = `${targetPath}/controller.dart`;
    } else if (type === "index") {
        targetFile = `${targetPath}/index.dart`;
    } else {
        targetFile = `${targetPath}/view.dart`;
    }

    return new Promise<void>(async (resolve, reject) => {
        writeFile(
            targetFile,
            fileTemplate,
            "utf8",
            (error: any) => {
            if (error) {
                // vscode.window.showErrorMessage(`${error}`);
                reject(error);
                return;
            }
            resolve();
        });
    });
}