var w = document.body.clientWidth - 10, h = w / 3;
var sort = null;

var div = d3.select("#chart").append("div").style("width", w + "px").style(
		"height", h + "px").style("position", "relative").style("margin-left",
		"auto").style("margin-right", "auto");

var treemap = drawTreemap();

window.onresize = function(event) {
	if(typeof current_json !== "undefined") {
		var w = document.body.clientWidth, h = w / 3;
		treemap.size([ w, h ]);
		div.style("margin-left", "auto");
		div.style("margin-right", "auto");;
		div.style("height",h + "px");
		load(cache);
	}
};

function drawTreemap() {
	return d3.layout.treemap().size([ w, h ]).sticky(false).value(
			function(d) {
				return Math.sqrt(d.dead_count + 10);
			});
}

function doLoad(dbtable) {
	if (typeof dbtable === "undefined") {
		dbtable = "includes";
	}
	json_base = "json.php?table=" + dbtable + "_tree&path=";
	saturation_base = "saturation.php?table=" + dbtable + "&path=";
	current_json = json_base;
	d3.json(json_base, load);
	document.getElementById("saturation").src = saturation_base;
	document.getElementById("index").style.display = "none";
	document.getElementById("treemap").style.display = "block";
}

function load(json) {
	cache = json;
	var subdiv = document.getElementById("chart").children[0];
	subdiv.innerHTML = "";
	div.data([ json ]).selectAll("div").data(treemap.nodes).enter().append(
			"div").attr("class", function(d) {
		return "cell " + d.class;
	}).style("background-color", function(d) {
		return d.color;
	}).call(cell).on("mouseup", mouseup).on("mouseover", mouseover).on(
			"mouseout", mouseout).style("contextmenu", "").text(function(d) {
		return d.children ? null : d.name;
	});

	crumbpath(json);
	if(sort == null) {
		table(json.children, "dead");
	} else {
		table(json.children, sort.getAttribute("sort"), sort.desc, sort.getAttribute("sort_type"));
	}
	d3.selectAll(".sortable").on(
			"click",
			function(d, i) {
				d3.selectAll(".sortable").each(function() {
					this.lastChild.src = "img/empty.gif";
				});
				sort = this;
				console.log(sort);
				if (this.desc) {
					this.lastChild.src = "img/ascending.gif";
					this.desc = 0;
				} else {
					this.desc = 1;
					this.lastChild.src = "img/descending.gif";
				}
				table(json.children, this.getAttribute("sort"), this.desc, this
						.getAttribute("sort_type"));
			});
}

function crumbpath(json) {
	var crumb = document.getElementById("current_path");

	var subpath = "";
	var html = "";
	var path;
	
	if (json.name == '/') {
		 path = [""];
	} else {
		path = json.name.split('/'); 
	}
		
	for (part in path) {
		if(subpath.length != 1) {
			subpath += "/";
		}
		subpath += path[part];
		html = html + "<a onclick=\"navigate('" + subpath + "')\" href=\"#\">"
				+ path[part] + "<a> / ";
		
	}

	crumb.innerHTML = html;
}

function navigate(path) {
	console.log(path);
	d3.json(json_base + path, load);
	document.getElementById("saturation").src = saturation_base + path;
}

function mouseup(d, i) {
	if (d3.event.button == 2) {
		if (d.parent.path == "/") {
			current_json = json_base;

		} else {
			current_json = json_base + d.parent.path;
		}
		d3.json(current_json, load);
		document.getElementById("saturation").src = saturation_base
				+ d.parent.path;
	} else {
		if (d.leaf == false) {
			current_json = json_base + d.path;
			d3.json(current_json, load);
			document.getElementById("saturation").src = saturation_base
					+ d.path;
		}
	}

	return false;
}

function mouseover(d, i) {
	d3.selectAll("." + d.class).classed("active", true);
	document.getElementById("current_file").innerHTML = d.name;
}

function mouseout(d, i) {
	d3.selectAll("." + d.class).classed("active", false);
	document.getElementById("current_file").innerHTML = "";
}

function cell() {
	this.style("left", function(d) {
		return d.x + "px";
	}).style("top", function(d) {
		return d.y + "px";
	}).style("width", function(d) {
		return d.dx - 1 + "px";
	}).style("height", function(d) {
		return d.dy - 1 + "px";
	});
}

function table(data, sort, desc, asString) {
	d3.select("#table tbody").selectAll("tr").remove();
	var table = d3.select("#table tbody").selectAll("tr").data(data).enter();
	var tr = table.append("tr").sort(function(a, b) {
		if (asString) {
			a = a[sort];
			b = b[sort];
		} else {
			a = parseInt(a[sort] ? a[sort] : 0);
			b = parseInt(b[sort] ? b[sort] : 0);
		}
		if (desc == 0) {
			return d3.ascending(a, b);
		} else {
			return d3.descending(a, b);
		}
	});

	tr.on("click", mouseup);

	tr.attr("class", function(d) {
		return d.class;
	}).on("mouseover", mouseover).on("mouseout", mouseout);

	tr.append("td").text(function(d) {
		return d.name;
	});

	tr.append("td").style("background-color", function(d) {
		return d.color;
	}).text(function(d) {
		return d.pct_dead + "%";
	});

	tr.append("td").text(function(d) {
		return d.dead_count;
	});

	tr.append("td").text(function(d) {
		return d.file_count;
	});

	tr.append("td").text(function(d) {
		return d.hit_count;
	});

	tr.append("td").text(function(d) {
		return d.changed_at;
	});

	tr.append("td").text(function(d) {
		return d.first_hit;
	});

}
