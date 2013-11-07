 $(document).ready(function() {

 	var amountOfCows = 0,
 	MAX_WATER = 500,
 	cowsActive = [];


	init();

	function init(){
		// waterSensor = new Sensor("water","XR32","waterSensor","off");
	 // 	cow1Sensor = new Sensor();
	 // 	cow2Sensor = new Sensor();
	 // 	cow3Sensor = new Sensor();
	 // 	cowsReaderInWaterConainter = new Sensor();
		// cowsReaderInSaclesConainter = new Sensor();
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
		});

		$('#back').click(function(e){
			$('#showSensors').show("slow");
			$('#back').hide("slow");
			$('#process-description').hide("slow");
		});
	};

 	function initializeSensors(){
 		var table = '';
 		$('#progress-sensors-bar').hide("slow");
 		$('#startSensors').hide("slow");
 		$('#process-bar-description').hide("slow");
 		$('#scalesWeighing').show("slow");
 		$('#showSensors').show("slow");

 		

 		
		// waterSensor.start();
	 // 	cow1Sensor.start();
	 // 	cow2Sensor.start();
	 // 	cow3Sensor.start();
	 // 	cowsReaderInWaterConainter.start();
		// cowsReaderInSaclesConainter.start();
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
			table += '<td class="sensor">Vaca-'+i*65+'</td>';
			table += '<td class="state">Encendido</td>';
			table += '<td class="activating">-</td>';
			table += '<td class="value">-</td>';
			table += '</tr>';
 		};
 		table += '<tr id="water-limit" class="success">';
		table += '<td class="sensor">Water-Limit-35</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">En nivel</td>';
		table += '<td class="value">'+MAX_WATER+'lts</td>';
		table += '</tr>';
 		table += '<tr id="water-reader" class="success">';
		table += '<td class="sensor">Water-3545</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">No se registra ningun sensor</td>';
		table += '<td class="value">-</td>';
		table += '</tr>';
		table += '<tr class="success">';
		table += '<td class="sensor">Scale-525</td>';
		table += '<td class="state">Encendido</td>';
		table += '<td class="activating">No se registra ningun sensor</td>';
		table += '<td class="value">-</td>';
		table += '</tr>';
 		table += '</tbody>';
 		$('#sensorsTable').html(table);

 		$('#sensorsTable').find('tr').click( function(){
 			changeSensorState($(this));	
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
			var index = cowsActive.indexOf(el.find('.sensor').html());
			if (index > -1) {
			    cowsActive.splice(index, 1);
			}
		} else {
			el.removeClass("danger").addClass("success");
			el.find('td.state').html("Encendido");
			el.find('td.activating').html("Esperando Evento");
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
					changeSensorState($('#water-limit'));
					$('#water-limit').unbind('click');
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

 	/** Realizar pesaje de las vacas **/
 	function scalesWeighing(){

 	};

 	function checkWaterSensor(){

 	};

 	function shutdownSensors(){
		waterSensor.end();
	 	cow1Sensor.end();
	 	cow2Sensor.end();
	 	cow3Sensor.end();
	 	cowsReaderInWaterConainter.end();
		cowsReaderInSaclesConainter.end();
 	};


 });