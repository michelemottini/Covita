/*
 * Copyright(c) 2020, Michele Mottini
 * 
 * This file is licensed under the MIT License - see License.txt
*/

$(function () {
	var regionDescriptions = {
		"Abruzzo": {
			provinces: ["Chieti", "L'Aquila", "Pescara", "Teramo"],
			color: "#204051",
			population: 1311580
		},
		"Basilicata": {
			provinces: ["Matera", "Potenza"],
			color: "#AEEFEC",
			population: 562869
		},
		"P.A. Bolzano": {
			provinces: ["Bolzano"],
			color: "#FF5733",
			population: 533050
		},
		"Calabria": {
			provinces: ["Catanzaro", "Cosenza", "Crotone", "Reggio di Calabria", "Vibo Valentia"],
			color: "#2B080C",
			population: 1947131
		},
		"Campania": {
			provinces: ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"],
			color: "#005082",
			population: 5801692
		},
		"Emilia-Romagna": {
			provinces: ["Bologna", "Ferrara", "Forlì-Cesena", "Modena", "Parma", "Piacenza", "Ravenna", "Reggio nell'Emilia", "Rimini"],
			color: "#DBB9C3",
			population: 4459477
		},
		"Friuli Venezia Giulia": {
			provinces: ["Gorizia", "Pordenone", "Trieste", "Udine"],
			color: "#511845",
			population: 1215220
		},
		"Lazio": {
			provinces: ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"],
			color: "#3B6978",
			population: 5879082
		},
		"Liguria": {
			provinces: ["Genova", "Imperia", "La Spezia", "Savona"],
			color: "#F2ED6F",
			population: 1550640
		},
		"Lombardia": {
			provinces: ["Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Milano", "Monza e della Brianza", "Pavia", "Sondrio", "Varese"],
			color: "#EA6227",
			population: 10060574
		},
		"Marche": {
			provinces: ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"],
			color: "#4D4C79",
			population: 1525271
		},
		"Molise": {
			provinces: ["Campobasso", "Isernia"],
			color: "#2B585C",
			population: 305617
		},
		"Piemonte": {
			provinces: ["Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Torino", "Verbano-Cusio-Ossola", "Vercelli"],
			color: "#F2A51A",
			population: 4356406
		},
		"Puglia": {
			provinces: ["Bari", "Barletta-Andria-Trani", "Brindisi", "Foggia", "Lecce", "Taranto"],
			color: "#9DC6A7",
			population: 4029053
		},
		"Sardegna": {
			provinces: ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"],
			color: "#DBEBB5",
			population: 1639591
		},
		"Sicilia": {
			provinces: ["Agrigento", "Caltanissetta", "Catania", "Enna", "Messina", "Palermo", "Ragusa", "Siracusa", "Trapani"],
			color: "#639A67",
			population: 4999891
		},
		"Toscana": {
			provinces: ["Arezzo", "Firenze", "Grosseto", "Livorno", "Lucca", "Massa Carrara", "Pisa", "Pistoia", "Prato", "Siena"],
			color: "#827397",
			population: 3729641
		},
		"P.A. Trento": {
			provinces: ["Trento"],
			color: "#C70039",
			population: 541098
		},
		"Umbria": {
			provinces: ["Perugia", "Terni"],
			color: "#363062",
			population: 882015
		},
		"Valle d'Aosta": {
			provinces: ["Aosta"],
			color: "#F4E04D",
			population: 125666
		},
		"Veneto": {
			provinces: ["Belluno", "Padova", "Rovigo", "Treviso", "Venezia", "Verona", "Vicenza"],
			color: "#900C3F",
			population: 4905854
		}
	};

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

	initRegions();
	initProvince(null);
	initFrom();

	function refresh() {
		var region = $("#region").children("option:selected").val();
		var provinceOrColumn = $("#province").children("option:selected").val();
		var delta = $("#values").children("option:selected").val() === "daily";
		var per100k = $("#method").children("option:selected").val() === "per100k";
		var from = $("#from").children("option:selected").val();
		if (!region) {
			initProvince(null);
			createChart("dati-andamento-nazionale/dpc-covid19-ita-andamento-nazionale.csv", delta, per100k, null, from);
		} else if (region === "all") {
			if (region !== previousRegion) {
				initColumns();
				provinceOrColumn = totalColumn;
			}
			createComparisonChart(provinceOrColumn, delta, per100k, from);
		} else {
			if (region !== previousRegion) {
				initProvince(regionDescriptions[region].provinces);
				provinceOrColumn = null;
			}
			if (provinceOrColumn) {
				createChart("dati-province/dpc-covid19-ita-province.csv", delta, false, provinceOrColumn, from);
			} else {
				createChart("dati-regioni/dpc-covid19-ita-regioni.csv", delta, per100k, region, from);
			}
		}
		previousRegion = region;
	}

	refresh();

	$("#region").change(refresh);
	$("#province").change(refresh);
	$("#values").change(refresh);
	$("#method").change(refresh);
	$("#from").change(refresh);

	function initProvince(provinces) {
		$("#province-label").text("Provincia:");
		var $province = $("#province");
		$province.empty();
		$province.append($('<option></option>').val("").text(" - "));
		if (provinces) {
			for (var i = 0; i < provinces.length; i++) {
				$province.append($('<option></option>').text(provinces[i]));
			}
		}
		$province.val("");
	}

	function initColumns() {
		$("#province-label").text("Dato:");
		var $province = $("#province");
		$province.empty();
		for (var i = 0; i < datasetDefinitions.length; i++) {
			var datasetDefinition = datasetDefinitions[i];
			$province.append($('<option></option>').val(datasetDefinition.column).text(datasetDefinition.label));
		}
		$province.val(totalColumn);
	}

	function initRegions() {
		var $region = $("#region");
		$region.empty();
		$region.append($('<option></option>').val("").text("- Nazionali -"));
		$region.append($('<option></option>').val("all").text("- Tutte -"));
		var regions = Object.keys(regionDescriptions);
		for (var i = 0; i < regions.length; i++) {
			$region.append($('<option></option>').text(regions[i]));
		}
		$region.val("");
	}

	function initFrom(monthDates) {
		var $from = $("#from");
		var current = $from.val() || "";
		$from.empty();
		$from.append($('<option></option>').val("").text("- Inizio - "));
		if (monthDates && monthDates.length) {
			for (var i = 0; i < monthDates.length; i++) {
				var monthDate = monthDates[i];
				var month = months[parseInt(monthDate.substr(5, 2)) - 1];
				$from.append($('<option></option>').val(monthDate).text(month));
			}
		}
		$from.val(current);
	}

	var dateColumn = "data";
	var regionColumn = "denominazione_regione";
	var provinceColumn = "denominazione_provincia";
	var totalColumn = "totale_casi";
	var tamponiColumn = "tamponi";

	var datasetDefinitions = [
		{
			column: "terapia_intensiva",
			label: 'Terapia intensiva',
			color: chartColors.purple
		}, {
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
			label: 'Tamponi/100',
			color: chartColors
		}
	];

	function createChart(path, delta, per100k, filter, from) {
		$.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/" + path, function (data) {
			var result = $.csv.toArrays(data);

			var columns = result[0];
			var dateColumnIndex = columnIndexThrows(columns, dateColumn);
			var tamponiColumnIndex = columnIndex(columns, tamponiColumn);
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

			var population100k = 1;
			if (per100k) {
				if (filter) {
					population100k = regionDescriptions[filter].population;
				} else {
					population100k = 0;
					var regions = Object.keys(regionDescriptions);
					for (var k = 0; k < regions.length; k++) {
						population100k += regionDescriptions[regions[k]].population;
					}
				}
				population100k /= 100000;
			}

			var labels = [];
			var datasets = createDataSets(columns, onlyTotal ? totalColumn : null);
			var previousLine = null;
			var monthDates = [];
			var lastMonthDate = null;
			for (var i = 1; i < result.length; i++) {
				var line = result[i];
				var date = line[dateColumnIndex];

				var monthDate = date.substr(0, 7);
				if (!lastMonthDate || monthDate !== lastMonthDate) {
					monthDates.push(monthDate);
					lastMonthDate = monthDate;
				}

				if (!filter || line[filterColumnIndex] === filter) {
					if (!from || date >= from) {
						labels.push(createDateLabel(date));
						for (var j = 0; j < datasets.length; j++) {
							var dataset = datasets[j];
							var value = line[dataset.index];
							if (delta && previousLine) {
								value -= previousLine[dataset.index];
							}
							if (dataset.index === tamponiColumnIndex) {
								value = Math.round(value / 100);
							}
							if (per100k) {
								value = Math.round(value / population100k);
							}
							dataset.data.push(value);
						}
					}
					previousLine = line;
				}
			}
			chartConfig.options.title.text = (filter || "Italia") + (delta ? " - giornalieri" : " - totali") + (per100k ? " per 100.000 abitanti" : " assoluti");
			chartConfig.data.labels = labels;
			chartConfig.data.datasets = datasets;
			chart.update();
			initFrom(monthDates);
		});
	}

	function createDataSets(columns, filter) {
		var result = [];
		for (var i = 0; i < datasetDefinitions.length; i++) {
			var datasetDefinition = datasetDefinitions[i];
			if (!filter || datasetDefinition.column === filter) {
				result.push({
					label: datasetDefinition.label,
					backgroundColor: datasetDefinition.color,
					borderColor: datasetDefinition.color,
					hidden: false,
					data: [],
					index: columnIndexThrows(columns, datasetDefinition.column)
				});
			}
		}
		return result;
	}

	function createComparisonChart(column, delta, per100k, from) {
		$.get("https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-regioni/dpc-covid19-ita-regioni.csv", function (data) {
			var result = $.csv.toArrays(data);

			var columns = result[0];
			var dateColumnIndex = columnIndexThrows(columns, dateColumn);
			var columnIndex = columnIndexThrows(columns, column);
			var regionColumnIndex = columnIndexThrows(columns, regionColumn);

			var labels = [];
			var datasetIndexes = {};
			var datasets = [];
			var regions = Object.keys(regionDescriptions);
			var previousLines = {};
			for (var i = 0; i < regions.length; i++) {
				var region = regions[i];
				var regionColor = regionDescriptions[region].color;
				datasetIndexes[region] = datasets.length;
				datasets.push({
					label:  region,
					backgroundColor: regionColor,
					borderColor: regionColor,
					hidden: false,
					data: []
				});
				previousLines[region] = null;
			}
			var previousDate = null;
			for (i = 1; i < result.length; i++) {
				var line = result[i];
				region = line[regionColumnIndex];
				var date = line[dateColumnIndex];
				if (!from || date >= from) {
					if (date !== previousDate) {
						labels.push(createDateLabel(line[dateColumnIndex]));
						previousDate = date;
					}
					var value = line[columnIndex];
					var previousLine = previousLines[region];
					if (delta && previousLine) {
						value -= previousLine[columnIndex];
					}
					if (per100k) {
						value = Math.round(value / regionDescriptions[region].population * 100000);
					}
					var dataset = datasets[datasetIndexes[region]];
					dataset.data.push(value);
				}
				previousLines[region] = line;
			}
			for (i = 0; i < datasetDefinitions.length && datasetDefinitions[i].column !== column; i++);
			chartConfig.options.title.text = datasetDefinitions[i].label + (delta ? " - giornalieri" : " - totali") + (per100k ? " per 100.000 abitanti" : " assoluti");
			chartConfig.data.labels = labels;
			chartConfig.data.datasets = datasets;
			chart.update();
		});
	}

	function createDateLabel(date) {
		return parseInt(date.substr(8, 2)) + " " + months[parseInt(date.substr(5, 2)) - 1];
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

