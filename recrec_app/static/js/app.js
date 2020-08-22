makeResponsive();

d3.select(window).on("resize", makeResponsive);



// GET cuisine from cookie on map page
function getCuisine() {
  fetch('/passCuisine')
    .then(function (response) {
      return response.text();
    }).then(function (text) {
      cuisine = text;
      console.log('GET response cuisine:');
      console.log(cuisine); // Print the greeting as text
      return cuisine;
    });
}

function loadIngredients(array){
  fetch("/loadIngredients", {
    method: "POST",
    // credentials: "include",
    body: array,
    cache: "no-cache",
    // headers: new Headers({
    // "content-type": "application/json"
    // })
  })
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`Looks like there was a problem. Status code: ${response.status}`);
        return;
      }
      response.then(function (data) {
        console.log("Ingredient Array sent to cookie:");
        console.log(data);
      });
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
  });
}

// async function populateBubbles(){
//   let cuisine = await getCuisine();
//   console.log("Outside of fetch cuisine: ", cuisine);
//   return cuisine;
// }

// populateBubbles().then(result => {
//   // got final result
//   console.log("Outside of fetch cuisine: ", result);
// }).catch(err => {
//   console.log(err)
// });

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
  let legendNames = ["Alcoholic Beverages","Bakery/Bread","Baking","Beverages","Canned and Jarred","Cereal","Cheese","Condiments","Ethnic Foods","Frozen/Refridgerated","Meat","Milk, Eggs, Other Dairy","Nut butters, Jams, and Honey","Nuts/Dried Fruits","Oil, Vinegar, Salad Dressing","Pasta and Rice","Produce","Seafood","Spices and Seasonings"];
  let legendColors = ["#BC8F8F","#D2B48C","#F0E68C","#E6E6FA","#D3D3D3","#DEB887","#FFFACD","#D8BFD8","#B0E0E6","#E0FFFF","#F08080","#FFF8DC","#FFD700","#DB7093","#FFA07A","#F5DEB3","#8FBC8B","#E9967A","#FFB6C1"];
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
    .domain(["Alcoholic Beverages","Bakery/Bread","Baking","Beverages","Canned and Jarred","Cereal","Cheese","Condiments","Ethnic Foods","Frozen/Refridgerated","Meat","Milk, Eggs, Other Dairy","Nut butters, Jams, and Honey","Nuts/Dried Fruits","Oil, Vinegar, Salad Dressing","Pasta and Rice","Produce","Seafood","Spices and Seasonings"])
    .range(["#BC8F8F","#D2B48C","#F0E68C","#E6E6FA","#D3D3D3","#DEB887","#FFFACD","#D8BFD8","#B0E0E6","#E0FFFF","#F08080","#FFF8DC","#FFD700","#DB7093","#FFA07A","#F5DEB3","#8FBC8B","#E9967A","#FFB6C1"]);

  fetch('/passCuisine')
    .then(function (response) {
      return response.text();
    }).then(function (text) {
      cuisine = text;
      console.log('GET response cuisine:');
      console.log(cuisine); // Print the greeting as text
      return cuisine;
    }).then(function (cuisine) {
      cuisine = cuisine.toLowerCase();
      cuisine = cuisine.replace(" ", "_");
      console.log("cuisine after then: ", cuisine);
      d3.text(`../static/resources/ingredientData.csv`, function (error, text) {
      // d3.text(`../static/resources/${cuisine}_ingredients.csv`, function (error, text) {
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
            console.log(ingredientArray);
            loadIngredients(ingredientArray);


            let opaqStyle = d3.select(this).style("opacity");
            if (opaqStyle == 1) {
              d3.select(this).style("opacity", .6).style("stroke", "white");
            } else {
              d3.select(this).style("opacity", 1).style("stroke", "black");
            }
            return ingredientArray;
            //send array to cookie
            

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
          }
        }
      });//end d3.text csv
    });//end fetch
}//end makeResponsive

Array.prototype.contains = function (v) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};

