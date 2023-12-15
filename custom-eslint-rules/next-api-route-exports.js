module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce a specific import pattern for files inside pages/api",
      category: "Best Practices",
      recommended: true,
    },
    schema: [],
  },

  create: function (context) {
    // Check if the file path contains '/pages/api/'
    const isApiPage = context.getFilename().includes("/pages/api/");

    return {
      ImportDeclaration(node) {
        if (isApiPage) {
          const sourcePath = node.source.value;

          if (
            sourcePath.startsWith("src/api/") &&
            node.specifiers.length === 1 &&
            (node.specifiers[0].type === "ImportDefaultSpecifier" ||
              node.specifiers[0].type === "ImportSpecifier") &&
            node.specifiers[0].local.name === "default"
          ) {
            // Valid import
            return;
          }

          context.report({
            node,
            message:
              'Invalid import pattern. Expected: import loginRoute from "src/api/routes/loginRoute";',
          });
        }
      },
    };
  },
};
