import { expect, assert } from "chai";
import { SimpleDB } from "../DataBase/SimpleDB";
import "mocha";

describe("SimpleDb Test", () => {
    it("Insert Key and Get from DB", () => {
      const DB = new SimpleDB();
      try{
      var id = DB.insert({Name:"Giulliano",Email:"giulliano.siviero@gmail.com"});
      expect(DB.get(id).Name).equal("Giulliano");
      }
      catch{
        expect.fail();
      }
    });

    it("Update Key on DB", () => {
        const DB = new SimpleDB();
        try{
        var id = DB.insert({Name:"Giulliano",Email:"giulliano.siviero@gmail.com"});
        DB.update(id,{Name:"Siviero"})
        expect(DB.get(id).Name).equal("Siviero");
        }
        catch{
          expect.fail();
        }
      });
    
      it("Restore DB", () => {
        const DB = new SimpleDB();
        try{
        DB.restore({"A":{Name:"Silva"}})
        expect(DB.get("A").Name).equal("Silva");
        }
        catch{
          expect.fail();
        }
      });
  });