import {expectExpect, expectExpectWithOptions, lintFileString} from './utils';

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

        file =
            ` it('should display the correct title', () => {
        expect(getNumber()).toBe('2');
      });`;
        result = lintFileString(file, expectExpect);
        expect(result.errorCount).toEqual(0);

        file =
            ` it('should display the correct title', function() {
        expect(getNumber()).toBe('2');
      });`;
        result = lintFileString(file, expectExpect);
        expect(result.errorCount).toEqual(0);
    });

    it('with a big file', () => {

        const file =
            ` 
  describe('when', () => {
    const cart = aCart()
      .withAppliedCoupon(aMoneyOffAppliedCoupon());

    it('should', async () => {
      await driver.when.created();
      cart.withAppliedCoupon(null);
      await flushAllPromises();
      expect(couponDriver.get.isInViewMode()).toEqual(false);
    });
});
`;
        const result = lintFileString(file, expectExpect);
        expect(result.errorCount).toEqual(0);
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

        file =
            ` it('should display the correct title', () => {
        notExpect(getNumber()).toBe('2');
      });`;
        result = lintFileString(file, expectExpect);
        expect(result.errorCount).toEqual(1);

        file =
            ` it('should display the correct title', function() {
        notExpect(getNumber()).toBe('2');
      });`;
        result = lintFileString(file, expectExpect);
        expect(result.errorCount).toEqual(1);
    });

    it('should support custom assertion functions', () => {
        let file =
            ` it('should display the correct title', function() {
        customAssertion(getNumber()).toBe('2');
      });`;
        let result = lintFileString(file, expectExpectWithOptions(['customAssertion']));
        expect(result.errorCount).toEqual(0);

        file =
            ` it('should display the correct title', function() {
        expect(getNumber()).toBe('2');
      });`;
        const result = lintFileString(file, expectExpectWithOptions(['customAssertion']));
        expect(result.errorCount).toEqual(0);

        file =
            ` it('should display the correct title', function() {
        func3(getNumber()).toBe('2');
      });`;
        const result = lintFileString(file, expectExpectWithOptions(['func1', 'func2']));
        expect(result.errorCount).toEqual(1);
    });
});
