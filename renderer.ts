// ********************************************
//  花火
//  TypeScript + HTML5 Canvas (on Electron)
//
//  2017/5/6 konao
// ********************************************
const myCanvas = document.querySelector('#my-canvas');

// <canvas>のレンダリングコンテキストを保持
const ctx = myCanvas.getContext('2d');

const backgroundColor = '#001020';

function clearCanvas () {
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, myCanvas.width, myCanvas.height)
}

interface IColor {
    r:number;
    g:number;
    b:number;
}

function rgb(c: IColor): string {
    return 'rgb('+c.r+','+c.g+','+c.b+')';
}

class Vec {
    x:number;
    y:number;
    constructor(_x:number=0.0, _y:number=0.0) {
        this.x = _x;
        this.y = _y;
    }
    add(v:Vec):void {
        this.x += v.x;
        this.y += v.y;
    }
    add(dx:number, dy:number):void {
        this.x += dx;
        this.y += dy;
    }
    clone():Vec {
        return new Vec(this.x, this.y);
    }
}
const G:number = 9.8;   // 重力加速度(9.8 m/s^2)
const dt:number = 0.05;
class Firework {
    p:Vec;
    v:Vec;
    counter:number;
    trace:Vec[];
    children:Firework[];
    constructor(_p:Vec, _v:Vec, _counter:number) {
        this.p = _p;
        this.v = _v;
        this.counter = _counter;
        this.trace = [];
        this.children = [];
    }

    update(ctx): void {
        if (this.children.length == 0) {
            // まだ分裂していない
            this.update2(ctx);
            if (this.v.y >= 0) {
                // 分裂させる
                let N = 40;
                let ev = Math.floor(Math.random()*10)*7+20;    // 爆発時初期速さ
                for (let i=0; i<N; i++) {
                    let vx = ev*Math.cos(2*Math.PI*i/N);
                    let vy = ev*Math.sin(2*Math.PI*i/N);
                    this.children.push(new Firework(new Vec(this.p.x, this.p.y), new Vec(this.v.x+vx, this.v.y+vy), 0));
                }
            }
        } else {
            // 分裂後
            for (let i=0; i<this.children.length; i++) {
                this.children[i].update2(ctx);
            }
        }
    }

    update2(ctx): void {
        let prev = this.p.clone();
        if (this.trace.length > 20) {
            this.trace.shift();
        }
        this.trace.push(prev);

        this.v.add(0, G*dt);
        this.p.add(this.v.x*dt, this.v.y*dt);
        ctx.fillStyle = '#ffff80';
        ctx.beginPath();
        ctx.arc(this.p.x, this.p.y, 2.0, 0, Math.PI*2, false);
        ctx.fill();

        let n = this.trace.length;
        for (let i=0; i<n-1; i++) {
            ctx.fillStyle = rgb({r:255*i/n, g:80, b:20});
            ctx.beginPath();
            ctx.arc(this.trace[i].x, this.trace[i].y, 1.0, 0, Math.PI*2, false);
            ctx.fill();
        }
    }

    isValid(): boolean {
        return (
            (this.p.x<0) || (this.p.x>myCanvas.width) || 
            (this.p.y<0) || (this.p.y>myCanvas.height)) ? false : true;
    }
}

function renderLoop() {
    clearCanvas();
    let n = stars.length;
    for (let i=0; i<n; i++) {
        let star = stars[i];
        if (star.isValid()) star.update(ctx);
    }
}

let cx = myCanvas.width/2;
let cy = myCanvas.height/2;

let stars: Firework[] = [];
for (let i=0; i<15; i++) {
    let vx = Math.random()*100-50;
    let vy = Math.floor(Math.random()*20)*(-5)-30;
    let count = Math.floor(Math.random()*10)*20+100;
    stars.push(new Firework(new Vec(myCanvas.width/2, myCanvas.height), new Vec(vx, vy), count));
}
setInterval(renderLoop, 25);