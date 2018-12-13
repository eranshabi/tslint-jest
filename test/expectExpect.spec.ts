import {lintFileString, expectExpect} from './utils';

describe('expect-expect', () => {
        it('should pass', () => {
            let file = `it("should pass", () => expect(true).toBeDefined())`;
            let result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(0);

            file = `test("should pass", () => expect(true).toBeDefined())`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(0);

            file = `it("should pass", () => somePromise().then(() => expect(true).toBeDefined()))`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(0);


            file = `it("should fail", () => {});`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);

            file = `test("should fail", () => {});`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);

            file = `it("should fail", () => { somePromise.then(() => {}); });`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);
    });

        it('should fail', () => {
            let file = `it("should fail", () => {});`;
            let result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);

            file = `test("should fail", () => {});`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);

            file = `it("should fail", () => { somePromise.then(() => {}); });`;
            result = lintFileString(file, expectExpect);
            expect(result.errorCount).toEqual(1);
    });
});
