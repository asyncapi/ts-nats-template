const dircompare = require('dir-compare');
const path = require('path');
const expect = require('chai').expect;
describe('template', () => { 
  describe('should be usable with latest generator', () => { 
    describe('and should support 0.1.0 bindings', () => { 
      it('for frontend', () => { 
        const path1 = path.resolve('./test/actual_comparators/latest/frontend');
        const path2 = path.resolve('./test/expected_comparators/latest/frontend');
        const res = compareDir(path1, path2);
        expect(res.same).to.be.true;
      });
      it('for light-controller', () => { 
        const path1 = path.resolve('./test/actual_comparators/latest/light-controller');
        const path2 = path.resolve('./test/expected_comparators/latest/light-controller');
        const res = compareDir(path1, path2);
        expect(res.same).to.be.true;
      });
    });
  });
});

function compareDir(path1, path2){
  const options = { compareSize: true };
  return dircompare.compareSync(path1, path2, options);
}