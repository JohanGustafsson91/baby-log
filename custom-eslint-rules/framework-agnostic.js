module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow importing from next inside api",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },

  create: function (context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const apiFolder = "src/api";
        const nextImportPath = "next";

        if (
          importPath.includes(nextImportPath) &&
          context.getFilename().includes(apiFolder)
        ) {
          context.report({
            node,
            message: `Avoid importing from ${nextImportPath} inside the ${apiFolder} folder.`,
          });
        }
      },
    };
  },
};
