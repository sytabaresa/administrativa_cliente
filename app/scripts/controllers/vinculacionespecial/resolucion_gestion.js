'use strict';

/**
* @ngdoc function
* @name clienteApp.controller:ResolucionGestionCtrl
* @description
* # ResolucionGestionCtrl
* Controller of the clienteApp
*/
angular.module('contractualClienteApp')
.factory("resolucion",function(){
  return {};
})
.controller('ResolucionGestionCtrl', function (adminMidRequest,resolucion,administrativaRequest,$scope,$window,$mdDialog,$translate) {

  var self = this;
  self.CurrentDate = new Date();

  //Tabla para mostrar los datos básicos de las resoluciones almacenadas dentro del sistema
  self.resolucionesInscritas = {
    paginationPageSizes: [10, 15, 20],
    paginationPageSize: 10,
    enableSorting: true,
    enableFiltering : true,
    enableRowSelection: false,
    enableRowHeaderSelection: false,
    columnDefs : [
      {
        field: 'Id',
        visible : false
      },
      {
        field: 'FechaExpedicion',
        visible : false
      },
      {
        field: 'Estado',
        visible : false
      },
      {
        field: 'Facultad',
        visible : false
      },
      {
        field: 'Numero',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '10%',
        displayName: $translate.instant('NUMERO')
      },
      {
        field: 'Vigencia',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '8%',
        displayName: $translate.instant('VIGENCIA')
      },
      {
        field: 'Periodo',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '8%',
        displayName: $translate.instant('PERIODO')
      },
      {
        field: 'FacultadNombre',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '18%',
        displayName: $translate.instant('FACULTAD')
      },
      {
        field: 'NivelAcademico',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '8%',
        displayName: $translate.instant('NIVEL')
      },
      {
        field: 'Dedicacion',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '7%',
        displayName: $translate.instant('DEDICACION')
      },
      {
        field: 'NumeroSemanas',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '10%',
        displayName: $translate.instant('SEMANAS')
      },
      {
        field: 'Estado',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '10%',
        displayName: $translate.instant('ESTADO')
      },
      {
        field: 'TipoResolucion',
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        width: '10%',
        displayName: $translate.instant('TIPO_RESOLUCION')
      },
      {
        name: $translate.instant('OPCIONES'),
        cellClass: function(grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
          if (row.entity.Estado==="Cancelada") {
            return 'resolucionCancelada';
          }else if(row.entity.Estado==="Expedida"){
            return 'resolucionExpedida';
          }
        },
        enableFiltering: false, enableSorting: false,
        width: '11%',
        //Los botones son mostrados de acuerdo alestado de las resoluciones (ver,editar,configurar)
        cellTemplate: '<center>' +
        '<a class="ver" ng-click="grid.appScope.verVisualizarResolucion(row)">' +
        '<i title="{{\'VER_DOC_BTN\' | translate }}" class="fa fa-file-pdf-o fa-lg  faa-shake animated-hover"></i></a> ' +

        '<a ng-if="row.entity.TipoResolucion==\'Vinculación\' && row.entity.Estado==\'Solicitada\' " class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
        '<i title="{{\'VINCULAR_BTN\' | translate }}" class="fa fa-user-plus fa-lg faa-shake animated-hover"></i></a> ' +

        '<a ng-if="row.entity.TipoResolucion==\'Cancelación\' && row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
        '<i title="{{\'CANCELAR_VIN_BTN\' | translate }}" class="fa fa-user-times fa-lg faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.TipoResolucion==\'Cancelación\' && row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verListarDocentesCancelacion(row)">' +
        '<i title="{{\'CONSULTAR_CAN_BTN\' | translate }}" class="fa fa-table fa-lg faa-shake animated-hover"></i></a> ' +

        '<a ng-if="row.entity.TipoResolucion==\'Adición\' && row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
        '<i title="{{\'ADICIONAR_HORAS_BTN\' | translate }}" class="fa fa-plus-circle fa-lg  faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.TipoResolucion==\'Adición\' && row.entity.Estado==\'Solicitada\' " class="editar" ng-click="grid.appScope.verListarDocentesAdicion(row)">' +
        '<i title="{{\'VER_DOCENTES_VIN_BTN\' | translate }}" class="fa fa-table fa-lg  faa-shake animated-hover"></i></a> ' +

        '<a ng-if="row.entity.TipoResolucion==\'Reducción\' && row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
        '<i title="{{\'REDUCIR_HORAS_BTN\' | translate }}" class="fa fa-minus-circle fa-lg  faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.TipoResolucion==\'Reducción\'&& row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verListarDocentesReduccion(row)">' +
        '<i title="{{\'VER_DOCENTES_VIN_BTN\' | translate }}" class="fa fa-table fa-lg  faa-shake animated-hover""></i></a> ' +

        '<a ng-if="row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verEditarResolucion(row)">' +
        '<i title="{{\'CONFIGURAR_DOC_BTN\' | translate }}" class="fa fa-pencil-square-o fa-lg faa-shake animated-hover"></i></a> ' +
        '<a ng-if="row.entity.Estado==\'Solicitada\'" class="ver" ng-click="grid.appScope.verRealizarAnulacion(row)">' +
        '<i title="{{\'ANULADA_BTN\' | translate }}" class="fa fa-times-circle fa-lg  faa-shake animated-hover"></i></a> ' +

        '</center>'

      }
    ]
  };

  //Se cargan los datos de las resoluciones de vinculación especial almacenadas
  adminMidRequest.get("gestion_resoluciones/get_resoluciones_inscritas").then(function(response){

    self.resolucionesInscritas.data=response.data;

    if(self.resolucionesInscritas.data!==null){
      self.resolucionesInscritas.data.forEach(function(resolucion){
        if(resolucion.FechaExpedicion!==null){
          //dado que el servicio no está almacenando la Feha de expedición directamente como null, se toma el valor "0001-01-01T00:00:00Z" como tal
          if(resolucion.FechaExpedicion.toString()==="0001-01-01T00:00:00Z"){
            resolucion.FechaExpedicion=null;
            resolucion.EstadoTexto="Creada";
          }else{
            if(resolucion.Estado){
              resolucion.EstadoTexto="Expedida";
            }else{
              resolucion.EstadoTexto="Cancelada";
            }
          }
        }else{
          if(resolucion.Estado){
            resolucion.EstadoTexto="Expedida";
          }else{
            resolucion.EstadoTexto="Cancelada";
          }
        }
      });
    }
  });

          //Funcion para cargar los datos de las resoluciones creadas y almacenadas dentro del sistema
          self.cargarDatosResolucion = function() {
            adminMidRequest.get("gestion_resoluciones/get_resoluciones_inscritas").then(function(response) {
                self.resolucionesInscritas.data = response.data;
            });
        };

  //Función para redireccionar la página web a la vista de edición del contenido de la resolución, donde se pasa por parámetro el id de la resolucion seleccionada
  $scope.verEditarResolucion = function(row){

    if(row.entity.FechaExpedicion === null || row.entity.FechaExpedicion.toString()==="0001-01-01T00:00:00Z"){
      self.FechaParaPDF = "Fecha de expedición pendiente";
    }else{
      var string1= row.entity.FechaExpedicion;
      string1 = string1.split('T')[0];
      self.FechaParaPDF =  string1;
    }

    var resolucion = {
      Id: row.entity.Id,
      Numero: row.entity.Numero,
      NivelAcademico_nombre : row.entity.NivelAcademico,
      IdFacultad : row.entity.Facultad,
      Vigencia : row.entity.Vigencia,
      Periodo : row.entity.Periodo,
      NumeroSemanas : row.entity.NumeroSemanas,
      Dedicacion : row.entity.Dedicacion,
      FacultadNombre: row.entity.FacultadNombre,
      FechaExpedicion: self.FechaParaPDF
    };


    var local = JSON.stringify(resolucion);
    localStorage.setItem('resolucion', local);
    $window.location.href = '#/vinculacionespecial/resolucion_detalle';

  };

  //Función para redireccionar la página web a la vista de adición y eliminación de docentes en la resolucion, donde se pasa por parámetro el id de la resolucion seleccionada
  $scope.verEditarDocentes = function(row){
    if(row.entity.Dedicacion === "TCO-MTO"){
      self.Dedicacion = "TCO|MTO";
    }else{
      self.Dedicacion = row.entity.Dedicacion;
    }

    var resolucion = {
      Id: row.entity.Id,
      Numero: row.entity.Numero,
      NivelAcademico_nombre : row.entity.NivelAcademico,
      IdFacultad : row.entity.Facultad,
      Vigencia : row.entity.Vigencia,
      Periodo : row.entity.Periodo,                       //--- se deja quemado, debe incluirse ne tabla resolucion
      NumeroSemanas : row.entity.NumeroSemanas,
      Dedicacion : self.Dedicacion
    };

    var local = JSON.stringify(resolucion);
    localStorage.setItem('resolucion', local);

    if(row.entity.TipoResolucion === "Vinculación"){
      $window.location.href = '#/vinculacionespecial/hojas_de_vida_seleccion';
    }
    if(row.entity.TipoResolucion === "Cancelación"){
      $window.location.href = '#/vinculacionespecial/resolucion_cancelacion';
    }

    if(row.entity.TipoResolucion === "Adición"){
      $window.location.href = '#/vinculacionespecial/resolucion_adicion';
    }

    if(row.entity.TipoResolucion === "Reducción"){
      $window.location.href = '#/vinculacionespecial/resolucion_reduccion';
    }


  };

  $scope.verListarDocentesAdicion = function(){
    $window.location.href = '#/vinculacionespecial/resolucion_adicion_detalle';
  };

  $scope.verListarDocentesReduccion = function(){
    $window.location.href = '#/vinculacionespecial/resolucion_reduccion_detalle';
  };

  $scope.verListarDocentesCancelacion = function(){
    $window.location.href = '#/vinculacionespecial/resolucion_cancelacion_detalle';
  };
  //Función para asignar controlador de la vista resolucion_vista.html, donde se pasa por parámetro el id de la resolucion seleccionada con ayuda de $mdDialog
  $scope.verVisualizarResolucion = function(row){

    if(row.entity.FechaExpedicion === null || row.entity.FechaExpedicion.toString()==="0001-01-01T00:00:00Z"){
      self.FechaParaPDF = "Fecha de expedición pendiente";
    }else{
      var string1= row.entity.FechaExpedicion;
      string1 = string1.split('T')[0];
      self.FechaParaPDF =  string1;
    }


    var resolucion = {
      Id: row.entity.Id,
      Numero: row.entity.Numero,
      NivelAcademico_nombre : row.entity.NivelAcademico,
      IdFacultad : row.entity.Facultad,
      Vigencia : row.entity.Vigencia,
      Periodo : row.entity.Periodo,                       //--- se deja quemado, debe incluirse ne tabla resolucion
      NumeroSemanas : row.entity.NumeroSemanas,
      Dedicacion: row.entity.Dedicacion,
      FacultadNombre: row.entity.FacultadNombre,
      FechaExpedicion: self.FechaParaPDF
    };

    var local = JSON.stringify(resolucion);
    localStorage.setItem('resolucion', local);
    $mdDialog.show({
      controller: "ResolucionVistaCtrl",
      controllerAs: 'resolucionVista',
      templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
      parent: angular.element(document.body),
      clickOutsideToClose:true,
      fullscreen: true
    });
  };

  //Función para redireccionar la página web a la vista de creación de una nueva resolución
  self.generarNuevaResolucion = function(){
    $window.location.href = '#/vinculacionespecial/resolucion_generacion';
  };

          //Función para realizar la anulación de la resolución
          $scope.verRealizarAnulacion = function(row) {
            administrativaRequest.get("resolucion/" + row.entity.Id).then(function(response) {
                var Resolucion = response.data;
                var resolucion_estado = {
                    FechaRegistro: self.CurrentDate,
                    Usuario: "",
                    Estado: {
                        Id: 6,
                    },
                    Resolucion: Resolucion
                };
                swal({
                    title: 'Confirmar anulación',
                    html: $translate.instant('CONFIRMAR_ANULADA') + '<br>' +
                        $translate.instant('IRREVERSIBLE') + '<br>' +
                        $translate.instant('NUMERO_RESOLUCION') + '<br>' +
                        Resolucion.NumeroResolucion,
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: $translate.instant('ANULADA_BTN')
                }).then(function() {
                    self.cambiarEstado(resolucion_estado);
                });
            });
        };

        //Función para cambiar el estado de la resolución
        self.cambiarEstado = function(resolucion_estado) {
          administrativaRequest.post("resolucion_estado", resolucion_estado).then(function(response) {
              if (response.statusText === "Created") {
                  self.cargarDatosResolucion();
                  swal(
                      'Felicidades',
                      $translate.instant('ANULADA'),
                      'success'
                  ).then(function() {
                    $window.location.reload();
                });
              } else {
                  swal(
                      'Error',
                      'Ocurrió un error',
                      'error'
                  );
              }
          });
      };


});
