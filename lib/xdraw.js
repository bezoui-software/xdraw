//Developed and created by Walid Bezoui
//Github: bezoui-software
//Mail: wbezoui@gmail.com

//Copyright 2020 - Walid Bezoui

//Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

//BSD-3-Clause License:
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
//THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS 
//BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, 
//OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
//OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
//EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

"use strict";

(function(f) {
  if (window) window.XDraw = new f();
})(class {
  constructor() {
    //CANVAS CLASS
    this.Canvas = class {
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.elt;
        this.ctx;
        this.strokeColor;
        this.fillColor;
        this.run();
      }

      run() {
        this.elt = document.createElement('canvas');
        this.elt.width = this.width;
        this.elt.height = this.height;
        this.ctx = this.elt.getContext('2d');
        this.render();
        this.setupEvents();
      }

      setupEvents() {
        const THIS = this;
        this.elt.addEventListener('click', e => THIS.updateMousePosition(e));
        this.elt.addEventListener('mousemove', e => THIS.updateMousePosition(e));
      }

      updateMousePosition(e) {
        this.mouseX = e.clientX - this.elt.offsetLeft;
        this.mouseY = e.clientY - this.elt.offsetTop;
      }

      render() {
        document.body.appendChild(this.elt);
      }

      draw() {
        this.ctx.stroke();
        this.ctx.fill();
      }

      translate(x, y) {
        this.ctx.translate(x, y);
      }

      rotate(a) {
        this.ctx.rotate(a);
      }

      begin() {
        this.ctx.save();
      }

      end() {
        this.ctx.restore();
      }

      fill(r, g, b, a) {
        const color = Color(r, g, b, a);
        this.ctx.fillStyle = color.getRGBA();
      }

      noFill() {
        this.fill(0, 0);
      }

      stroke(r, g, b, a) {
        const color = Color(r, g, b, a);
        this.ctx.strokeStyle = color.getRGBA();
      }

      noStroke() {
        this.stroke(0, 0);
      }

      strokeWeight(w) {
        this.ctx.lineWidth = w;
      }

      rect(x, y, width, height) {
        this.ctx.beginPath();
        this.ctx.rect(x, y, width, height);
        this.draw();
      }

      ellipse(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, radius, radius, 0, 0, 360);
        this.draw();
      }

      clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      background(r, g, b) {
        this.clear();
        let color = Color(r, g, b);
        this.fill(color);
        this.rect(0, 0, this.width, this.height);
      }
    }

    //VECTOR CLASS
    this.Vector = class {
      constructor(a=0, b=0) {
        (a instanceof XDraw.Vector) ? this.paste(a): this.set(a, b);
      }

      set(x, y) {
        this.x = x;
        this.y = y;
      }

      paste(vector) {
        this.set(vector.x, vector.y);
      }

      magSq() {
        return this.x ** 2 + this.y ** 2;
      }

      mag() {
        return sqrt(this.magSq());
      }

      div(a) {
        if (a instanceof XDraw.Vector) {
          this.divByVector(a)
        } else if (typeof a == 'number') {
          this.divByNumber(a);
        }
      }

      divByNumber(number) {
        if (typeof number != 'number') {
          return this.throwError("XDraw.Vector Error: <" + number + "> isn't a valide Number");
        }
        this.x /= number;
        this.y /= number;
      }

      divByVector(vector) {
        if (!(vector instanceof XDraw.Vector)) {
          return this.throwError("XDraw.Vector Error: <" + vector + "> isn't a valide XDraw.Vector");
        }
        this.x /= vector.x;
        this.y /= vector.y;
      }

      mult(a) {
        if (a instanceof XDraw.Vector) {
          multByVector(a)
        } else if (typeof a == 'number') {
          this.multByNumber(a);
        }
      }

      multByNumber(number) {
        if (typeof number != 'number') {
          return this.throwError("XDraw.Vector Error: <" + number + "> isn't a valide Number");
        }
        this.x *= number;
        this.y *= number;
      }

      multByVector(vector) {
        if (!(vector instanceof XDraw.Vector)) {
          return this.throwError("XDraw.Vector Error: <" + vector + "> isn't a valide XDraw.Vector");
        }
        this.x *= vector.x;
        this.y *= vector.y;
      }

      normalize() {
        this.div(this.mag());
      }

      setMag(a) {
        this.normalize();
        this.mult(a);
      }

      limit(l) {
        if (this.mag() > l) {
          this.div(this.mag());
          this.mult(l);
        }
        return this;
      }

      headingRad() {
        return atan(this.y / this.x);
      }

      headingDeg() {
        return degrees(this.headingRad());
      }

      add(a) {
        if (a instanceof XDraw.Vector) {
          this.addVector(a)
        } else if (typeof a == 'number') {
          this.addNumber(a);
        }
      }

      addVector(vector) {
        if (!(vector instanceof XDraw.Vector)) {
          return this.throwError("XDraw.Vector Error: <" + vector + "> isn't a valide XDraw.Vector");
        }
        this.x += vector.x;
        this.y += vector.y;
      }

      addNumber(number) {
        if (typeof number != 'number') {
          return this.throwError("XDraw.Vector Error: <" + number + "> isn't a valide Number");
        }
        this.x += number;
        this.y += number;
      }

      copy() {
        return new XDraw.Vector(this);
      }

      throwError(error) {
        throw Error(error);
      }

      static distSq(vector1, vector2) {
        return (vector2.x - vector1.x) ** 2 + (vector2.y - vector1.y) ** 2;
      }

      static dist(vector1, vector2) {
        return sqrt(XDraw.Vector.distSq(vector1, vector2));
      }

      static random() {
        return new XDraw.Vector(random(-1, 1), random(-1, 1));
      }
    }

    //COLOR CLASS
    this.Color = class {
      constructor(a, b, c, d) {
        this.values = {};
        this.evaluate(a, b, c, d);
      }

      getRGBA() {
        let r, g, b, a;
        r = this.values.rgba[0];
        g = this.values.rgba[1];
        b = this.values.rgba[2];
        a = this.values.rgba[3] / 255;
        return 'rgba('+r+','+g+','+b+','+a+')';
      }

      evaluate(a, b, c, d) {
        (a instanceof XDraw.Color) ? this.setFromColor(a): this.setFromRGBA(a, b, c, d);
      }

      setGrayScaleAndAlpha(gs, a) {
        this.values.rgba = [gs, gs, gs, a];
      }

      setGrayScale(gs) {
        this.values.rgba = [gs, gs, gs, 255];
      }

      setFromRGBA(a, b, c, d) {
        if (d === undefined) {
          d = 255;
        }

        if (a !== undefined && b !== undefined && c !== undefined) {
          this.values.rgba = [a, b, c, d];
        } else if (a !== undefined && b !== undefined) {
          this.setGrayScaleAndAlpha(a, b);
        } else if (a !== undefined) {
          this.setGrayScale(a);
        }
      }

      setFromColor(color) {
        let r = color.values.rgba[0],
          g = color.values.rgba[1],
          b = color.values.rgba[2];
        this.setFromRGBA(r, g, b);
      }
    }
  }
})

function random(a, b) {
  if (a instanceof Array) return randomElementFromArray(a);
  if (!b) {
    const _a = a;
    a = 0;
    b = _a;
  }
  return Math.random() * (b - a) + a;
}

function randomInt(a, b) {
  return floor(random(a, b));
}


function randomElementFromArray(arr) {
  const i = randomInt(arr.length);
  return arr[i];
}

const createCanvas = (width, height) => (new XDraw.Canvas(width, height));
const createVector = (x, y) => (new XDraw.Vector(x, y));
const Color = (r, g, b, a) => (new XDraw.Color(r, g, b, a));
const floor = x => Math.floor(x);
const sqrt = x => Math.sqrt(x);
const tan = x => Math.tan(x);
const atan = x => Math.atan(x);
const radians = x => x * (Math.PI / 180);
const degrees = x => x * (180 / Math.PI);