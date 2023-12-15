const path = require("path");

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow importing from another controller inside a controller",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },

  create: function (context) {
    const isControllerFile = (filename) => filename.includes("/controllers/");

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileName = context.getFilename();
        const fullPath =
          importPath.startsWith("../") || importPath.startsWith("./")
            ? path.resolve(path.dirname(currentFileName), importPath)
            : importPath;

        if (
          isControllerFile(currentFileName) &&
          fullPath.includes("/controllers/")
        ) {
          context.report({
            node,
            message:
              "Avoid importing from another controller inside a controller. Consider creating a service instead.",
          });
        }
      },
    };
  },
};
