function buildMetadata(sample) {

  

  // Use `d3.json` to fetch the metadata for a sample
  const url = `/metadata/${sample}`;
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then(function(data) {
      let panel = d3.select("#sample-metadata");

      console.log(data);

      // Use `.html("") to clear any existing metadata
      panel.html("");
    
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function([key,value]){
      let row = panel.append("p");
      row.text(`${key}: ${value}`)
    });
    })
}



function buildCharts(sample) {


  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let chartUrl = `/samples/${sample}`;


  d3.json(chartUrl).then(function(bubble) {

      // @TODO: Build a Bubble Chart using the sample data

    let xValues = bubble.otu_ids;
    let yValues = bubble.sample_values;
    let markerSize = bubble.sample_values;
    let markerColor = bubble.otu_ids;
    let textValues = bubble.otu_labels;


    let traceBubble = {
      x:xValues,
      y:yValues,
      mode:"markers",
      text:textValues,
      textposition: 'top center',
      marker:{
        size: markerSize,
        color: markerColor


        }



      };

      let data = [traceBubble];

      let layout = {
        title: `Belly Button Biodiversity Bubble Chart`,
        xaxis : {
          title : `OTU ID`
        },
      };

      Plotly.newPlot("bubble", data, layout);

    
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(chartUrl).then(function(pie) {

      let values = pie.sample_values.slice(0,10);
      let labels = pie.otu_ids.slice(0,10);
      let hovertext = pie.otu_labels.slice(0,10);

      let tracePie = {
        values: values,
        labels: labels,
        type: "pie",
        hovertext: hovertext,
        textposition: 'inside'
      };

      let data1 = [tracePie];

      let layout ={
        title:`Belly Button Biodiversity Pie Chart`,

      };

      Plotly.newPlot("pie", data1, layout);

    // @TODO: Build a Gauge Chart
    // buildGauge(data.WFREQ);


    });
      
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
