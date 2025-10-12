export class Term {
  constructor(coef, degree) {
    this.coef = coef;
    this.degree = degree;
  }

  diff() {
    if (this.degree == 0) {
      return new Term(0, 0);
    } else {
      return new Term(
        this.coef * this.degree,
        this.degree - 1
      );
    }
  }

  to_string(is_first) {
    let prefix = this.coef > 0 && !is_first ? "+" : "";
    let c = this.coef;
    if (c == 1) {
        c = "";
    } else if (c == -1) {
        c = "-";
    }

    if (this.degree == 0) {
      return prefix + this.coef;
    } else if (this.degree == 1) {
      return prefix + c + "x";
    } else {
      const sups = "⁰¹²³⁴⁵⁶⁷⁸⁹".split("");
      let digits = String(this.degree).split("");
      let exp = "";
      for (let d of digits) {
        exp += sups[d];
      }

      return prefix + c + "x" + exp;
    }
  }
}

export class Eq {
    constructor(terms) {
        this.terms = terms;
    }

    diff() {
        let n = this.terms;
        for (let i in n) {
            n[i] = n[i].diff();
        }

        return new Eq(n);
    }

    collect() {
        let n = [];
        for (let t of this.terms) {
            if (!n[t.degree]) {
                n[t.degree] = 0;
            }
            n[parseInt(t.degree)] += parseInt(t.coef);
        }

        return n;
        // return n.map((e, i) => {
        //     if (!(i in n)) {
        //         return 0;
        //     } else {
        //         return e;
        //     }
        // })
    }

    clean() {
        let c = this.collect();
        let terms = []
        for (let i in c) {
            if (c[i]) {
                terms.push(new Term(c[i], i));
            }
        }

        terms.sort((a, b) => {
            if (a.degree >= b.degree) {
                return -1;
            } else {
                return 1;
            }
        })

        return new Eq(terms);
    }

    to_string() {
        let s = "";
        for (let i in this.terms) {
            if (i == 0) {
                s += this.terms[i].to_string(true);
            } else {
                s += this.terms[i].to_string(false);
            }
        }

        return s;
    }

    from_string(str) {
        let s = str.replaceAll("-", "+-").split("+");
        let terms = [];
        let k = 1;

        for (let t of s) {
            let is_const = !t.includes("x");
            let is_first_deg = !is_const && !t.includes("^");

            if (is_const) {
                terms.push(new Term(
                    parseInt(t),
                    0
                ));
            } else if (is_first_deg) {
                if (t.split("x")[0] == "") {
                    k = 1
                } else if (t.split("x")[0] == "-") {
                    k = -1
                } else {
                    k = parseInt(t.split("x")[0])
                }

                terms.push(new Term(
                    k,
                    1
                ));
            } else {
                let y = t.split("^")
                if (y[0].split("x")[0] == "") {
                    k = 1
                } else if (y[0].split("x")[0] == "-") {
                    k = -1
                } else {
                    k = parseInt(y[0].split("x")[0])
                }

                terms.push(new Term(
                    k,
                    parseInt(y[1])
                ));
            }
        }

        return new Eq(terms);
    }

    calc(x) {
        let y = 0;
        for (let t of this.terms) {
            y += t.coef * Math.pow(x, t.degree);
        }

        return y;
    }
}