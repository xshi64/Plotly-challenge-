function init() {
    var dropdownMenu=d3.select("#selDataset");
    d3.json("data/samples.json").then((data)=> {        
        data.names.forEach(name => {
            dropdownMenu.append("option").text(name).property("value");
        });
        demographicInfo(data.names[0]);
        plotly(data.names[0]);        
    });
}

init();

d3.select("#selDataset").on("change",updatePlotly);

function demographicInfo(id) {
    d3.json("data/samples.json").then((data)=> {        
        var metadata = data.metadata;        
        var sample = metadata.filter(meta => meta.id == id)[0];
        console.log(sample);
        var demographicDisplay = d3.select("#sample-metadata");
        demographicDisplay.html("");
        Object.entries(sample).forEach((item) =>{
            demographicDisplay.append("h6").text(item[0] + ": " +item[1]+"\n");
        })

    });
}

function updatePlotly() {
    var dropdownMenu=d3.select("#selDataset");
    var id = dropdownMenu.property("value");
    console.log(id);
    demographicInfo(id);
    plotly(id);
}

function plotly(id) {
    d3.json("data/samples.json").then((data) =>{
        var samples = data.samples;        
        var sampleData = samples.filter(d => d.id == id.toString());
        console.log(sampleData);

        var sample_values = sampleData[0].sample_values.slice(0,10).reverse();
        var otu_ids = sampleData[0].otu_ids.slice(0,10).reverse();
        otu_ids = otu_ids.map(d => "OTU " + d + " ");
        var otu_labels = sampleData[0].otu_labels.slice(0,10).reverse();

        var trace1 = {
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            color: "blue",
            type: "bar",
            orientation: "h"
        };
        var data1 = [trace1];
        Plotly.newPlot("bar",data1);

        var trace2 ={
            x: sampleData[0].otu_ids,
            y: sampleData[0].sample_values,
            mode: "markers",
            marker: {
                size: sampleData[0].sample_values,
                color: sampleData[0].otu_ids
            },
            text: sampleData[0].otu_labels
        };
        var data2 = [trace2];
        var layout2 = {
            xaxis:{title: "OTU ID"},
            width: 1200,
            height: 600
        };
        Plotly.newPlot("bubble",data2,layout2);

        var sample_wfreq = data.metadata.filter(d => d.id == id.toString())[0].wfreq;
        console.log(sample_wfreq);
        var data3 = [{
                domain: { x: [0, 1], y: [0, 1] },
                value: sample_wfreq,
                title: { text: "Belly Button Washing Frequency"},
                type: "indicator",
                mode: "gauge+number",                
                gauge: {
                    axis:{range: [0,9]},
                    steps: [
                        {range: [0,1], color: "rgb(255,255,255)"},
                        {range: [1,2], color: "rgb(225,255,225)"},
                        {range: [2,3], color: "rgb(205,255,205)"},
                        {range: [3,4], color: "rgb(185,255,185)"},
                        {range: [4,5], color: "rgb(165,255,165)"},
                        {range: [5,6], color: "rgb(145,255,145)"},
                        {range: [6,7], color: "rgb(125,255,125)"},
                        {range: [7,8], color: "rgb(105,255,105)"},
                        {range: [8,9], color: "rgb(85,255,85)"},                         
                    ]
                }                
            }
        ];        
        var layout3 = { width: 600, height: 600, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', data3, layout3);
    });
}