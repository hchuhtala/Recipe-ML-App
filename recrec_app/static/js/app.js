var chartDiv = document.getElementById("chart");
var svgArea = d3.select(chartDiv).append("svg");

function makeResponsive() {
  // Extract the width and height that was computed by CSS.
  var width = chartDiv.clientWidth;
  var height = chartDiv.clientHeight;

  let vbWidth = width*1.5;
  let vbHeight = height*1.5;

  svgArea
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${vbWidth} ${vbHeight}`)
    .attr("overflow","scroll")
    .attr("preserveAspectRatio","none");
  //console.log("svg",svg);

  let margin = {
    top: 20,
    right: 40,
    bottom: 5,
    left: 20
  };


  padding = 1.8, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 50;

  let color = d3.scale.ordinal()
    .range(["#8FBC8B", "#F0E68C", "#FFB6C1", "#FFF8DC", "#D3D3D3", "#FFFACD", "#F08080", "#FFA07A", "#D8BFD8", "#B0E0E6", "#F5DEB3", "#DB7093", "#BC8F8F", "#D2B48C", "#FFD700"]);

  d3.text("static/resources/ingredientData.csv", function (error, text) {
    if (error) throw error;
    let colNames = "text,size,group\n" + text;
    let data = d3.csv.parse(colNames);

    data.forEach(function (d) {
      d.size = +d.size;
    });


    //unique cluster/group id's
    let cs = [];
    data.forEach(function (d) {
      if (!cs.contains(d.group)) {
        cs.push(d.group);
      }
    });

    let n = data.length, // total number of nodes
      m = cs.length; // number of distinct clusters

    //create clusters and nodes
    let clusters = new Array(m);
    let nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push(create_nodes(data, i));
    }

    let force = d3.layout.force()
      .nodes(nodes)
      .size([width*1.5, height*1.5])
      .gravity(.02)
      .charge(0)
      .on("tick", tick)
      .start();



    // svgArea.append("text")
    //   .attr("x", (width / 2))             
    //   .attr("y", 0 - (margin.top / 2))
    //   .attr("text-anchor", "left")  
    //   .style("font-size", "16px") 
    //   .text("Select Your Ingredients...");


    let node = svgArea.selectAll("circle")
      .data(nodes)
      .enter().append("g").call(force.drag);


    node.append("circle")
      .style("fill", function (d) {
        return color(d.cluster);
      })
      .attr("r", function (d) {
        return d.radius
      })


    node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .text(function (d) {
        return d.text.substring(0, d.radius / 3);
      });




    function create_nodes(data, node_counter) {
      let i = cs.indexOf(data[node_counter].group),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
          cluster: i,
          radius: data[node_counter].size * 1.5,
          text: data[node_counter].text,
          x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    };



    function tick(e) {
      node.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) {
          let k = "translate(" + d.x + "," + d.y + ")";
          return k;
        })

    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function (d) {
        let cluster = clusters[d.cluster];
        if (cluster === d) return;
        let x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
        if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
      let quadtree = d3.geom.quadtree(nodes);
      return function (d) {
        let r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
        quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            let x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
            if (l < r) {
              l = (l - r) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
  });

  Array.prototype.contains = function (v) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === v) return true;
    }
    return false;
  };
}

makeResponsive();

window.addEventListener("resize", makeResponsive);