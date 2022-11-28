import { expect } from "chai";
import {LimitedList} from "../Models/LimitedList"
import "mocha"
describe("Limited List Test", () => {
    it("Insert", () => {
        var list = new LimitedList<string>(5);
        list.input("A");
        expect(list.has("A")).equal(true);
        list.input("B");
        list.input("C");
        list.input("D");
        list.input("E");
        expect(list.has("B")).equal(true);
        expect(list.has("C")).equal(true);
        expect(list.has("D")).equal(true);
        expect(list.has("E")).equal(true);
        list.input("E");
        expect(list.has("A")).equal(true);
        list.input("F");
        expect(list.has("F")).equal(true);
        expect(list.has("A")).equal(false);
    });
});