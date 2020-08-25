'use strict';

function ldaJsonToChart(data) {
    let topWordArray = data.map((obj) => {
        return obj.TOP_WORDS;
    });
    topWordArray = topWordArray.join(' ').split(' ');

    // using example function from https://www.highcharts.com/demo/wordcloud
    const wordCloudData = Highcharts.reduce(topWordArray, (arr, word) => {
        let obj = Highcharts.find(arr, (obj) => {
            return obj.name === word;
        });
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);

    wordCloudChart.series[0].setData(wordCloudData);
}

function ldaJsonToTable(data) {


    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.getElementById('lda-info');
    // clear old data first
    table.innerHTML = '';

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (i = 0; i < col.length; i++) {
        var th = document.createElement('th');      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (i = 0; i < data.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]];
        }
    }
}

function ldaJSONToGraph(data){

    let networkData = getNetworkNodesLinks(data);
    var graphData = {
        'nodes': networkData.nodes,
        'links': networkData.edges
    };

    var svg;
	var node;
	var link;
	var colors;
	var simulation;
	var cursor;
    var radius = 6;
    var width;
    var height;
    var edgepaths;
    var edgelabels;
    var ta_type;

	function initD3(){

		//D3 setup
		colors = d3.scaleOrdinal(d3.schemeCategory10);
        svg = d3.select('#link-chart'),
        width = 900,
		height = 1000,	
		node,
		link;

		svg.append('defs').append('marker')
			.attrs({'id':'arrowhead',
				'viewBox':'-0 -5 10 10',
				'refX':13,
				'refY':0,
				'orient':'auto',
				'markerWidth':13,
				'markerHeight':13,
				'xoverflow':'visible'})
			.append('svg:path')
			.attr('d', 'M 0,-5 L 10 ,0 L 0,5')
			.attr('fill', '#999')
			.style('stroke','none');

		cursor = svg.append('circle')
		.attr('r', 30)
		.attr('transform', 'translate(-100,-100)')
		.attr('class', 'cursor');	
		
		svg.on('click', function(d) {
            var coords = d3.mouse(this);			
        });  
        
        //WHERE MOUSEMOVE GOES
		
		simulation = d3.forceSimulation()
			.force('link', d3.forceLink().id(function (d) {return d.id;}).distance(200).strength(15))
			.force('charge', d3.forceManyBody())
			.force('center', d3.forceCenter(width / 1.85, height / 1.55));

	}


	function update(links, nodes) {
        console.log(JSON.stringify(links,null,2));
        console.log(JSON.stringify(nodes,null,2));
		link = svg.selectAll('.link')
			.data(links)
			.enter()
			.append('line')
			.attr('class', 'link')
			.attr('marker-end','url(#arrowhead)');

		link.append('title')
			.text(function (d) {return d.type;});

		// edgepaths = svg.selectAll('.edgepath')
		// 	.data(links)
		// 	.enter()
		// 	.append('path')
		// 	.attrs({
		// 		'class': 'edgepath',
		// 		'fill-opacity': 9, 
        //         'stroke-opacity': 9,
        //         'id': function(d,i){return 'edgepath' + i;} 
		// 	})
		// 	.style('pointer-events', 'none');

		// edgelabels = svg.selectAll('.edgelabel')
		// 	.data(links)
		// 	.enter()
		// 	.append('text')
		// 	.style('pointer-events', 'none')
		// 	.attrs({
		// 		'class': 'edgelabel',
		// 		'font-size': 10,
        //         'fill': '#aaa',
        //         'id': function(d,i){return 'edgelabel' + i;} 
        // 	});
        
        edgepaths = svg.selectAll('.edgepath')
            .data(links)
            .enter()
            .append('path')
            .attrs({
                'class': 'edgepath',
                'fill-opacity': 9,
                'stroke-opacity': 9,
                'id': function(d,i){return 'edgepath' + i;}
        })
        .style('pointer-events', 'none');

        edgelabels = svg.selectAll('.edgelabel')
            .data(links)
            .enter()
            .append('text')
            .style('pointer-events', 'none')
            .attrs({
                'class': 'edgelabel',
                'font-size': 10,
                'fill': '#aaa',
                'id': function(d,i){return 'edgelabel' + i;}
});

        
		edgelabels.append('textPath')
			.attr('xlink:href', function (d, i) {return '#edgepath' + i;})
			.style('text-anchor', 'middle')
			.style('pointer-events', 'none')
			.attr('startOffset', '50%')
			.text(function (d) {return d.type;});

		node = svg.selectAll('.node')
			.data(nodes)
			.enter()
			.append('g')
			.attr('class', 'node')
			.on('dblclick', showForm) 
			.call(d3.drag()
					.on('start', dragstarted)
					.on('drag', dragged)
			);			

		node.append('rect')
			.attr('height', 20)
			.attr('width', 20)			
			.style('fill', '#FFF');
			
		
		node.append('svg:foreignObject')
			.attr('height', '20px')
			.attr('width', '120px')
			.html(function (d) {
                return '<i style=\'font-size: 11px;\' cursor=\'pointer\'>'+d.name+'</i>';
            });

		node.append('title')
			.text(function (d) {return d.name;});

		node.append('text')
			.attr('dy', -3);

		simulation
		.force('link', d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(.1))
        .force('center', d3.forceCenter().x(width * .5).y(height * .5))
        .force('charge', d3.forceManyBody().strength(-20))
			.nodes(nodes)
			.on('tick', ticked);


		simulation.force('link')
			.links(links);
	}

	function ticked() {

		link
			.attr('x1', function (d) {return d.source.x;})
			.attr('y1', function (d) {return d.source.y;})
			.attr('x2', function (d) {return d.target.x;})
			.attr('y2', function (d) {return d.target.y;});

   
		node
			.attr('cx', function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
			.attr('cy', function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
			.attr('transform', function (d) {return 'translate(' + d.x + ', ' + d.y + ')';});

		edgepaths.attr('d', function (d) {
			return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
		});
	
	}

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	function showForm(){}
	
	function start(){
		displayQueryGraphData(graphData.nodes,graphData.links);

    }
    
	function displayQueryGraphData(vertexData,edgeData){
			
		document.getElementById('link-chart').innerHTML = ''; 
		
		initD3();

		update(edgeData,vertexData);
		
    }
    
    start();

}

function getNetworkNodesLinks(data){

    var nodeData = [{'name': 'Topic Model Network', 'label': 'Topic Model Network', 'id': 9999}];
    var linkData = [];

    data.forEach((input) => {

        let splitWords = input.TOP_WORDS.split(' ');
        var id = input.TOPIC_ID*1000;
        let topicNode = {'name': 'TOPIC '+input.TOPIC_ID, 'label': 'TOPIC '+input.TOPIC_ID, 'id': id};
        nodeData.push(topicNode);
        linkData.push({'source': 9999, 'target': topicNode.id, 'type': 'Central Connection'});
        
        splitWords.forEach((words) => {
            var previousOccurance = nodeData.filter((nodes) => {
                return nodes.name == words;
            });

            if(previousOccurance.length >= 1){
                linkData.push({'source': topicNode.id, 'target': previousOccurance[0].id, 'type': input.PROBABILITY.toFixed(3).toString()});
            }else{
                id++;
                nodeData.push({'name': words, 'label': words, 'id': id});
                linkData.push({'source': topicNode.id, 'target': id, 'type': input.PROBABILITY.toFixed(3).toString()});
            }
        });
    });
    
    return {'nodes': nodeData, 'edges': linkData};
}


// eslint-disable-next-line no-unused-vars
const lda_info_get = (country_capital) => {

    const year = document.getElementById('select-year').value;
    const covidSwitch = document.getElementById('covid-switch').value;
    const url = `/acledLDA?&year=${year}&capital=${encodeURIComponent(country_capital)}&slider=${covidSwitch}`;

    btnHandlers.toggleBusy();
    fetch(url)
        .then(res => res.json())
        .then((res) => {
            btnHandlers.toggleBusy();
            if (res.error) {
                throw new Error(res.error);
            }
            btnHandlers.notesBtn.disabled = false;

            ldaJsonToTable(res.data);
            ldaJsonToChart(res.data);
            ldaJSONToGraph(res.data);

        }).catch(error => {
            console.error('Error fetching data from /acledLDA', error);
        });
};
