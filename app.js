let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

let drawMap = () => {
    canvas
        .selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (countyDataItem) => {
            let id = countyDataItem["id"];
            let county = educationData.find((item) => {
                return item["fips"] === id;
            });
            let percentage = county["bachelorsOrHigher"];
            if (percentage <= 15) {
                return "tomato";
            } else if (percentage <= 30) {
                return "orange";
            } else if (percentage <= 45) {
                return "lightgreen";
            } else {
                return "limeGreen";
            }
        })
        .attr("data-fips", (countyDataItem) => {
            return countyDataItem["id"];
        })
        .attr("data-education", (countyDataItem) => {
            let id = countyDataItem["id"];
            let county = educationData.find((item) => {
                return item["fips"] === id;
            });
            let percentage = county["bachelorsOrHigher"];
            return percentage;
        })
        .on("mouseover", (event, countyDataItem) => {
            tooltip.style("visibility", "visible");
            let id = countyDataItem["id"];
            let county = educationData.find((item) => {
                return item["fips"] === id;
            });
            tooltip.text(
                county["fips"] +
                " - " +
                county["area_name"] +
                ", " +
                county["state"] +
                " : " +
                county["bachelorsOrHigher"] +
                "%"
            )
            tooltip.attr("data-education", county["bachelorsOrHigher"])
        })
        .on("mousemove", (event) => {
            tooltip.style("top", event.pageY + 10 + "px");
            tooltip.style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });
};

d3.json(countyURL).then((data, error) => {
    if (error) {
        console.log(error);
    } else {
        countyData = topojson.feature(data, data.objects.counties).features;
        console.log(countyData);

        d3.json(educationURL).then((data, error) => {
            if (error) {
                console.log(error);
            } else {
                educationData = data;
                console.log(educationData);
                drawMap();
            }
        });
    }
});
