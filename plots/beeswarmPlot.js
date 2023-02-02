import {
    range,
    extent,
    scaleLinear,
    axisTop
} from 'd3';


export function beeswarmPlot() {
  let width;
  let height;
  let margin;
  let data;
  let xMin;
  let xMax;
  let xLabel;
  let title;
  let color = 'rgb(122, 255, 248, 0.7)';
  let strokeWidth = 1.5;
  let opacity = 1.0;
  let radius = 3;
  let markerPadding = 1.5;
  let plotPadding = 15;
  let fontSize = 15;
  let removeAxis = false;

  /*
    ISC License
    Copyright 2018–2021 Observable, Inc.
    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.
    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
    MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
  */
  const dodge = (X, radius) => {
    // Given an array of x-values and a separation radius, returns an array of y-values.
    const Y = new Float64Array(X.length);
    const radius2 = radius ** 2;
    const epsilon = 1e-3;
    let head = null, tail = null;

    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    const intersects = (x, y) => {
      let a = head;
      while (a) {
        const ai = a.index;
        if (radius2 - epsilon > (X[ai] - x) ** 2 + (Y[ai] - y) ** 2) return true;
        a = a.next;
      }
      return false;
    }

    // Place each circle sequentially.
    for (const bi of range(X.length).sort((i, j) => X[i] - X[j])) {

      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && X[head.index] < X[bi] - radius2) head = head.next;

      // Choose the minimum non-intersecting tangent.
      if (intersects(X[bi], Y[bi] = 0)) {
        let a = head;
        Y[bi] = Infinity;
        do {
          const ai = a.index;
          let y = Y[ai] + Math.sqrt(radius2 - (X[ai] - X[bi]) ** 2);
          if (y < Y[bi] && !intersects(X[bi], y)) Y[bi] = y;
          a = a.next;
        } while (a);
      }

      // Add b to the queue.
      const b = {index: bi, next: null};
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }

    return Y;
  }

  const beeswarmPlot = (selection) => {
    const svg = selection
      .selectAll('svg.beeswarm-plot')
      .data([null])
      .join('svg')
      .attr('class', 'beeswarm-plot')
      .attr('width', width)
      .attr('height', height);

    svg
      .attr('font-family', 'sans-serif')
      .attr('font-size', fontSize);

    let xRange = extent(data);
    xRange[0] = xMin ? xMin : xRange[0];
    xRange[1] = xMax ? xMax : xRange[1];

    const x = scaleLinear()
      .domain(xRange)
      .range([margin.left, width - margin.right]);

    const y = dodge(data.map(d => x(d)), radius * 2 + markerPadding)
      .map(d => d + margin.top + plotPadding);

    svg
      .selectAll('circle')
      .data(range(data.length))
      .join('circle')
      .attr('cx', (d) => x(data[d]))
      .attr('cy', (d) => y[d])
      .attr('r', radius)
      .attr('fill', color)
      .attr('opacity', opacity)
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth)
      .append("title")
      .text((d) => `Value:\n${data[d]}`);

    if (!removeAxis) {
      svg
        .selectAll('.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${margin.top})`)
        .call(axisTop(x));

      if (xLabel) {
        svg
          .selectAll('.x-axis-label')
          .data([null])
          .join('text')
          .attr('class', 'x-axis-label')
          .attr('text-anchor', 'end')
          .attr('x', width)
          .attr('y',  margin.top * (2/3))
          .text(xLabel)
          .style('font-size', fontSize * (3/4));
      }
    }

    if (title) {
      svg
        .selectAll('.title')
        .data([null])
        .join('text')
        .attr('class', 'title')
        .text(title)
        .attr('text-anchor', 'middle')
        .attr('x',  width / 2)
        .attr('y', margin.top / 3);
    }
  }

  beeswarmPlot.width = function (_) {
    return arguments.length ? ((width = +_), beeswarmPlot) : width;
  }

  beeswarmPlot.height = function (_) {
    return arguments.length ? ((height = +_), beeswarmPlot) : height;
  }

  beeswarmPlot.margin = function (_) {
    return arguments.length ? ((margin = _), beeswarmPlot) : margin;
  }

  beeswarmPlot.data = function (_) {
    return arguments.length ? ((data = _), beeswarmPlot) : data;
  }

  beeswarmPlot.xMin = function (_) {
    return arguments.length ? ((xMin = +_), beeswarmPlot) : xMin;
  }

  beeswarmPlot.xMax = function (_) {
    return arguments.length ? ((xMax = +_), beeswarmPlot) : xMax;
  }

  beeswarmPlot.xLabel = function (_) {
    return arguments.length ? ((xLabel = _), beeswarmPlot) : xLabel;
  }

  beeswarmPlot.title = function (_) {
    return arguments.length ? ((title = _), beeswarmPlot) : title;
  }

  beeswarmPlot.color = function (_) {
    return arguments.length ? ((color = _), beeswarmPlot) : color;
  }

  beeswarmPlot.strokeWidth = function (_) {
    return arguments.length ? ((strokeWidth = +_), beeswarmPlot) : strokeWidth;
  }

  beeswarmPlot.opacity = function (_) {
    return arguments.length ? ((opacity = +_), beeswarmPlot) : opacity;
  }

  beeswarmPlot.radius = function (_) {
    return arguments.length ? ((radius = +_), beeswarmPlot) : radius;
  }

  beeswarmPlot.markerPadding = function (_) {
    return arguments.length ? ((markerPadding = +_), beeswarmPlot) : markerPadding;
  }

  beeswarmPlot.plotPadding = function (_) {
    return arguments.length ? ((plotPadding = +_), beeswarmPlot) : plotPadding;
  }

  beeswarmPlot.fontSize = function (_) {
    return arguments.length ? ((fontSize = +_), beeswarmPlot) : fontSize;
  }

  beeswarmPlot.removeAxis = function (_) {
    return arguments.length ? ((removeAxis = _), beeswarmPlot) : removeAxis;
  }

  return beeswarmPlot;
}
