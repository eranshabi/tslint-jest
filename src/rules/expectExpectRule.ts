import * as ts from 'typescript';
import * as Lint from 'tslint';

const FAILURE_MESSAGE: string = 'Test has no assertions: ';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    private assertionFunctionsNames: string[] = ['expect'].concat(this.getOptions());
    private testFunctionsNames: string[] = ['it', 'test'];
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitCallExpression(node: ts.CallExpression) {
        if (this.testFunctionsNames.includes(node.expression.getText())) {
            if (node.arguments[1]) {
                this.testFunctionHasAssertion(node.arguments[1])
            }
        }
        super.visitCallExpression(node);
    }

    isCallExpressionAssertion(node: ts.CallExpression) {
        return this.assertionFunctionsNames.includes(node.getChildAt(0).getText());
    }

    testFunctionHasAssertion(node: ts.Expression) {
        let hasAssertion: boolean = false;
        const checkAssertionInChild = (child) => {
            child.getChildren().forEach(_child => checkAssertionInChild(_child));
            if (ts.isCallExpression(child)) {
                if (this.isCallExpressionAssertion(child)) {
                    hasAssertion = true;
                    return;
                }
            }
        };

        ts.forEachChild(node, checkAssertionInChild);

        if (!hasAssertion) {
            this.addFailureAt(node.getStart(), node.getEnd() - node.getStart(), FAILURE_MESSAGE);
        }
    }
}
