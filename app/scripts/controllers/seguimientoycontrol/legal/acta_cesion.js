'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalActaCesionCtrl
 * @description
 * # SeguimientoycontrolLegalActaCesionCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolLegalActaCesionCtrl', function ($log, $scope, $routeParams, administrativaRequest, agoraRequest) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    var self= this;

    self.contrato_id = $routeParams.contrato_id;
    self.contrato_obj = {};
    self.texto_busqueda = "";
    self.persona_sel = "";
    self.num_oficio = null;
    self.f_oficio = new Date();
    self.f_cesion = new Date();
    self.observaciones = "";

    /*
    * Obtencion de datos del contrato del servicio
    */
    administrativaRequest.get('contrato_general',$.param({
      query: "Id:" + self.contrato_id
    })).then(function(response) {
      self.contrato_obj.id = response.data[0].Id;
      self.contrato_obj.contratista = response.data[0].Contratista;
      self.contrato_obj.valor = response.data[0].ValorContrato;
      self.contrato_obj.objeto = response.data[0].ObjetoContrato;
      self.contrato_obj.contratante = "Universidad Distrital Francisco José de Caldas";
      self.contrato_obj.fecha_registro = response.data[0].FechaRegistro;
      self.contrato_obj.ordenador_gasto = response.data[0].OrdenadorGasto;
      self.contrato_obj.vigencia = response.data[0].VigenciaContrato;

    });

    /*
    * Obtencion de datos de las personas naturales, para los cesionarios
    */
    agoraRequest.get('informacion_persona_natural', $.param({
      fields: "Id,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido",
      limit: 0
    })).then(function(response) {
      self.persona_natural_items = response.data;
    });

    /*
    * filtro para la cargar de personas segun la entrada
    */
    self.cargar_persona_natural = function(id_persona){
      self.persona_natural_grep = jQuery.grep(self.persona_natural_items, function(value, index) {
        var str_value = value.Id.toString();
        var str_id_persona = id_persona.toString();
        if(str_value.indexOf(str_id_persona) != -1){
          return Number(str_value);
        }
      });
    }

    /*
    * Funcion de accion al momento de seleccion de cedula del cesionario
    */
    self.persona_sel_change = function(val){
      self.cesionario_obj = {};
      self.cesionario_obj.nombre = val.PrimerNombre+ " " + val.SegundoNombre;
      self.cesionario_obj.apellidos = val.PrimerApellido + " " + val.SegundoApellido ;
      self.cesionario_obj.identificacion = val.Id;
      self.cesionario_obj.tipo_documento = "C.C";
      self.cesionario_obj.tipo_persona = "Natural"
    }

    self.generarActa = function(){

      self.cesion_nov = {};
      self.cesion_nov.contrato = self.contrato_obj.id;
      self.cesion_nov.vigencia = self.contrato_obj.vigencia;
      self.cesion_nov.cesionariocedula = self.cesionario_obj.identificacion;
      self.cesion_nov.numerooficio = self.num_oficio;
      self.cesion_nov.fechaoficio = self.f_oficio;
      self.cesion_nov.fechacesion = self.f_cesion;
      self.cesion_nov.observaciones = self.observaciones;

      swal(
        'Buen trabajo!',
        'Se ha generado el acta, se iniciará la descarga',
        'success'
      );
    };

  });