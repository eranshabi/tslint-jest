import * as ts from 'typescript';
import * as Lint from 'tslint';

const FAILURE_MESSAGE: string = 'Test has no assertions: ';

const methodNames =
    {
        toBeCalled: 'toHaveBeenCalled',
        toBeCalledTimes: 'toHaveBeenCalledTimes',
        toBeCalledWith: 'toHaveBeenCalledWith',
        lastCalledWith: 'toHaveBeenLastCalledWith',
        nthCalledWith: 'toHaveBeenNthCalledWith',
        toReturn: 'toHaveReturned',
        toReturnTimes: 'toHaveReturnedTimes',
        toReturnWith: 'toHaveReturnedWith',
        lastReturnedWith: 'toHaveLastReturnedWith',
        nthReturnedWith: 'toHaveNthReturnedWith',
        toThrowError: 'toThrow'
    }

export class Rule extends Lint.Rules.AbstractRule {
    public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
        return this.applyWithWalker(new Walk(sourceFile, this.getOptions()));
    }
}

class Walk extends Lint.RuleWalker {
    private assertionFunctionsNames: string[] = ['expect'].concat(this.getOptions());
    private testFunctionsNames: string[] = ['it', 'test'];
    private notMatchersPossibleAccessExpressions = ['rejects', 'resolves', 'not'];

    constructor(sourceFile: ts.SourceFile, options: Lint.IOptions) {
        super(sourceFile, options);
    }

    private getFixer(uncanonicalMethodNode, canonicalName) {
        return new Lint.Replacement(uncanonicalMethodNode.getStart(), uncanonicalMethodNode.getText().length, canonicalName)
    }

    visitPropertyAccessExpression(node: ts.PropertyAccessExpression) {
        if (node.getChildAt(0) && node.getChildAt(0).getChildAt(0) && node.getChildAt(0).getChildAt(0).getText() === 'expect') {
            let usedMethod = node.getChildAt(2);
            let usedMethodText = usedMethod.getText();

            if (this.notMatchersPossibleAccessExpressions.includes(usedMethodText)) {
                usedMethod = node.parent.getChildAt(2);
                if (!usedMethod) return;
                usedMethodText = usedMethod.getText();
            }
            const canonicalMethodName = methodNames[usedMethodText];

            if (canonicalMethodName) {
                this.addFailureAt(usedMethod.getStart(), usedMethod.getStart() + usedMethodText.length, `Replace ${usedMethodText}() with its canonical name of ${canonicalMethodName}()`, this.getFixer(usedMethod, canonicalMethodName));
            }
        }
        super.visitPropertyAccessExpression(node);
    }
}
