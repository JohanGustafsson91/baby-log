const path = require("path");

module.exports = {
  create(context) {
    const filePath = context.getFilename();
    const isControllerFile = filePath.includes(path.join("controllers", "/"));

    return {
      ArrowFunctionExpression(node) {
        if (
          node.async &&
          isControllerFile &&
          context
            .getAncestors()
            .some((ancestor) => ancestor.type === "ExportNamedDeclaration") &&
          !hasTryCatchStructure(node.body)
        ) {
          context.report({
            node,
            message:
              "Async functions in /controllers folder must be wrapped in a try/catch block.",
          });
        }
      },
    };
  },
};

function hasTryCatchStructure(node) {
  return (
    node.type === "BlockStatement" &&
    node.body.some(
      (child) =>
        child.type === "TryStatement" &&
        child.block &&
        child.block.type === "BlockStatement" &&
        Array.isArray(child.block.body) &&
        child.block.body.length > 0
    )
  );
}
