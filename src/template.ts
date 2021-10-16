
import * as changeCase from "change-case";

export const generateControllerTemplate = (resourceName: string): string => {
  return `import 'package:get/get.dart';

class ${resourceName}Controller extends GetxController {
    
}`;
};

export const generatePageTemplate = (resourceName: string): string => {
  return `import 'package:flutter/material.dart';
import 'package:get/get.dart';

import 'controller.dart';

class ${resourceName}Page extends GetView<${resourceName}Controller> {
  const ${resourceName}Page({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${resourceName}Page'),
      ),
      body: SafeArea(
        child: Text('${resourceName}Controller'),
      ),
    );
  }
}`;
};

export const generateBindingTemplate = (resourceName: string): string => {
  return `import 'package:get/get.dart';
import 'controller.dart';
    
class ${resourceName}Binding implements Bindings {
  @override
  void dependencies() {
    Get.lazyPut<${resourceName}Controller>(() => ${resourceName}Controller());
  }
}`;
};

export const generateIndexTemplate = (resourceName: string): string => {
  var snakeName = changeCase.snakeCase(resourceName);

  return `library ${snakeName};

export "binding.dart";
export "controller.dart";`;
};
