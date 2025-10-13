import { Term } from "./lib";

export function setup(p, w, h) {
  p.createCanvas(w, h);
  p.background(255);
}

export function draw(p, w, h, eq, eq_diff, domain, mult, bias, x_i, eta, grads, ce) {
    let fn = (i) => eq.calc(i);
    let fn_diff = (i) => eq_diff.calc(i);
    let xz = 2;

    p.clear();

    if (grads) {
        grad(p,w,h, domain, mult, fn_diff, xz, ce);
    } else {
        bg_minima(p,w,h,domain,mult,fn_diff,eta,xz, ce);
    }
    equation(p,w,h , fn, domain, mult, bias, xz);
    draw_lines(p, w, h, fn, fn_diff, domain, mult, bias, x_i, eta, xz);
}

function equation(p, w, h, fn, domain, mult, bias, xz) {
    p.push();
    p.stroke(225);
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

function grad(p,w,h, domain, mult, fn , xz, ce) {
    p.push();
    p.translate(w / 2, 0);
    p.beginShape();
    
    for (let i = -domain; i < domain; i+=0.01) {
        let y = normalize(mult * fn(i / xz),3, ce || 100);
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

function draw_lines(p, w, h, fn, fn_diff, domain, mult, bias, x_i, eta, xz) {
    let steps = get_steps(fn_diff, x_i, eta, mult, xz);

    p.push();
    p.translate(w / 2, 0);
    p.beginShape();

    p.stroke(0);
    p.strokeWeight(5);
    p.line(x_i * w / 2 / domain, 0, x_i * w / 2 / domain, h);

    
    p.strokeWeight(1);
    for (let s of steps) {
        let color = s.i * 4 + 20;
        p.stroke(color);
        p.line(s.x * w / 2 / domain, 0, s.x * w / 2 / domain, h);
  
    }

    p.stroke(0);
    p.strokeWeight(3);
    p.textSize(20);
    p.textAlign(p.CENTER , p.CENTER);
    for (let s of steps) {
        let color = s.i * 4 + 20;
        if (s.i == 10 || s.i == 20 || s.i == 30 || s.i == 40 || s.i == 50) {
            p.fill(color);
            p.text(s.i, s.x * w / 2 / domain, 10 * s.i + 70);
        }
    }

    p.endShape();
    p.pop();
}

function get_steps(fn_diff, x_i, eta, mult, xz) {
    let res = [];

    let x = x_i / xz;
    let d = fn_diff(x_i);

    for (let i = 1; i < 51; i++) {
        d = fn_diff(x) * eta * mult;
        x -= d;

        res.push({i, x: x * xz});
    }

    return res;
}

function bg_minima(p,w,h, domain, mult, fn_diff, eta, xz, ce) {
    p.push();
    p.translate(w / 2, 0);
    p.beginShape();
    
    for (let i = -domain; i < domain; i+=0.01) {
        let y = normalize(get_steps(fn_diff, i, eta, mult, xz)[49].x, 3, ce/20);
        p.stroke(p.color("hsl(" + Math.round(y) + ",70%, 40%)"));
        p.strokeWeight(3);
        p.line(i * w / 2 / domain, 0, i * w / 2 / domain ,h);
    }

    p.endShape();
    p.pop();
}