'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:SeguimientoycontrolLegalCtrl
 * @description
 * # SeguimientoycontrolLegalCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('SeguimientoycontrolLegalCtrl', function ($log,$location,$scope,administrativaRequest, administrativaAmazonRequest, coreAmazonRequest, $window,$translate, administrativaWsoRequest, agoraRequest) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var self = this;
    self.estado_contrato_obj = {};
    self.estado_resultado_response = 0;
    self.contratos = [{}];
    self.vigencias = [];
    self.vigencia_seleccionada = self.vigencias[0];
    self.contrato_obj = {};
    self.estado_resultado_response = false;




    /**
    * @ngdoc method
    * @name get_contratos_vigencia
    * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegal
    * @description
    * funcion para obtener la totalidad de los contratos por vigencia seleccionada
    */
    self.buscar_contrato = function(){
      administrativaWsoRequest.get('contrato', '/'+self.contrato_id+'/'+self.contrato_vigencia).then(function(wso_response){
        console.log(wso_response);
        if(wso_response.data.contrato.numero_contrato_suscrito){
          self.contrato_obj.id = wso_response.data.contrato.numero_contrato_suscrito;
          self.contrato_obj.valor = wso_response.data.contrato.valor_contrato;
          self.contrato_obj.objeto = wso_response.data.contrato.objeto_contrato;
          self.contrato_obj.fecha_registro = wso_response.data.contrato.fecha_registro;
          self.contrato_obj.ordenador_gasto_nombre = wso_response.data.contrato.ordenador_gasto.nombre_ordenador;
          self.contrato_obj.ordenador_gasto_rol = wso_response.data.contrato.ordenador_gasto.rol_ordenador;
          self.contrato_obj.vigencia = wso_response.data.contrato.vigencia;

          administrativaWsoRequest.get('contrato_estado', '/'+self.contrato_id+'/'+self.contrato_vigencia).then(function(ce_response){
            self.estado_contrato_obj.estado = ce_response.data.contratoEstado.estado.id; 
            administrativaAmazonRequest.get('tipo_contrato', $.param({
              query: "Id:" + wso_response.data.contrato.tipo_contrato
            })).then(function(tc_response){
              self.contrato_obj.tipo_contrato = tc_response.data[0].TipoContrato;
              administrativaAmazonRequest.get('informacion_proveedor', $.param({
                query: "Id:" + wso_response.data.contrato.contratista
              })).then(function(ip_response) {
                self.contrato_obj.contratista_documento = ip_response.data[0].NumDocumento;
                self.contrato_obj.contratista_nombre = ip_response.data[0].NomProveedor;

                administrativaAmazonRequest.get('informacion_persona_natural', $.param({
                  query: "Id:" + ip_response.data[0].NumDocumento
                })).then(function(ipn_response){
                  coreAmazonRequest.get('ciudad','query=Id:' + ipn_response.data[0].IdCiudadExpedicionDocumento).then(function(c_response){
                    self.contrato_obj.contratista_ciudad_documento = c_response.data[0].Nombre;
                    self.estado_resultado_response = true;
                  });
                });
              });
            });
          });
        }else{
          swal(
            $translate.instant('TITULO_ERROR'),
            $translate.instant('DESCRIPCION_ERROR_LEGAL'),
            'error'
          );
        }
      });
    }
    

    /**
    * @ngdoc method
    * @name gridOptions
    * @methodOf contractualClienteApp.controller:SeguimientoycontrolLegal
    * @description
    * Establece los contratos consultados en la tabla del cliente para seleccion
    */
    self.gridOptions = {
      enableFiltering : true,
      enableSorting : true,
      enableRowSelection: false,
      multiSelect: false,
      enableSelectAll: false,
      columnDefs : [
        {field: 'contrato.numero_contrato_suscrito',  displayName: $translate.instant('CONTRATO'),width: 150},
        {field: 'contrato.vigencia' ,  displayName: $translate.instant('VIGENCIA_CONTRATO'),width: 160},
        {field: 'informacion_proveedor.NumDocumento',  displayName: $translate.instant('DOCUMENTO_CONTRATISTA'),width: 200},
        {field: 'informacion_proveedor.NomProveedor',  displayName: $translate.instant('NOMBRE_CONTRATISTA'),width: 390},
        {field: 'contrato.valor_contrato',  displayName:  $translate.instant('VALOR'), cellFilter: 'currency',width: 180}
      ],
      onRegisterApi : function(gridApi) {
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function(row){
          self.row_c = row.entity;
          self.estado_resultado_response = 0;

          administrativaWsoRequest.get('contrato_estado', '/'+self.row_c.contrato.numero_contrato_suscrito+'/'+self.row_c.contrato.vigencia).then(function(response) {
            var estado = response.data.contratoEstado.estado;
            console.log(self.row_c.contrato.numero_contrato_suscrito, estado)
            if (estado.id != 8) {
              self.estado_contrato_obj.estado = estado.id; //guardamos el id del estado del contrato
              self.estado_resultado_response = response.status; //guardamos el status del resultado del response
            }else{
              self.estado_resultado_response = 0;
            }
          });
        });
      }
    };
  });