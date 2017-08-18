'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaAdicionProrrogaCtrl
 * @description
 * # SeguimientoycontrolLegalActaAdicionProrrogaCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
.controller('SeguimientoycontrolLegalActaAdicionProrrogaCtrl', function ($log, $scope, $routeParams, administrativaRequest,$translate,argoNosqlRequest) {
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];

  var self = this;
  self.contrato_id = $routeParams.contrato_id;
  self.contrato_obj = {};

  /*
  * Obtencion de datos del contrato del servicio
  */
  administrativaRequest.get('contrato_general',$.param({
    query: "Id:" + self.contrato_id
  })).then(function(response) {
    $scope.response_contrato = response;
    self.contrato_obj.id = response.data[0].Id;
    self.contrato_obj.TipoContrato = response.data[0].TipoContrato.TipoContrato;
    self.contrato_obj.ObjetoContrato = response.data[0].ObjetoContrato;
    self.contrato_obj.ValorContrato = response.data[0].ValorContrato;
    self.contrato_obj.Contratista = response.data[0].Contratista;
    self.contrato_obj.PlazoEjecucion = response.data[0].PlazoEjecucion;
    self.contrato_obj.Supervisor = response.data[0].Supervisor.Nombre;
    self.contrato_obj.fecha_inicio = response.data[0].fecha_inicio;
    self.contrato_obj.FechaRegistro = response.data[0].FechaRegistro;
    self.fecha_inicio = new Date();
    // self.fecha_inicio = self.contrato_obj.fecha_inicio.substring(0, 10);
    self.contrato_obj.ValorContrato = response.data[0].ValorContrato;
    self.contrato_obj.VigenciaContrato = response.data[0].VigenciaContrato;
    
    $log.log(response.data);
  });

  //CONSULTAR LOS DATOS NoSQL
  // argoNosqlRequest.get('novedad/8/2017').then(function(response) {     
  //   $log.log(response.data[0].motivo);
  // });

  $scope.total_valor_contrato = function(evento) {
    var valor_adicion = evento.target.value; //SE CAPTURA EL VALOR DEL INPUT POR MEDIO DEL TARGET DEL CONTROL
    var valor_contrato = parseInt(valor_adicion) + parseInt(self.contrato_obj.ValorContrato);
    $scope.nuevo_valor_contrato = valor_contrato;

    $scope.valor_adicion_letras = numeroALetras(valor_adicion, {
      plural: 'PESOS',
      singular: 'PESO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });

    $scope.nuevo_valor_contrato_letras = numeroALetras(valor_contrato, {
      plural: 'PESOS',
      singular: 'PESO',
      centPlural: 'CENTAVOS',
      centSingular: 'CENTAVO'
    });
  }

  $scope.format = function(numero){
    var num = numero.replace(/\./g,'');
    if(!isNaN(num)){
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/,'');
      return num;
    }else{
      alert('Solo se permiten numeros');
      return input.value.replace(/[^\d\.]*/g,'');
    }
  }

  $scope.total_plazo_contrato = function(evento) {
    var valor_prorroga = evento.target.value; //SE CAPTURA EL VALOR DEL INPUT POR MEDIO DEL TARGET DEL CONTROL
    var plazo_actual_dias = parseInt(self.contrato_obj.PlazoEjecucion) * (30);
    var valor_plazo_dias = parseInt(valor_prorroga) + plazo_actual_dias;
    var valor_plazo_meses = valor_plazo_dias / (30);
    $scope.nuevo_plazo_contrato = valor_plazo_meses;
  }

  $scope.click_check_adicion = function(){
    if( $('.panel_adicion').is(":visible") ){
      //si esta visible
      $('.panel_adicion').hide("fast");
      self.contrato_obj.NumeroCdp = "";
      $scope.valor_adicion = "";
      $scope.fecha_adicion = "";
      $scope.nuevo_valor_contrato = "";
    }else{
      //si no esta visible
      $('.panel_adicion').show("fast");
      self.contrato_obj.NumeroCdp = $scope.response_contrato.data[0].NumeroCdp;
      $scope.fecha_adicion = new Date();
    }
  }

  $scope.click_check_prorroga = function(){
    if( $('.panel_prorroga').is(":visible") ){
      //si esta visible
      $('.panel_prorroga').hide("fast");
      $scope.tiempo_prorroga = "";
      $scope.fecha_prorroga = "";
      $scope.nuevo_plazo_contrato = "";
    }else{
      //si no esta visible
      $('.panel_prorroga').show("fast");
      $scope.fecha_prorroga = new Date();
    }
  }

  $scope.estado_novedad = false;
  self.comprobar_seleccion_novedad = function(){
    if ($scope.adicion == true || $scope.prorroga == true){
      $scope.estado_novedad = true;
      if ($scope.adicion == true) {
        $('#valor_adicion').prop('required',true);
      }else{
        $('#valor_adicion').prop('required',false);
      }
      if ($scope.prorroga == true) {
        $('#tiempo_prorroga').prop('required',true);
      }else{
        $('#tiempo_prorroga').prop('required',false);
      }
    }else{
      $scope.estado_novedad = false;
    }
    if ($scope.estado_novedad == false) {
      swal('Advertencia',
           'Primero debe seleccionar un tipo de novedad!',
           'info');
    }
  }

  self.generarActa = function(){
    if ($scope.adicion) {
      $scope.estado_novedad = "Adición";
    }
    if ($scope.prorroga) {
      $scope.estado_novedad = "Prorroga";
    }if ($scope.adicion == true && $scope.prorroga == true){
      $scope.estado_novedad = "Adición y Prorroga";
    }
    if ($scope.estado_novedad != false) {
      self.data_acta_adicion_prorroga = {
                                          contrato: self.contrato_obj.id,
                                          numerosolicitud: $scope.numero_solicitud,
                                          fechasolicitud: self.fecha_inicio,
                                          numerocdp: String(self.contrato_obj.NumeroCdp),
                                          valoradicion: $scope.valor_adicion,
                                          fechaadicion: $scope.fecha_adicion,
                                          tiempoprorroga: $scope.tiempo_prorroga,
                                          fechaprorroga: $scope.fecha_prorroga,
                                          vigencia: String(self.contrato_obj.VigenciaContrato),
                                          motivo: $scope.motivo
                                        }
      // alert(JSON.stringify(self.data_acta_adicion_prorroga));
      argoNosqlRequest.post('novedad', self.data_acta_adicion_prorroga).then(function(request){
        console.log(request);
        if (request.status == 200) {
          swal('Buen trabajo!',
               'Se registro exitosamente la novedad de "'+$scope.estado_novedad+'"<br>al contrato # '+self.contrato_obj.id+' del '+self.contrato_obj.VigenciaContrato+'.',
               'success');

          swal({
            title: 'Buen trabajo!',
            type: 'success',
            html: 'Se registro exitosamente la novedad de "'+$scope.estado_novedad+'"<br>al contrato # '+self.contrato_obj.id+' del '+self.contrato_obj.VigenciaContrato+'.',
            showCloseButton: false,
            showCancelButton: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Aceptar',
            allowOutsideClick: false
          }).then(function () {
            window.location.href = "#/seguimientoycontrol/legal";
          });
          $scope.estado_novedad = undefined;
        }
      });
    }
  };

  /* =========================================================
  * //////////////////////////////////////////////////////////
  * ========================================================== */

  // FUNCION PARA CONVERTIR VALORES NUMERICOS EN LETRAS
  var numeroALetras = (function() {
    //Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
    function Unidades(num){
      switch(num)
      {
        case 1: return 'UN';
        case 2: return 'DOS';
        case 3: return 'TRES';
        case 4: return 'CUATRO';
        case 5: return 'CINCO';
        case 6: return 'SEIS';
        case 7: return 'SIETE';
        case 8: return 'OCHO';
        case 9: return 'NUEVE';
      }
      return '';
    }//Unidades()

    function Decenas(num){
      let decena = Math.floor(num/10);
      let unidad = num - (decena * 10);

      switch(decena)
      {
        case 1:
          switch(unidad)
          {
            case 0: return 'DIEZ';
            case 1: return 'ONCE';
            case 2: return 'DOCE';
            case 3: return 'TRECE';
            case 4: return 'CATORCE';
            case 5: return 'QUINCE';
            default: return 'DIECI' + Unidades(unidad);
          }
        case 2:
          switch(unidad)
          {
            case 0: return 'VEINTE';
            default: return 'VEINTI' + Unidades(unidad);
          }
        case 3: return DecenasY('TREINTA', unidad);
        case 4: return DecenasY('CUARENTA', unidad);
        case 5: return DecenasY('CINCUENTA', unidad);
        case 6: return DecenasY('SESENTA', unidad);
        case 7: return DecenasY('SETENTA', unidad);
        case 8: return DecenasY('OCHENTA', unidad);
        case 9: return DecenasY('NOVENTA', unidad);
        case 0: return Unidades(unidad);
      }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
      if (numUnidades > 0)
        return strSin + ' Y ' + Unidades(numUnidades)
      return strSin;
    }//DecenasY()

    function Centenas(num) {
      let centenas = Math.floor(num / 100);
      let decenas = num - (centenas * 100);

      switch(centenas)
      {
        case 1:
          if (decenas > 0)
            return 'CIENTO ' + Decenas(decenas);
          return 'CIEN';
        case 2: return 'DOSCIENTOS ' + Decenas(decenas);
        case 3: return 'TRESCIENTOS ' + Decenas(decenas);
        case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
        case 5: return 'QUINIENTOS ' + Decenas(decenas);
        case 6: return 'SEISCIENTOS ' + Decenas(decenas);
        case 7: return 'SETECIENTOS ' + Decenas(decenas);
        case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
        case 9: return 'NOVECIENTOS ' + Decenas(decenas);
      }
      return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let letras = '';

      if (cientos > 0)
        if (cientos > 1)
          letras = Centenas(cientos) + ' ' + strPlural;
        else
          letras = strSingular;
      if (resto > 0)
        letras += '';
      return letras;
    }//Seccion()

    function Miles(num) {
      let divisor = 1000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
      let strCentenas = Centenas(resto);

      if(strMiles == '')
        return strCentenas;

      return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
      let divisor = 1000000;
      let cientos = Math.floor(num / divisor)
      let resto = num - (cientos * divisor)

      let strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES');
      let strMiles = Miles(resto);

      if(strMillones == '')
        return strMiles;

      return strMillones + ' ' + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) {
      currency = currency || {};
      let data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: '',
        letrasMonedaPlural: currency.plural || 'PESOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
        letrasMonedaSingular: currency.singular || 'PESO', //'PESO', 'Dólar', 'Bolivar', 'etc'
        letrasMonedaCentavoPlural: currency.centPlural || 'CHIQUI PESOS',
        letrasMonedaCentavoSingular: currency.centSingular || 'CHIQUI PESO'
      };

      if (data.centavos > 0) {
        data.letrasCentavos = 'CON ' + (function () {
          if (data.centavos == 1)
            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
          else
            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
        })();
      };

      if(data.enteros == 0)
        return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
      if (data.enteros == 1)
        return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
      else
        return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };
  })();
});
