'use strict';

angular.module('contractualClienteApp')
    .controller('HojasDeVidaSeleccionCtrl', function(financieraMidRequest,administrativaRequest, financieraRequest, resolucion, adminMidRequest, oikosRequest, $localStorage, $scope, $mdDialog, $translate, $window) {

        var self = this;

        self.resolucion = JSON.parse(localStorage.getItem("resolucion"));
        self.estado = false;
        self.estado_ap = false;
        self.proyectos = [];
        self.vigencia_data = self.resolucion.Vigencia;
        var vinculacionesData = [];
        self.offset = 0;
        self.saldo_disponible = true;
        self.personasSeleccionadas1 = [];

        self.datosDocentesCargaLectiva = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableFiltering: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: false,
            enableSelectAll: false,

            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function(row) {

                    if(row.entity.CategoriaNombre === ""){
                      swal({
                          title: $translate.instant('ERROR'),
                          text: $translate.instant('ALERTA_ERROR_CATEGORIA'),
                          type: 'info',
                          confirmButtonText: $translate.instant('ACEPTAR')
                        })
                        row.isSelected = false;
                      }else{
                        self.personasSeleccionadas1 = gridApi.selection.getSelectedRows();

                      }

                });
            }
        };

        if(self.resolucion.NivelAcademico_nombre==="PREGRADO"){
          self.datosDocentesCargaLectiva.columnDefs = [{
                    field: 'docente_apellido',
                    displayName: $translate.instant('APELLIDO_DOCENTES'),
                    width: '15%'
                },
                {
                    field: 'docente_nombre',
                    displayName: $translate.instant('NOMBRES_DOCENTES'),
                    width: '15%'
                },
                {
                    field: 'docente_documento',
                    displayName: $translate.instant('DOCUMENTO_DOCENTES'),
                    width: '10%'
                },
                {

                    field: 'horas_lectivas',
                    displayName: $translate.instant('HORAS_LECTIVAS'),
                    width: '5%',
                    cellTemplate: '<center><div ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div></center>'},
                {
                    field: 'proyecto_nombre',
                    displayName: $translate.instant('PROYECTO_CURRICULAR'),
                    width: '33%'
                },
                {
                    field: 'CategoriaNombre',
                    displayName: $translate.instant('CATEGORIA'),
                    width: '10%'
                },
                {
                    field: 'tipo_vinculacion_nombre',
                    displayName: $translate.instant('DEDICACION'),
                    width: '10%'
                },
                {
                    field: 'id_tipo_vinculacion',
                    visible: false
                },
                {
                    field: 'id_proyecto',
                    visible: false
                },     
                {
                    field: 'dependencia_academica',
                    visible: false
                },

                  /*{
                      displayName: $translate.instant('OPCIONES'),
                      field: 'edit',
                      enableFiltering: false, enableSorting: false,
                      cellTemplate: '<center>' +
                      '<a class="ver"  ng-show="!row.entity.editrow" ng-click="grid.appScope.modificar_horas(row.entity)">' +
                      '<i title="{{\'MODIFICAR_HORAS_BTN\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover"></i></a> ' +
                      '<a class="ver"  ng-show="row.entity.editrow" ng-click="grid.appScope.guardar_horas_modificadas(row.entity)">' +
                      '<i title="{{\'GUARDAR_HORAS_BTN\' | translate }}" class="fa fa-floppy-o fa-lg  faa-shake animated-hover"></i></a> ' +
                      '<a class="ver"  ng-show="row.entity.editrow" ng-click="grid.appScope.cancelar_modificacion(row.entity)">' +
                      '<i title="{{\'CANCELAR_MOD_BTN\' | translate }}" class="fa fa-ban fa-lg  faa-shake animated-hover"></i></a> ' +
                      '</center>'
                   }*/
              ];
            } else {
                self.datosDocentesCargaLectiva.columnDefs = [{
                    field: 'docente_apellido',
                    displayName: $translate.instant('APELLIDO_DOCENTES'),
                    width: '15%'
                },
                {
                    field: 'docente_nombre',
                    displayName: $translate.instant('NOMBRES_DOCENTES'),
                    width: '15%'
                },
                {
                    field: 'docente_documento',
                    displayName: $translate.instant('DOCUMENTO_DOCENTES'),
                    width: '10%'
                },
                {

                    field: 'horas_lectivas',
                    displayName: $translate.instant('HORAS_LECTIVAS'),
                    width: '5%',
                    cellTemplate: '<center><div ng-if="!row.entity.editrow">{{COL_FIELD}}</div><div ng-if="row.entity.editrow"><input type="text" style="height:30px" ng-model="MODEL_COL_FIELD"</div></center>'},
                {
                    field: 'proyecto_nombre',
                    displayName: $translate.instant('PROYECTO_CURRICULAR'),
                    width: '33%'
                },
                {
                    field: 'CategoriaNombre',
                    displayName: $translate.instant('CATEGORIA'),
                    width: '7%'
                },
                {
                    field: 'tipo_vinculacion_nombre',
                    displayName: $translate.instant('DEDICACION'),
                    width: '5%'
                },
                {
                    field: 'id_tipo_vinculacion',
                    visible: false
                },
                {
                    field: 'id_proyecto',
                    visible: false
                },     
                {
                    field: 'dependencia_academica',
                    visible: false
                },

                  {
                      displayName: $translate.instant('OPCIONES'),
                      field: 'edit',
                      enableFiltering: false, enableSorting: false,
                      cellTemplate: '<center>' +
                      '<a class="ver"  ng-show="!row.entity.editrow" ng-click="grid.appScope.modificar_horas(row.entity)">' +
                      '<i title="{{\'MODIFICAR_HORAS_BTN\' | translate }}" class="fa fa-pencil fa-lg  faa-shake animated-hover"></i></a> ' +

                      '<a class="ver"  ng-show="row.entity.editrow" ng-click="grid.appScope.guardar_horas_modificadas(row.entity)">' +
                      '<i title="{{\'GUARDAR_HORAS_BTN\' | translate }}" class="fa fa-floppy-o fa-lg  faa-shake animated-hover"></i></a> ' +

                      '<a class="ver"  ng-show="row.entity.editrow" ng-click="grid.appScope.cancelar_modificacion(row.entity)">' +
                      '<i title="{{\'CANCELAR_MOD_BTN\' | translate }}" class="fa fa-ban fa-lg  faa-shake animated-hover"></i></a> ' +

                      '</center>'
                   }
              ];
            }




        self.precontratados = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableSorting: true,
            enableFiltering: true,
            enableRowSelection: false,
            enableRowHeaderSelection: false,
            columnDefs: [
                { field: 'Id', visible: false },
                { field: 'NombreCompleto', width: '20%', displayName: $translate.instant('NOMBRE') },
                { field: 'IdPersona', width: '10%', displayName: $translate.instant('DOCUMENTO_DOCENTES') },
                { field: 'Categoria', width: '10%', displayName: $translate.instant('CATEGORIA') },
                { field: 'IdDedicacion.NombreDedicacion', width: '10%', displayName: $translate.instant('DEDICACION') },
                { field: 'IdDedicacion.Id', visible: false },
                { field: 'NumeroHorasSemanales', width: '8%', displayName: $translate.instant('HORAS_SEMANALES') },
                { field: 'NumeroSemanas', width: '7%', displayName: $translate.instant('SEMANAS') },
                { field: 'NumeroDisponibilidad', width: '15%', displayName: $translate.instant('NUM_DISPO_DOCENTE') },
                { field: 'ValorContrato', width: '15%', displayName: $translate.instant('VALOR_CONTRATO'), cellClass: "valorEfectivo", cellFilter: "currency" },
                {
                    field: 'IdProyectoCurricular',
                    visible: false,
                    filter: {
                        term: self.term
                    }
                },
                {
                    field: 'cancelar',
                    enableSorting: false,
                    enableFiltering: false,
                    width: '5%',
                    displayName: $translate.instant('OPCIONES'),
                    cellTemplate: '<center>' +
                        '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
                        '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
                        '</center>'
                }
            ]
        };

        self.Disponibilidades = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: true,
            enableSelectAll: false,
            columnDefs: [{
                    field: 'NumeroDisponibilidad',
                    displayName: $translate.instant('NUM_DISPO_DOCENTE')
                },
                {
                    field: 'Vigencia',
                    displayName: $translate.instant('VIGENCIA_DISP')
                },
                {
                    field: 'FechaRegistro',
                    displayName: $translate.instant('FECHA_DISP'),
                    cellTemplate: '<span>{{row.entity.FechaRegistro| date:"yyyy-MM-dd":"+0900"}}</span>'
                }
            ]

        };

        self.Disponibilidades.onRegisterApi = function(gridApi) {
          gridApi.selection.on.rowSelectionChanged($scope, function() {
              self.disponibilidad_elegida = gridApi.selection.getSelectedRows();
              self.DisponibilidadApropiacion = self.disponibilidad_elegida[0].DisponibilidadApropiacion;
              self.listar_apropiaciones();


          });

          gridApi.core.on.filterChanged($scope, function() {
              var grid = this.grid;
              var query = '';
              angular.forEach(grid.columns, function(value, key) {
                  if (value.filters[0].term) {
                      var formtstr = value.colDef.name.replace('[0]','');
                      query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                  }
              });
              self.actualizarLista(self.offset, query);
          });
          gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {

              //self.gridOptions.data = {};

              //var inicio = $filter('date')(self.fechaInicio, "yyyy-MM-dd");
              //var fin = $filter('date')(self.fechaFin, "yyyy-MM-dd");
              var query = '';
              /*
              if (inicio !== undefined && fin !== undefined) {
                  query = '&rangoinicio=' + inicio + "&rangofin=" + fin;
              }
              */
              var grid = this.grid;
              angular.forEach(grid.columns, function(value, key) {
                  if (value.filters[0].term) {
                      var formtstr = value.colDef.name.replace('[0]','');
                      query = query + '&query='+ formtstr + '__icontains:' + value.filters[0].term;

                  }
              });
              self.offset = (newPage - 1) * pageSize;
              self.actualizarLista(self.offset, query);
          });
        };

        self.actualizarLista = function(offset, query) {
           financieraMidRequest.get('disponibilidad/ListaDisponibilidades/' + self.resolucion.Vigencia, 'limit=' + self.Disponibilidades.paginationPageSize + '&offset=' + offset + query + "&UnidadEjecutora=1").then(function(response) {
               if (response.data.Type !== undefined) {
                   self.Disponibilidades.data = [];
               } else {
                   self.Disponibilidades.data = response.data;
               }
           });
         };

        self.Apropiaciones = {
            paginationPageSizes: [10, 15, 20],
            paginationPageSize: 10,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableFiltering: true,
            multiSelect: false,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: true,
            useExternalPagination: false,
            enableSelectAll: false,
            columnDefs: [

                {
                    field: 'Apropiacion.Valor',
                    displayName: $translate.instant('VALOR_APROPIACION'),
                    cellFilter: "currency",
                    cellClass: "valorEfectivo"
                },
                {
                    field: 'Apropiacion.Saldo',
                    displayName: $translate.instant('SALDO_APROPIACION'),
                    cellFilter: "currency",
                    cellClass: "valorEfectivo"
                }
            ],

            onRegisterApi: function(gridApi) {
                self.gridApi = gridApi;
                gridApi.selection.on.rowSelectionChanged($scope, function() {
                    self.apropiacion_elegida = gridApi.selection.getSelectedRows();

                  //  self.verificarDisponibilidad();
                });
            }
        };


        adminMidRequest.get("gestion_previnculacion/Precontratacion/docentes_x_carga_horaria", "vigencia=" + self.resolucion.Vigencia + "&periodo=" + self.resolucion.Periodo + "&tipo_vinculacion=" + self.resolucion.Dedicacion + "&facultad=" + self.resolucion.IdFacultad + "&nivel_academico=" + self.resolucion.NivelAcademico_nombre).then(function(response) {
           self.datosDocentesCargaLectiva.data = response.data;

        });


        administrativaRequest.get("vinculacion_docente/get_total_contratos_x_resolucion/"+self.resolucion.Id, "").then(function(response) {
           self.total_contratos_x_vin = response.data;
        });


        oikosRequest.get("dependencia/proyectosPorFacultad/" + self.resolucion.IdFacultad + "/" + self.resolucion.NivelAcademico_nombre, "").then(function(response) {
            self.proyectos = response.data;
            self.defaultSelectedPrecont = self.proyectos[0].Id;
        });

        //Función para visualizar docentes ya vinculados a resolución
        self.get_docentes_vinculados = function() {
            self.estado = true;
            adminMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion=" + self.resolucion.Id).then(function(response) {
                self.precontratados.data = response.data;
                self.estado = false;

            });

            self.precontratados.columnDefs[10].filter.term = self.term;


        };

        //Función para almacenar los datos de las vinculaciones realizadas
        self.agregarPrecontratos = function() {

            vinculacionesData = [];
            if (self.saldo_disponible && self.apropiacion_elegida) {
                self.personasSeleccionadas1.forEach(function(personaSeleccionada) {
                  var vinculacionDocente = {
                      IdPersona: personaSeleccionada.docente_documento,
                      NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
                      NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
                      IdResolucion: { Id: parseInt(self.resolucion.Id) },
                      IdDedicacion: { Id: parseInt(personaSeleccionada.id_tipo_vinculacion) },
                      IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
                      Categoria: personaSeleccionada.CategoriaNombre.toUpperCase(),
                      Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toUpperCase(),
                      NivelAcademico: self.resolucion.NivelAcademico_nombre,
                      Disponibilidad: self.apropiacion_elegida[0].Id,
                      DependenciaAcademica: personaSeleccionada.DependenciaAcademica,
                      Vigencia: { Int64: parseInt(self.resolucion.Vigencia), valid: true }
                  };

                  vinculacionesData.push(vinculacionDocente);

              });

                adminMidRequest.post("gestion_previnculacion/Precontratacion/insertar_previnculaciones", vinculacionesData).then(function(response) {
                    if (typeof response.data === "number") {

                        self.datosDocentesCargaLectiva.data = [];
                        swal({
                            text: $translate.instant('VINCULACION_EXITOSA'),
                            type: 'success',
                            confirmButtonText: $translate.instant('ACEPTAR')

                          }).then(function() {
                            $window.location.reload();
                            self.personasSeleccionadas1 = [];
                            vinculacionesData = [];
                          });

                        //self.RecargarDatosPersonas();
                        //self.RecargarDisponibilidades();
                        //self.RecargarApropiaciones();
                        //self.get_docentes_vinculados();

                    } else {
                        swal({
                            title: $translate.instant('ERROR'),
                            text: $translate.instant('ALERTA_PREVIN_ERROR'),
                            type: 'info',
                            confirmButtonText: $translate.instant('ACEPTAR')
                          }).then(function() {
                            $window.location.reload();
                            self.personasSeleccionadas1 = [];
                            vinculacionesData = [];
                          });
                    }
                });

            } else {
                swal({
                    title: $translate.instant('ERROR'),
                    text: $translate.instant('ERROR_ELEG_DISP'),
                    type: 'info',
                    confirmButtonText: $translate.instant('ACEPTAR')
                });
            }


        };
        //* ----------------------------- *//

        $scope.modificar_horas = function (row) {
        //Get the index of selected row from row object
            var index = self.datosDocentesCargaLectiva.data.indexOf(row);
            //Use that to set the editrow attrbute value for seleted rows
            self.datosDocentesCargaLectiva.data[index].editrow = !self.datosDocentesCargaLectiva.data[index].editrow;
        };

        $scope.guardar_horas_modificadas = function (row){
         var index = self.datosDocentesCargaLectiva.data.indexOf(row);
          self.datosDocentesCargaLectiva.data[index].editrow = false;

        };

        $scope.cancelar_modificacion = function(row){
          var index = self.datosDocentesCargaLectiva.data.indexOf(row);
           self.datosDocentesCargaLectiva.data[index].editrow = false;
        };


        //*-------Funciones para la desvinculación de docentes ------ *//
        $scope.verCancelarInscripcionDocente = function(row) {
            swal({
                title: $translate.instant('PREGUNTA_SEGURO'),
                text: $translate.instant('CONFIRMAR_DESVINCULACION'),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: $translate.instant('DESVINCULAR_DOCENTE'),
                cancelButtonText: $translate.instant('CANCELAR'),
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function() {
                self.desvincularDocente(row);

            }, function(dismiss) {
                if (dismiss === 'cancel') {
                    swal(
                        $translate.instant('CANCELADO'),
                        $translate.instant('DESVINCULACION_CANCELADA'),
                        'error'
                    );
                }
            });
        };

        self.desvincularDocente = function(row) {


            administrativaRequest.delete("vinculacion_docente", row.entity.Id).then(function(response) {
                if (response.data === "OK") {
                    swal({
                        text: $translate.instant('DESVINCULACION_EXITOSA'),
                        type: 'success',
                        confirmButtonText: $translate.instant('ACEPTAR')

                    }).then(function() {
                        $window.location.reload();
                    });

                } else {
                    swal({
                        title: $translate.instant('ERROR'),
                        text: $translate.instant('DESVINCULACION_NOEXITOSA'),
                        type: 'error',
                        confirmButtonText: $translate.instant('ACEPTAR')
                    });

                }
            });
        };

        //*------ Funciones para manejo y verificación de disponibilidades elegidas ----- *//

        //Función que muestra modal que permite elegir Disponibilidades y sus apropiaciones
        self.mostrar_modal_disponibilidad = function() {

            if (self.personasSeleccionadas1.length === 0) {
                swal({
                    text: $translate.instant('ALERTA_SELEC_DOC'),
                    type: 'error',
                    confirmButtonText: $translate.instant('ACEPTAR')
                });
            } else {

              financieraRequest.get("disponibilidad/TotalDisponibilidades/" + self.resolucion.Vigencia, 'UnidadEjecutora=1') //formato de entrada  https://golang.org/src/time/format.go
                    .then(function(response) { //error con el success
                        self.Disponibilidades.totalItems = response.data;
                        self.actualizarLista(self.offset, '');
              });
              /*financieraRequest.get('disponibilidad', "limit=100&query=Vigencia:" + self.vigencia_data).then(function(response) {
                    self.Disponibilidades.data = response.data;
                });
                */
                self.personasSeleccionadas1.forEach(function(personaSeleccionada) {
                    var vinculacionDocente = {
                        IdPersona: personaSeleccionada.docente_documento,
                        NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
                        NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
                        IdResolucion: { Id: parseInt(self.resolucion.Id) },
                        IdDedicacion: { Id: parseInt(personaSeleccionada.id_tipo_vinculacion) },
                        IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
                        Categoria: personaSeleccionada.CategoriaNombre.toUpperCase(),
                        Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toUpperCase(),
                        NivelAcademico: self.resolucion.NivelAcademico_nombre,
                        DependenciaAcademica: personaSeleccionada.DependenciaAcademica,
                        Vigencia: { Int64: parseInt(self.resolucion.Vigencia), valid: true },
                        Periodo: self.resolucion.Periodo
                    };

                    vinculacionesData.push(vinculacionDocente);

                });

                adminMidRequest.post("gestion_previnculacion/Precontratacion/calcular_valor_contratos_seleccionados ", vinculacionesData).then(function(response) {
                    self.total_contratos_seleccionados = response.data

                });

                $('#modal_disponibilidad').modal('show');
                vinculacionesData = [];
            }
        };

        //Función que lista las apropiaciones  del cdp elegido junto con su saldo y su valor
        self.listar_apropiaciones = function() {
            self.estado_ap = true;
            self.ver = false;
            var disponibilidadAp = self.DisponibilidadApropiacion;
            adminMidRequest.post("consultar_disponibilidades/listar_apropiaciones", disponibilidadAp).then(function(response) {
                self.Apropiaciones.data = response.data;
                self.ver = true;
                self.estado_ap = false;
                //self.Apropiaciones.data = response.data;

            });

        };

        //Función que verifica si la apropiación elegida cubre los docentes elegidos
        self.verificarDisponibilidad = function() {

            self.personasSeleccionadas1.forEach(function(personaSeleccionada) {
                var vinculacionDocente = {
                    IdPersona: personaSeleccionada.docente_documento,
                    NumeroHorasSemanales: parseInt(personaSeleccionada.horas_lectivas),
                    NumeroSemanas: parseInt(self.resolucion.NumeroSemanas),
                    IdResolucion: { Id: parseInt(self.resolucion.Id) },
                    IdDedicacion: { Id: parseInt(personaSeleccionada.id_tipo_vinculacion) },
                    IdProyectoCurricular: parseInt(personaSeleccionada.id_proyecto),
                    Categoria: personaSeleccionada.CategoriaNombre.toUpperCase(),
                    Dedicacion: personaSeleccionada.tipo_vinculacion_nombre.toUpperCase(),
                    NivelAcademico: self.resolucion.NivelAcademico_nombre,
                    Disponibilidad: self.apropiacion_elegida[0].Id,
                    DependenciaAcademica: personaSeleccionada.DependenciaAcademica,
                    Vigencia: { Int64: parseInt(self.resolucion.Vigencia), valid: true },
                    Periodo: self.resolucion.Periodo
                };

                vinculacionesData.push(vinculacionDocente);

            });

            adminMidRequest.post("gestion_previnculacion/Precontratacion/calcular_valor_contratos", vinculacionesData).then(function(response) {

              if (response.data > parseInt(self.apropiacion_elegida[0].Apropiacion.Saldo)) {
                    self.saldo_disponible = false;

                } else {
                    self.saldo_disponible = true;

                }
            });
            vinculacionesData = [];
        };

        //*--------------Funciones para recargar grids que han sido seleccionados -------------* //
        self.RecargarDatosPersonas = function() {
            adminMidRequest.get("gestion_previnculacion/Precontratacion/docentes_x_carga_horaria", "vigencia=" + self.resolucion.Vigencia + "&periodo=" + self.resolucion.Periodo + "&tipo_vinculacion=" + self.resolucion.Dedicacion + "&facultad=" + self.resolucion.IdFacultad + "&nivel_academico=" + self.resolucion.NivelAcademico_nombre).then(function(response) {
                self.datosDocentesCargaLectiva.data = response.data;

            });
        };

        self.RecargarDisponibilidades = function() {
            financieraRequest.get('disponibilidad', "limit=&query=Vigencia:" + self.vigencia_data).then(function(response) {
                self.Disponibilidades.data = response.data;

            });
        };

        self.RecargarApropiaciones = function() {
            self.Apropiaciones.data = [];

        };

});