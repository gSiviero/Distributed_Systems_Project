
import { expect } from "chai";
import {Arguments} from "../Models/Arguments";
import "mocha";

describe("Arguments Test", () => {
    it("Should Instantiate Argument with default value", () => {
      const site = new Arguments<number>("-p", 8080,[]);
      expect(site.value).equal(8080);
    });

    it("Should Instantiate Argument with inputed number", () => {
        const site = new Arguments<number>("-p", 8080,["-p","8081"]);
        expect(site.value).equal(8081);
      });
  });