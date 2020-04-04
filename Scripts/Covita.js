/*
 * Copyright(c) 2020, Michele Mottini
 * 
 * This file is licensed under the MIT License - see License.txt
*/

var G = {};

$(function () {
	var chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)',
		black: 'rgb(0,0,0)'
	};

	var ctx = $('#canvas')[0].getContext('2d');
	var chartConfig = {
		type: 'line',
		data: {
			labels: [],
			datasets: []
		},
		options: {
			responsive: true,
			title: {
				fontSize: 18,
				fontStyle: 'normal',
				display: true
			},
			tooltips: {
				mode: 'index',
				intersect: false
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: false
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: false
					},
					ticks: {
						callback: function (value) {
							return Number(value).toLocaleString();
						}
					}
				}]
			},
			elements: {
				line: {
					tension: 0,
					fill: false
				}
			}
		}
	};
	var chart = new Chart(ctx, chartConfig);

	var months = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];

	var previousRegion = null;

	function refresh() {
		var region = $("#region").children("option:selected").val();
		var province = $("#province").children("option:selected").val();
		var delta = $("#values").children("option:selected").val() === "daily";
		if (!region) {
			initProvince(null);
			createChart("dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv", delta, null);
		} else {
			if (region !== previousRegion) {
				initProvince(regionProvinces[region]);
			}
			if (province) {
				createChart("dati-province/dpc-covid19-ita-province.csv", delta, province);
			} else {
				createChart("dati-regioni/dpc-covid19-ita-regioni.csv", delta, region);
			}
		}
		previousRegion = region;
	}

	refresh();

	$("#region").change(refresh);
	$("#province").change(refresh);
	$("#values").change(refresh);

	function initProvince(provinces) {
		var $province = $("#province");
		$province.empty();
		$province.append($('<option></option>').val("").text(" - "));
		if (provinces) {
			for (var i = 0; i < provinces.length; i++) {
				$("#province").append($('<option></option>').text(provinces[i]));
			}
		}
		$province.val("");
	}

	var regionProvinces = {
		"Abruzzo": ["Chieti", "L'Aquila", "Pescara", "Teramo"],
		"Basilicata": ["Matera", "Potenza"],
		"P.A. Bolzano": ["Bolzano"],
		"Calabria": ["Catanzaro", "Cosenza", "Crotone", "Reggio di Calabria", "Vibo Valentia"],
		"Campania": ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"],
		"Emilia-Romagna": ["Bologna", "Ferrara", "Forlì-Cesena", "Modena", "Parma", "Piacenza", "Ravenna", "Reggio nell'Emilia", "Rimini"],
		"Friuli Venezia Giulia": ["Gorizia", "Pordenone", "Trieste", "Udine"],
		"Lazio": ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"],
		"Liguria": ["Genova", "Imperia", "La Spezia", "Savona"],
		"Lombardia": ["Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Milano", "Monza e della Brianza", "Pavia", "Sondrio", "Varese"],
		"Marche": ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"],
		"Molise": ["Campobasso", "Isernia"],
		"Piemonte": ["Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Torino", "Verbano-Cusio-Ossola", "Vercelli"],
		"Puglia": ["Bari", "Barletta-Andria-Trani", "Brindisi", "Foggia", "Lecce", "Taranto"],
		"Sardegna": ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"],
		"Sicilia": ["Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Palermo", "Ragusa", "Siracusa", "Trapani"],
		"Toscana": ["Arezzo", "Firenze", "Grosseto", "Livorno", "Lucca", "Massa Carrara", "Pisa", "Pistoia", "Prato", "Siena"],
		"P.A. Trento": ["Trento"],
		"Umbria": ["Perugia", "Terni"],
		"Valle d'Aosta": ["Aosta"],
		"Veneto": ["Belluno", "Padova", "Rovigo", "Treviso", "Venezia", "Verona", "Vicenza"]
	};

	var dateColumn = "data";
	var regionColumn = "denominazione_regione";
	var provinceColumn = "denominazione_provincia";
	var totalColumn = "totale_casi";

	var datasetDefinitions = [
		{
			column: "terapia_intensiva",
			label: 'Terapia intensiva',
			color: chartColors.purple
		},
		{
			column: "totale_ospedalizzati",
			label: 'Ospedalizzati',
			color: chartColors.red
		}, {
			column: "isolamento_domiciliare",
			label: 'Isolamento domiciliare',
			color: chartColors.blue
		}, {
			column: "totale_positivi",
			label: 'Positivi',
			color: chartColors.orange
		}, {
			column: "dimessi_guariti",
			label: 'Dimessi',
			color: chartColors.green
		}, {
			column: "deceduti",
			label: 'Deceduti',
			color: chartColors.black
		}, {
			column: totalColumn,
			label: 'Casi',
			color: chartColors.yellow
		}, {
			column: "tamponi",
			label: 'Tamponi',
			color: chartColors,
			hidden: true
		}];

	function createChart(path, delta, filter) {
		$.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/" + path, function (data) {
			var result = $.csv.toArrays(data);

			var columns = result[0];
			var dateColumnIndex = columnIndexThrows(columns, dateColumn);
			var filterColumnIndex = null;
			var onlyTotal = false;
			if (filter) {
				filterColumnIndex = columnIndex(columns, provinceColumn);
				if (filterColumnIndex >= 0) {
					onlyTotal = true;
				} else {
					filterColumnIndex = columnIndex(columns, regionColumn);
					if (filterColumnIndex < 0) {
						throw "There is no column '" + regionColumn + "' nor '" + provinceColumn + "'";
					}
				}
			}

			var labels = [];
			var datasets = createDataSets(columns, onlyTotal ? totalColumn : null);
			var previousLine = null;
			for (var i = 1; i < result.length; i++) {
				var line = result[i];
				if (!filter || line[filterColumnIndex] === filter) {
					var lineDate = line[dateColumnIndex];
					labels.push(parseInt(lineDate.substr(8, 2)) + " " + months[parseInt(lineDate.substr(5, 2)) - 1]);
					for (var j = 0; j < datasets.length; j++) {
						var dataset = datasets[j];
						var value = line[dataset.index];
						if (delta && previousLine) {
							value -= previousLine[dataset.index];
						}
						dataset.data.push(value);
					}
					previousLine = line;
				}
			}
			chartConfig.options.title.text = (filter || "Italia") + (delta ? " - giornalieri" : " - totali");
			chartConfig.data.labels = labels;
			chartConfig.data.datasets = datasets;
			chart.update();
		});
	}

	function createDataSets(columns, filter) {
		var result = [];
		for (var i = 0; i < datasetDefinitions.length; i++) {
			var datasetDefinition = datasetDefinitions[i];
			if (!filter || datasetDefinition.column === filter) {
				result.push(
					{
						label: datasetDefinition.label,
						backgroundColor: datasetDefinition.color,
						borderColor: datasetDefinition.color,
						hidden: datasetDefinition.hidden || false,
						data: [],
						index: columnIndexThrows(columns, datasetDefinition.column)
					}
				);
			}
		}
		return result;
	}

	function columnIndexThrows(columns, column) {
		var result = columnIndex(columns, column);
		if (result < 0) {
			throw "There is no column '" + column + "'";
		}
		return result;
	}

	function columnIndex(columns, column) {
		for (var i = 0; i < columns.length; i++) {
			if (columns[i] === column) {
				return i;
			}
		}
		return -1;
	}
});

