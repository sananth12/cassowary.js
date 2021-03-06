// Copyright (C) 1998-2000 Greg J. Badros
// Use of this source code is governed by http://www.apache.org/licenses/LICENSE-2.0
//
// Parts Copyright (C) 2012, Alex Russell (slightlyoff@chromium.org)

(function() {

"use strict";

var c = require("../");
var t = require("chai").assert;
t.is = t.deepEqual;
t.t = t;

describe("c.Constraint", function() {
  it("should create expression equations", function() {
    var ex = new c.Expression(10);
    var c1 = new c.Equation(ex);
    t.is(c1.expression, ex);
  });

  it("can create expressions c.Variable instances", function() {
    var x = new c.Variable({ value: 167 });
    var y = new c.Variable({ value: 2 });
    var cly = new c.Expression(y);
    cly.addExpression(x);
  });

  it("can create equations from variables and expressions", function() {
    var x = new c.Variable({ name: "x", value: 167 });
    var cly = new c.Expression(2);
    var eq = new c.Equation(x, cly);
    t.t(eq.expression.equals(cly.minus(x)));
  });

  it("should handle strengths correctly", function() {
    var solver = new c.SimplexSolver();
    var x = new c.Variable({ name: "x", value: 10 });
    var y = new c.Variable({ name: "y", value: 20 });
    var z = new c.Variable({ name: "z", value: 1 });
    var w = new c.Variable({ name: "w", value: 1 });

    // Default weights.
    var e0 = new c.Equation(x, y);
    solver.addStay(y);
    solver.addConstraint(e0);
    t.t(c.approx(x, 20));
    t.t(c.approx(y, 20));

    // Weak.
    var e1 = new c.Equation(x, z, c.Strength.weak);
    // console.log("x:", x.value);
    // c.trace = true;
    solver.addStay(x);
    solver.addConstraint(e1);
    t.t(c.approx(x, 20));
    t.t(c.approx(z, 20));

    // Strong.
    var e2 = new c.Equation(z, w, c.Strength.strong);
    solver.addStay(w);
    solver.addConstraint(e2);
    t.is(w.value, 1);
    t.is(z.value, 1);
  });

  it("can use numbers in place of variables", function() {
    var v = new c.Variable({ name: 'v', value: 22 });
    var eq = new c.Equation(v, 5);
    t.t(eq.expression.equals(c.minus(5, v)));
  });

  it("can use equations in place of variables", function() {
    var e = new c.Expression(10);
    var v = new c.Variable({ name: 'v', value: 22 });
    var eq = new c.Equation(e, v);

    t.t(eq.expression.equals(c.minus(10, v)));
  });

  it("works with nested expressions", function() {

    var e1 = new c.Expression(10);
    var e2 = new c.Expression(new c.Variable({ name: 'z', value: 10 }), 2, 4);
    var eq = new c.Equation(e1, e2);
    t.t(eq.expression.equals(e1.minus(e2)));
  });

  it("instantiates inequality expressions correctly", function() {
    var e = new c.Expression(10);
    var ieq = new c.Inequality(e);
    t.is(ieq.expression, e);
  });

  it("handles inequality constructors with operator arguments", function() {
    var v1 = new c.Variable({ name: 'v1', value: 10 });
    var v2 = new c.Variable({ name: 'v2', value: 5 });
    var ieq = new c.Inequality(v1, c.GEQ, v2);

    t.t(ieq.expression.equals(c.minus(v1, v2)));

    ieq = new c.Inequality(v1, c.LEQ, v2);
    t.t(ieq.expression.equals(c.minus(v2, v1)));
  });

  it("handles expressions with variables, operators, and numbers", function() {
    var v = new c.Variable({ name: 'v', value: 10 });
    var ieq = new c.Inequality(v, c.GEQ, 5);

    t.t(ieq.expression.equals(c.minus(v, 5)));

    ieq = new c.Inequality(v, c.LEQ, 5);
    t.t(ieq.expression.equals(c.minus(5, v)));
  });

  it("handles inequalities with reused variables", function() {
    var e1 = new c.Expression(10);
    var e2 = new c.Expression(new c.Variable({ name: 'c', value: 10 }), 2, 4);
    var ieq = new c.Inequality(e1, c.GEQ, e2);

    t.t(ieq.expression.equals(e1.minus(e2)));

    ieq = new c.Inequality(e1, c.LEQ, e2);
    t.t(ieq.expression.equals(e2.minus(e1)));
  });

  it("handles constructors with variable/operator/expression args", function() {
    var v = new c.Variable({ name: 'v', value: 10 });
    var e = new c.Expression(new c.Variable({ name: 'x', value: 5 }), 2, 4);
    var ieq = new c.Inequality(v, c.GEQ, e);

    t.t(ieq.expression.equals(c.minus(v, e)));

    ieq = new c.Inequality(v, c.LEQ, e);
    t.t(ieq.expression.equals(e.minus(v)));
  });

  it("handles constructors with expression/operator/variable args", function() {
    var v = new c.Variable({ name: 'v', value: 10 });
    var e = new c.Expression(new c.Variable({ name: 'x', value: 5 }), 2, 4);
    var ieq = new c.Inequality(e, c.GEQ, v);

    t.t(ieq.expression.equals(e.minus(v)));

    ieq = new c.Inequality(e, c.LEQ, v);
    t.t(ieq.expression.equals(c.minus(v, e)));
  });
});

})();
