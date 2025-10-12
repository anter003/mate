import { Term } from "./lib";

export function setup(p, w, h) {
  p.createCanvas(w, h);
  p.background(255);
}

export function draw(p, w, h, eq, eq_diff, domain, mult, bias, x_i, eta) {
    let fn = (i) => eq.calc(i);
    let fn_diff = (i) => eq_diff.calc(i);
    let xz = 2;

    p.clear();

    grad(p,w,h, domain, mult, fn_diff, xz);
    equation(p,w,h , fn, domain, mult, bias, xz);
    draw_g(p, w, h, fn, fn_diff, domain, mult, bias, x_i, eta, xz);
}

function equation(p, w, h, fn, domain, mult, bias, xz) {
    p.push();
    p.stroke(255);
    p.strokeWeight(3);
    p.noFill();
    p.translate(w / 2, h / 2);
    p.beginShape();

    for (let i = - domain; i < domain; i += 0.01) {
        let y = fn(i / xz);
        p.curveVertex(i * w / 2 / domain , -y * mult - bias );
    }
    p.endShape();
    p.pop();
}

function grad(p,w,h, domain, mult, fn , xz) {
    p.push();
    p.translate(w / 2, 0);
    p.beginShape();
    
    for (let i = -domain; i < domain; i+=0.01) {
        let y = normalize(mult * fn(i / xz),3, 100);
        p.stroke(p.color("hsl(" + Math.round(y) + ",70%, 40%)"));
        p.strokeWeight(3);
        p.line(i * w / 2 / domain, 0, i * w / 2 / domain ,h);
    }

    p.endShape();
    p.pop();
}

function normalize(x, e, c) {
    let d = 1 + Math.pow(e, x / c);
    return 290/d    
}

function draw_g(p, w, h, fn, fn_diff, domain, mult, bias, x_i, eta, xz) {
    let steps = get_steps(fn, fn_diff, x_i, eta, mult, bias, xz);

    p.push();
    p.translate(w / 2, 0);
    p.beginShape();

    p.stroke(0);
    p.strokeWeight(3);
    p.line(x_i * w / 2 / domain, 0, x_i * w / 2 / domain, h);

    p.strokeWeight(1);
    for (let s of steps) {
        p.stroke(s.i * 4 + 20)
        p.line(s.x * w / 2 / domain, 0, s.x * w / 2 / domain, h);
    }

    p.endShape();
    p.pop();


}

function get_steps(fn, fn_diff, x_i, eta, mult, bias, xz) {
    let res = [];

    let x = x_i;
    let d = fn_diff(x_i);

    for (let i = 1; i < 50; i++) {
        d = fn_diff(x) * eta * mult;
        x -= d;

        res.push({i, x: x * xz});
    }

    return res;
}