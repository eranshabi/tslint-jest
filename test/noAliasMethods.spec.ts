import {expectExpect, lintFileString, noAliasMethods} from './utils';
import {Replacement} from 'tslint';

const methodNames = [
    ['toHaveBeenCalled', 'toBeCalled'],
    ['toHaveBeenCalledTimes', 'toBeCalledTimes'],
    ['toHaveBeenCalledWith', 'toBeCalledWith'],
    ['toHaveBeenLastCalledWith', 'lastCalledWith'],
    ['toHaveBeenNthCalledWith', 'nthCalledWith'],
    ['toHaveReturned', 'toReturn'],
    ['toHaveReturnedTimes', 'toReturnTimes'],
    ['toHaveReturnedWith', 'toReturnWith'],
    ['toHaveLastReturnedWith', 'lastReturnedWith'],
    ['toHaveNthReturnedWith', 'nthReturnedWith'],
    ['toThrow', 'toThrowError'],
];

describe('no-alias-methods', () => {
    it('should pass', () => {
        methodNames.forEach(([canonical]) => {
            shouldPass({file: `expect(a).${canonical}()`});
            shouldPass({file: `expect(a).not.${canonical}()`});
        });
    });

    it('should fail with fix', () => {
        methodNames.forEach(([canonical, alias]) => {
            shouldFailWithMessageAndFix({file: `expect(a).${alias}()`, message: `Replace ${alias}() with its canonical name of ${canonical}()`, fix: `expect(a).${canonical}()`});
            shouldFailWithMessageAndFix({file: `expect(a).rejects.${alias}()`, message: `Replace ${alias}() with its canonical name of ${canonical}()`, fix: `expect(a).rejects.${canonical}()`});
            shouldFailWithMessageAndFix({file: `expect(a).not.${alias}()`, message: `Replace ${alias}() with its canonical name of ${canonical}()`, fix: `expect(a).not.${canonical}()`});
            shouldFailWithMessageAndFix({file: `expect(a).resolves.${alias}()`, message: `Replace ${alias}() with its canonical name of ${canonical}()`, fix: `expect(a).resolves.${canonical}()`});
        });
    });

    function shouldFailWithMessageAndFix({file, fix, message}) {
        const result = lintFileString(file, noAliasMethods);
        const failureMessage = result.failures[0].getFailure();
        expect(failureMessage).toEqual(message);
        const fixedResults = Replacement.applyFixes(file, [result.failures[0].getFix()]);
        expect(fixedResults).toEqual(fix);
    }

    function shouldPass({file}) {
        const result = lintFileString(file, noAliasMethods);
        expect(result.errorCount).toEqual(0);
    }
});
