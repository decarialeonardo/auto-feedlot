 $(document).ready(function() {

 	var amountOfCows = 0,
 	MAX_WATER = 500,
 	cowsActive = [];
 	cowsWeight = [];
 	datas = {
 		1:[630,660,690,700,710,750,720,770,800,780,790,800],
 		2:[600,640,750,740,770,790,795,810,830,800,810,850],
 		3:[610,690,690,800,810,850,860,870,900,910,915,930],
 		4:[610,710,655,700,700,730,720,750,775,790,810,820],
 		5:[690,665,730,700,750,780,730,770,830,810,790,800],
 		6:[620,700,690,700,710,790,790,810,840,860,890,900],
 		7:[650,660,755,730,780,810,820,870,880,910,920,910],
 		8:[670,650,650,670,690,650,710,710,740,780,750,780],
 		9:[690,720,790,800,810,850,820,870,900,980,990,1000],
 		10:[680,665,730,700,750,780,790,790,800,800,800,800]
 	}


	init();

	function init(){
		$('.selectpicker').selectpicker();

		$('#startAuto').click(function(e){
 			amountOfCows = $("select option:selected").val();
			$('#startSensors').show("slow");
			$('#startAuto').hide("slow");
			$('#selected-cows').hide("slow");
		});

		$('#startSensors').click(function(e){
			$('#progress-sensors-bar').show();
			$('#process-bar-description').html("<strong>Inicializando Sensores ...</strong>");
			$('.progress .progress-bar').css('width','0%');
			$('.progress .progress-bar').progressbar({
		        transition_delay: 1000,
		        display_text: 'fill',
		        done: initializeSensors
		    });
		});

		$('#showSensors').click(function(e){
			showTable();
			$('#back').show("slow");	
			$('#showSensors').hide("slow");
			$("#limit-alert").show("slow");
		});

		$('#back').click(function(e){
			$('#showSensors').show("slow");
			$('#shutdown').show("slow");
			$('#back').hide("slow");
			$('#process-description').hide("slow");
			$('#container-report').html('');
			$("#limit-alert").hide("slow");
		});

		$('#scalesWeighing').click(function (e) {
		   	showTableWeights(false);
 			$('#scales-weighing .activating').html("Pesajes realizados");
 			var button = '<a data-toggle="modal" href="#myModal" id="showWeights" class="btn btn-primary">Ver Pesos</a>';
 			$('#scales-weighing .value').html(button);
		});

		$('#showWeights').click(function(e){
			showTableWeights(true);
		});

		$('#shutdown').click(function(e){
			restartApp();
		});

		$('#report').click(function(e){
			generateReport();
		});

		$('#alertMessage .close').click(function(){
			$("#alertMessage").modal('hide');
		});

		$('#limit-alert').click(function(){
			$('#water-limit .value').html("0lts");
			$('#water-limit .activating').html("Sin reservas");
			$('#water-limit .state').html("Apagado");
			$('#water-limit').removeClass("success").addClass("danger");
			$('#water-limit .state').unbind('click');

		});

	};

	function generateReport(){
		table = '<tbody>';
 		table += '<tr style="background-color:#efefef">';
 		table += '<th>Etiqueta de Ganado</th>';
 		table += '<th>Peso inicial (Kg)</th>';
 		table += '<th>Peso Final (Kg)</th>';
 		table += '<th>Aumento (Kg)</th>';
 		table += '<th>En el año</th>';
 		table += '</tr>';
 		var series = [];
 		for (var i = amountOfCows - 1; i >= 0; i--) {
			var diff = datas[i+1][11]-datas[i+1][0];
			table += '<tr class="info">';
			table += '<td>RFID-'+(i*65+1)+'</td>';
			table += '<td>'+datas[i+1][0]+'</td>';
			table += '<td>'+datas[i+1][11]+'</td>';
			table += '<td>'+Math.round(diff * 100) / 100+'</td>';
			table += '<td>2013</td>';
			table += '</tr>';

			serie = {
						name: 'RFID-'+(i*65+1),
						data: datas[i+1]
					};
 			series.push(serie);
 		};
 		table += '</tbody>';
 		$('#sensorsTable').html(table);
 		generateReportChart(series);

	};

	function generateReportChart(series){
		 $('#container-report').highcharts({
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Reporte de ganado en todo en todo el año'
            },
            subtitle: {
                text: 'Perído: de 01 al 12 del 2013'
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Peso (Kg)'
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'Kg';
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: series
        });
	};

	function restartApp(){
		$('#progress-sensors-bar').hide("slow");
 		$('#startSensors').hide("slow");
 		$('#shutdown').hide("slow");
 		$('#scalesWeighing').hide("slow");
 		$('#showSensors').hide("slow");
 		$('#process-description').hide("slow");
 		$('#container-report').html('');
 		$('#back').hide("slow");
 		$('#report').hide('slow');
 		$("#limit-alert").hide('slow');
		$('#description').html('');
		$('#scales').html('');

 		$('#startAuto').show("slow");
		$('#selected-cows').show("slow");
		$('#process-bar-description').show("slow");
		$('#process-bar-description').html('');

 		amountOfCows = 0;
 		MAX_WATER = 500;
 		cowsActive = [];
 		cowsWeight = [];
	};

	function showTableWeights(show){
		$('#report').show('slow');
		table = '<tbody>';
 		table += '<tr>';
 		table += '<th>Sensor</th>';
 		table += '<th>Peso(Kg)</th>';
 		table += '</tr>';
 		var cowDanger = null;
 		for (var i = amountOfCows - 1; i >= 0; i--) {
 			var weight = 495;
 			if ( i == 1 ){
 				table += '<tr id="danger-cow">';	
 				table += '<td class="sensor">'+cowsWeight[i].id+'</td>';
 				cowDanger = cowsWeight[i];
 			} else {
				table += '<tr class="warning">';
				table += '<td class="sensor">'+cowsWeight[i].id+'</td>';
				var weight = cowsWeight[i].weight[cowsWeight[i].weight.length -1];
				if ( !show ){
					var lastWeight = weight + Math.random()*30;
					cowsWeight[i].weight.push(lastWeight);
					weight = Math.round(lastWeight * 100) / 100;
				}
			}
			table += '<td class="weight">'+weight+'</td>';
			
			table += '</tr>';
 		};
 		table += '</tbody>';
		$('#scales').html(table);



		$('#danger-cow').click(function(e){
			chartCow(cowDanger);
		});
	};

	function chartCow(cowDanger) {
		$('#scales').hide();
		$('.reference').hide();
		$('#container').show();
		$('#container').highcharts({
            chart: {
                type: 'area'
            },
            title: {
                text: 'Peso del animal en los últimos 60 días'
            },
            subtitle: {
                text: 'Período: del 05/2013 al 07/2013'
            },
            xAxis: {
            	title: {
                    text: 'Tiempo en días'
                },
                labels: {
                    formatter: function() {
                        return this.value; // clean, unformatted number for year
                    }
                }
            },
            yAxis: {
                title: {
                    text: 'Peso en Kg'
                },
                labels: {
                    formatter: function() {
                        return this.value / 100 +'kg';
                    }
                },
                plotLines : [{
					value : 60000,
					color : 'red',
					dashStyle : 'shortdash',
					width : 2,
					zIndex: 1000,
					label : {
						text : 'Límite de pesaje'
					}
				}],
            },
            tooltip: {
            	formatter : function() {
            		return 'peso <b>'+(this.y/100)+'kg </b><br/>en el día '+this.x;
            	},
                pointFormat: '{series.name} peso <b>{point.y:,.0f}</b><br/>en el día {point.x}'
            },
            plotOptions: {
                area: {
                    pointStart: 01,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            series: [{
                name: cowDanger.id,
                data: [65380, 65480, 66380, 67380, 67380, 68380, 68380, 68500, 68000,
                    65380, 65480, 66380, 67380, 67380, 68380, 68380, 68500, 68000,
                    65380, 65480, 66380, 67380, 67380, 68380, 68380, 68500, 68000,
                    67380, 67480, 67380, 67380, 67380, 66900, 66180, 65900, 65500,
                    65000, 64480, 64380, 64380, 64380, 64380, 64380, 64500, 64000,
                    63000, 62480, 62380, 62380, 62380, 62000, 61780, 61500, 61000,
                    60990, 60560, 60410, 60000, 59994, 59990, 59100, 59000, 58900 ]
            }] 
            // }, {
            //     name: 'USSR/Russia',
            //     data: [null, null, null, null, null, null, null , null , null ,null,
            //     5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
            //     4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
            //     15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
            //     33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
            //     35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
            //     21000, 20000, 19000, 18000, 18000, 17000, 16000]
            // }]
        });
 		$('#back-modal').show();
 		$('#back-modal').click(function(){
	 		$('#container').html('');
	 		$('#container').hide();
	 		$('#scales').show();
	 		$('.reference').show();
 		});
	};

 	function initializeSensors(){
 		$('#progress-sensors-bar').hide("slow");
 		$('#startSensors').hide("slow");
 		$('#process-bar-description').hide("slow");
 		$('#shutdown').show("slow");
 		$('#scalesWeighing').show("slow");
 		$('#showSensors').show("slow");
 	};

 	function showTable(){
 		$('#process-description').show("slow");
		$('#description').html("<strong>El sistema cuenta con "+amountOfCows+" vacas con sensores en sus orejas. </br>Tambi&eacute;n los sensores en las bateas y en la zona de pasaje.</strong>");
 		table = '<tbody>';
 		table += '<tr>';
 		table += '<th>Sensor</th>';
 		table += '<th>Estado</th>';
 		table += '<th>Sensando</th>';
 		table += '<th>Valor</th>';
 		table += '</tr>';
 		for (var i = amountOfCows - 1; i >= 0; i--) {
			table += '<tr class="success">';
			table += '<td class="sensor">RFID-'+(i*65+1)+'</td>';
			table += '<td class="state">Encendido</td>';
			table += '<td class="activating">-</td>';
			table += '<td class="value">-</td>';
			table += '</tr>';
			cowsWeight.push({'id':'RFID-'+(i*65+1), 'weight':[datas[i+1][0]]});
 		};
 		table += '<tr id="water-limit" class="success">';
		table += '<td class="sensor">Interruptores de nivel - Batea</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">En nivel</td>';
		table += '<td class="value">'+MAX_WATER+'lts</td>';
		table += '</tr>';
 		table += '<tr id="water-reader" class="success">';
		table += '<td class="sensor">Lectores RFID - Batea</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">No se registra ningun sensor</td>';
		table += '<td class="value">-</td>';
		table += '</tr>';
		table += '<tr id="scales-weighing" class="success">';
		table += '<td class="sensor">Balanza Electr&oacutenica</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">No se registra ningun sensor</td>';
		table += '<td class="value">-</td>';
		table += '</tr>';
 		table += '</tbody>';
 		$('#sensorsTable').html(table);

 		$('#sensorsTable').find('td.state').click( function(){
 			changeSensorState($(this).parent());	
 		});

 		startAutomatization();
 	};

 	function changeSensorState(el){
		if ( el.index() === 0 ){
 			return;	
 		}

		if ( el.hasClass("success") ){
			el.removeClass("success").addClass("danger");
			el.find('td.state').html("Apagado");
			el.find('td.activating').html("Sin actividad");
			if ( el.attr('id') === "scales-weighing" ){
				$('#scalesWeighing').hide('slow');
			}
			var index = cowsActive.indexOf(el.find('.sensor').html());
			if (index > -1) {
			    cowsActive.splice(index, 1);
			}
		} else {
			el.removeClass("danger").addClass("success");
			el.find('td.state').html("Encendido");
			el.find('td.activating').html("Esperando Evento");
			if ( el.attr('id') === "scales-weighing" ){
				$('#scalesWeighing').show('slow');
			}
		}
 	};

 	function startAutomatization(){

		(function loopForWater() {
		    var rand = Math.round(Math.random() * (20000 - 1000)) + 1000;
		    setTimeout(function() {
		            consumeWater(rand);
		            loopForWater();
		    }, rand);
		}());

		(function loopForCows() {
		    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
		    setTimeout(function() {
		            cowsMovement(rand);
		            loopForCows();  
		    }, rand);
		}());


 		function cowsMovement(rand) {
 			var array = $('#sensorsTable tr');
 			for (var i = array.length - 4; i >= 0; i--) {
 				if ( $(array[i]).find('.state').html() === "Encendido" ){
	 				$(array[i]).find('.activating').html("En movimiento");
	 				var index = cowsActive.indexOf($(array[i]).find('.sensor').html());
					if (index <= -1) {
	 					cowsActive.push($(array[i]).find('.sensor').html());
	 				}
 				}
 			};

 		}
 		
 		function consumeWater(){
			if ( $('#water-limit').hasClass('success') ){
				if ( $('#water-limit .value').html() === "0lts" ){
					return;
				} else {
					$('#water-limit .value').html((MAX_WATER--)+"lts");
					$('#water-limit .activating').html("Limite del agua");
					var index = Math.floor(Math.random()*cowsActive.length);
					$('#water-reader .value').html(cowsActive[index]);
					$('#water-reader .activating').html("Sensando ganado en batea");
					
				}
			}
 		}
 	};

 });