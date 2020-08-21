makeResponsive();

d3.select(window).on("resize", makeResponsive);

//Testing passing cuisine variable from flask/////////////////////////////////
// GET is the default method, so we don't need to set it
fetch('/ingredients/<cuisine>')
    .then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('GET response text 1:');
        console.log(text); // Print the greeting as text
    });

// Send the same request
fetch('/ingredients/<cuisine>')
    .then(function (response) {
        return response.headers; // But parse it as JSON this time
    })  
    .then(function (json) {
        console.log('GET response as JSON 2:');
        console.log(json); // Here’s our JSON object
    })
//end Testing passing cuisine variable from flask/////////////////////////////////


function makeResponsive() {
  let svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  let svgWidth = window.innerWidth;
  let svgHeight = window.innerHeight;

  let margin = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  };

  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;
  padding = 1.8, // separation between same-color nodes
    clusterPadding = 6, // separation between different-color nodes
    maxRadius = 60;

  let svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // For legend
  let legendArea = d3.select("svg").append("g")
    .attr("transform", "translate(10,-90)");
  let legendNames = ["Produce", "Baking", "Spices and Seasonings", "Milk, Eggs, Other Dairy", "Canned and Jarred", "Cheese", "Meat", "Oil, Vinegar, Salad Dressing", "Condiments", "Ethnic Foods", "Pasta and Rice", "Sweet Snacks & Nuts", "Beverages", "Bakery/Bread", "Nut butters, Jams, and Honey"];
  let legendColors = ["#8FBC8B", "#F0E68C", "#FFB6C1", "#FFF8DC", "#D3D3D3", "#FFFACD", "#F08080", "#FFA07A", "#D8BFD8", "#B0E0E6", "#F5DEB3", "#DB7093", "#BC8F8F", "#D2B48C", "#FFD700"];
  let yVal = 100;
  // Handmade legend
  for (let i = 0; i < legendNames.length; i++) {
    let xCircle = 50;
    let xText = 70;

    yVal = yVal + 30;

    legendArea.append("circle").attr("cx", xCircle).attr("cy", yVal).attr("r", 10).style("fill", legendColors[i]).style("stroke", "black");
    legendArea.append("text").attr("x", xText).attr("y", yVal).text(legendNames[i]).style("font-size", "15px").attr("alignment-baseline", "middle");
  };


  let color = d3.scale.ordinal()
    .domain(["Produce", "Baking", "Spices and Seasonings", "Milk, Eggs, Other Dairy", "Canned and Jarred", "Cheese", "Meat", "Oil, Vinegar, Salad Dressing", "Condiments", "Ethnic Foods", "Pasta and Rice", "Sweet Snacks & Nuts", "Beverages", "Bakery/Bread", "Nut butters, Jams, and Honey"])
    .range(["#8FBC8B", "#F0E68C", "#FFB6C1", "#FFF8DC", "#D3D3D3", "#FFFACD", "#F08080", "#FFA07A", "#D8BFD8", "#B0E0E6", "#F5DEB3", "#DB7093", "#BC8F8F", "#D2B48C", "#FFD700"]);


  d3.text("../static/resources/ingredientData.csv", function (error, text) {
    if (error) throw error;
    let colNames = "text,size,group\n" + text;
    let data = d3.csv.parse(colNames);

    data.forEach(function (d) {
      d.size = +d.size;
      //console.log(d.size)
    });


    //unique cluster/group id's
    let cs = [];
    data.forEach(function (d) {
      if (!cs.contains(d.group)) {
        cs.push(d.group);
      }
    });
    // console.log(cs)
    let n = data.length, // total number of nodes
      m = cs.length; // number of distinct clusters

    //create clusters and nodes
    let clusters = new Array(m);
    let nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push(create_nodes(data, i));
    }

    // console.log(width)
    // console.log(height)
    let force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(.02)
      .charge(0)
      .on("tick", tick)
      .start();


    let node = svg.selectAll("circle")
      .data(nodes)
      .enter().append("g").call(force.drag);


    node.append("circle")
      .style("fill", function (d) {
        return color(d.cluster);
      })
      .attr("value", function (d) {
        return d.text.substring(0, d.radius / 3)
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

    // begin section from homework
    let bubbleGroup = d3.select("svg").selectAll("g");
    let ingredientArray = [];

    bubbleGroup.selectAll("circle")
      .on("click", function () {
        let value = d3.select(this).attr("value");

        if (ingredientArray.includes(value)) {
          for (let i = 0; i < ingredientArray.length; i++) {
            if (ingredientArray[i] === value) {
              ingredientArray.splice(i, 1);
            }
          }
        } else {
          ingredientArray.push(value);
        };
        console.log(value);
        console.log(ingredientArray)

        let opaqStyle = d3.select(this).style("opacity");
        if (opaqStyle == 1) {
          d3.select(this).style("opacity", .6).style("stroke", "white");
        } else {
          d3.select(this).style("opacity", 1).style("stroke", "black");
        }
        return ingredientArray;
      });

    // end section from homework

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
      //console.log(e.alpha)
      node.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function (d) {
          let k = "translate(" + d.x + "," + d.y + ")";
          // console.log(d.x,",",d.y);
          return k;
        })

    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
      return function (d) {
        let cluster = clusters[d.cluster];
        //console.log(cluster);
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
};