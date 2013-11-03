 $(document).ready(function() {

 	var amountOfCows = 0;

	init();

	function init(){
		// waterSensor = new Sensor("water","XR32","waterSensor","off");
	 // 	cow1Sensor = new Sensor();
	 // 	cow2Sensor = new Sensor();
	 // 	cow3Sensor = new Sensor();
	 // 	cowsReaderInWaterConainter = new Sensor();
		// cowsReaderInSaclesConainter = new Sensor();

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
	};

 	function initializeSensors(){
 		var table = '';
 		$('#progress-sensors-bar').hide("slow");
 		$('#startSensors').hide("slow");
 		$('#process-bar-description').hide("slow");
 		$('#scalesWeighing').show("slow");
 		showTable();

 		
		// waterSensor.start();
	 // 	cow1Sensor.start();
	 // 	cow2Sensor.start();
	 // 	cow3Sensor.start();
	 // 	cowsReaderInWaterConainter.start();
		// cowsReaderInSaclesConainter.start();
 	};

 	function showTable(){
		$('#process-description').append("<strong>El sistema cuenta con "+amountOfCows+" vacas con sensores en sus orejas. </br>Tambi&eacute;n los sensores en las bateas y en la zona de pasaje.</strong>");
 		table = '<tbody>';
 		table += '<tr>';
 		table += '<th>Sensor</th>';
 		table += '<th>Estado</th>';
 		table += '</tr>';
 		for (var i = amountOfCows - 1; i >= 0; i--) {
			table += '<tr class="success">';
			table += '<td>Vaca-'+i*65+'</td>';
			table += '<td>Encendido</td>';
			table += '</tr>';
 		};
 		table += '<tr class="success">';
		table += '<td>Water-Limit-35</td>';
		table += '<td>Encendido</td>';
		table += '</tr>';
 		table += '<tr class="success">';
		table += '<td>Water-3545</td>';
		table += '<td>Encendido</td>';
		table += '</tr>';scalesWeighing
		table += '<tr class="success">';
		table += '<td>Scale-525</td>';
		table += '<td>Encendido</td>';
		table += '</tr>';
 		table += '</tbody>';
 		$('.table.table-hover').html(table);
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