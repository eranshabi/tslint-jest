import * as ts from 'typescript';
import * as Lint from 'tslint';

const FAILURE_MESSAGE: string = 'Test has no assertions: ';

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    protected visitCallExpression(node: ts.CallExpression) {
        if (node.expression.getText() === 'it' || node.expression.getText() === 'test') {
            if (node.arguments[1]) {
                this.testFunctionHasAssertion(node.arguments[1])
            }
        }
        super.visitCallExpression(node);
    }

    testFunctionHasAssertion(node: ts.Expression) {
        let hasAssertion: boolean = false;
        const checkAssertionInChild = child => {
            if (child.expression) {
                if (child.expression.expression.expression.getText() === 'expect') {
                    hasAssertion = true;
                }

                if (child.getChildren().length > 0) {
                    child.getChildren().forEach(checkAssertionInChild);
                }
            }
        };

        ts.forEachChild(node, checkAssertionInChild);

        if (!hasAssertion) {
            this.addFailureAt(node.getStart(), node.getEnd() - node.getStart(), FAILURE_MESSAGE);
        }
    }
}
