 $(document).ready(function() {

 	var amountOfCows = 0,
 	MAX_WATER = 500,
 	cowsActive = [];
 	cowsWeight = [];


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

		});

	};

	function generateReport(){
		table = '<tbody>';
 		table += '<tr>';
 		table += '<th>Etiqueta de Ganado</th>';
 		table += '<th>Peso inicial (Kg)</th>';
 		table += '<th>Peso Final (Kg)</th>';
 		table += '<th>Aumento (Kg)</th>';
 		table += '<th>Tiempo de consumo (seg)</th>';
 		table += '</tr>';
 		for (var i = amountOfCows - 1; i >= 0; i--) {
			var size = cowsWeight[i].weight.length;
			var diff = (cowsWeight[i].weight[size-1]-cowsWeight[i].weight[0]);
			table += '<tr class="info">';
			table += '<td>RFID-'+i*65+'</td>';
			table += '<td>'+Math.round(cowsWeight[i].weight[0] * 100) / 100+'</td>';
			table += '<td>'+Math.round(cowsWeight[i].weight[size-1] * 100) / 100+'</td>';
			table += '<td>'+Math.round(diff * 100) / 100+'</td>';
			table += '<td>'+(Math.round(diff * 100) / 100)*3600+'</td>';
			table += '</tr>';
 		};
 		table += '</tbody>';
 		$('#sensorsTable').html(table);
	};	

	function restartApp(){
		$('#progress-sensors-bar').hide("slow");
 		$('#startSensors').hide("slow");
 		$('#shutdown').hide("slow");
 		$('#scalesWeighing').hide("slow");
 		$('#showSensors').hide("slow");
 		$('#process-description').hide("slow");
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
 		for (var i = amountOfCows - 1; i >= 0; i--) {
			table += '<tr class="warning">';
			table += '<td class="sensor">'+cowsWeight[i].id+'</td>';
			var weight = cowsWeight[i].weight[cowsWeight[i].weight.length -1];
			if ( !show ){
				var lastWeight = weight + Math.random()*30;
				cowsWeight[i].weight.push(lastWeight);
				weight = Math.round(lastWeight * 100) / 100;
			}
			table += '<td class="weight">'+weight+'</td>';
			table += '</tr>';
 		};
 		table += '</tbody>';
		$('#scales').html(table);
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
			table += '<td class="sensor">RFID-'+i*65+'</td>';
			table += '<td class="state">Encendido</td>';
			table += '<td class="activating">-</td>';
			table += '<td class="value">-</td>';
			table += '</tr>';
			cowsWeight.push({'id':'RFID-'+i*65, 'weight':[650]});
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