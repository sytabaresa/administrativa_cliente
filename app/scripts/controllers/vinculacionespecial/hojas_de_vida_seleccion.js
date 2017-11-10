'use strict';

angular.module('contractualClienteApp')
  .controller('HojasDeVidaSeleccionCtrl', function (resolucion,amazonAdministrativaRequest,adminMidRequest,oikosAmazonRequest,contratacion_mid_request,$scope,$mdDialog,$routeParams,$translate) {

    var self = this;

    self.datosFiltro;
    self.resolucion = resolucion

    self.estado = false;
    //Lectura del parámetro de resolución de entrada
    self.idResolucion=$routeParams.idResolucion;

    self.dedicaciones;
    self.proyectos=[];


    self.datosPersonas = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableRowSelection: true,
      enableRowHeaderSelection: true,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: true,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs : [
        {
          field: 'Id',
          displayName: $translate.instant('DOCUMENTO')
        },
        {
          field: 'NombreCompleto',
          width: '40%', displayName:
          $translate.instant('NOMBRE')
        },
        {
          field: 'Escalafon',
          displayName: $translate.instant('CATEGORIA')
        },
        {
            name: $translate.instant('OPCIONES'),
            enableFiltering: false,
            width: '15%',
            cellTemplate: '<center>' +
               '<a class="ver" ng-click="grid.appScope.verInformacionPersonal(row)">' +
               '<i title="{{\'VER_INFO_PERSONAL_BTN\' | translate }}" class="fa fa-user fa-lg  faa-shake animated-hover"></i></a> ' /*+
               '<a class="editar" ng-click="grid.appScope.verFormacionAcademica(row)">' +
               '<i title="{{\'VER_INFO_ACADEMICA\' | translate }}" class="fa fa-graduation-cap fa-lg  faa-shake animated-hover"></i></a> ' +
               '<a class="ver" ng-click="grid.appScope.verHistoriaLaboral(row)">' +
               '<i title="{{\'VER_EXP_LABORAL\' | translate }}" class="fa fa-pencil fa-lg faa-shake animated-hover"></i></a> ' +
               '<a class="editar" ng-click="grid.appScope.verTrabajosInvestigacion(row)">' +
               '<i title="{{\'VER_TRABAJOS_INVESTIGACION\' | translate }}" class="fa fa-book fa-lg fa-lg animated-hover"></i></a> ' */+
               '</center>'
        }
      ],
      onRegisterApi : function(gridApi){
        self.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope,function(row){
          self.personasSeleccionadas=gridApi.selection.getSelectedRows();
          if(self.personasSeleccionadas.length==0){
            self.persona=null;
          }else{
            amazonAdministrativaRequest.get("informacion_persona_natural/"+row.entity.Id).then(function(response){
              if(typeof(response.data)=="object"){
                self.persona=row.entity;
                self.persona.FechaExpedicionDocumento = new Date(self.persona.FechaExpedicionDocumento).toLocaleDateString('es');
              }else{
                swal({
                  title: $translate.instant('PROBLEMA'),
                  text: $translate.instant('MENSAJE_ERROR'),
                  type: "danger",
                  confirmButtonText: $translate.instant('ACEPTAR'),
                  closeOnConfirm: false,
                  showLoaderOnConfirm: true,
                });
              }
            });
          }
        });
      }
    };

    //Se leen los datos básicos de la resolucion de vinculación especial
    amazonAdministrativaRequest.get("persona_escalafon/persona_escalafon_"+self.resolucion.NivelAcademico_nombre.toLowerCase()).then(function(response){
      self.datosPersonas.data=response.data;
      self.datosPersonas.data.forEach(function(row){

        //El nombre completo se guarda en una sola variable
        row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
      });
    });

    self.RecargarDatosPersonas = function(){
      amazonAdministrativaRequest.get("persona_escalafon/persona_escalafon_"+self.resolucion.NivelAcademico_nombre.toLowerCase()).then(function(response){
        self.datosPersonas.data=response.data;
        self.datosPersonas.data.forEach(function(row){

          //El nombre completo se guarda en una sola variable
          row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
        });
      });
    }

    oikosAmazonRequest.get("dependencia_padre","query=Padre%3A"+self.resolucion.IdFacultad+"&fields=Hija&limit=-1").then(function(response){
      if(response.data==null){
        //En caso de que no existan proyectos curriculares asociados a la facultad, la facultad es asignada como la dependencia donde se asocian los docentes
        oikosAmazonRequest.get("dependencia/"+self.resolucion.IdFacultad).then(function(response){
          self.proyectos=[response.data]
        });
      }
      else{
        var auxProyectos=response.data;
        var auxNum=0;
        auxProyectos.forEach(function(aux){
          oikosAmazonRequest.get("dependencia_tipo_dependencia","query=DependenciaId.Id%3A"+aux.Hija.Id.toString()+"%2CTipoDependenciaId.Id%3A1&limit=-1").then(function(response){
            if(response.data!=null){
              oikosAmazonRequest.get("dependencia_tipo_dependencia","query=DependenciaId.Id%3A"+aux.Hija.Id.toString()+"%2CTipoDependenciaId.Id%3A"+self.resolucion.NivelAcademico.toString()+"&limit=-1").then(function(response){
                auxNum++;
                if(response.data!=null){
                  self.proyectos.push(response.data[0].DependenciaId);
                }
                if(auxNum==auxProyectos.length){
                  if(self.proyectos.length==0){
                    //En caso de que no existan proyectos curriculares asociados a la facultad, la facultad es asignada como la dependencia donde se asocian los docentes
                    oikosAmazonRequest.get("dependencia/"+self.datosFiltro.IdFacultad).then(function(response){
                      self.proyectos=[response.data]
                    });
                  }
                }
              });
            }else{
              auxNum++;
            }
          });
        });
      }


    });

    amazonAdministrativaRequest.get("dedicacion","limit=-1&query=NombreDedicacion__in:"+self.resolucion.Dedicacion).then(function(response){
      if(typeof(response.data)=="object"){
        self.dedicaciones=response.data;
      }
    });


    //Se cargan los datos de los docentes que han sido asociados previamente a la resolucion
    self.precontratados = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: true,
      enableFiltering : true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      columnDefs : [
        {field: 'Id', visible : false},
        {field: 'NombreCompleto', width: '25%', displayName: $translate.instant('NOMBRE')},
        {field: 'Documento', displayName: $translate.instant('CEDULA')},
        {field: 'Expedicion', displayName: $translate.instant('EXPEDICION')},
        {field: 'Categoria', displayName: $translate.instant('CATEGORIA')},
        {field: 'Dedicacion', displayName: $translate.instant('DEDICACION')},
        {field: 'HorasSemanales', displayName: $translate.instant('HORAS_SEMANALES')},
        {field: 'Semanas', displayName: $translate.instant('SEMANAS')},
        {field: 'ValorContrato', displayName: $translate.instant('VALOR_CONTRATO'), cellClass:"valorEfectivo"},
        {field: 'ProyectoCurricular', visible:false,filter: {
                        term: self.term
                    }},
        {
          field: 'cancelar',
          enableSorting: false,
          enableFiltering: false,
          width: '5%',
          displayName: '',
          cellTemplate: '<center>' +
            '<a class="borrar" ng-click="grid.appScope.verCancelarInscripcionDocente(row)">' +
            '<i title="{{\'BORRAR_BTN\' | translate }}" class="fa fa-trash fa-lg  faa-shake animated-hover"></i></a></div>' +
            '</center>'
        }
      ]
    };


/*
    amazonAdministrativaRequest.get("precontratado/"+self.resolucion.Id.toString()).then(function(response){
      self.precontratados.data=response.data;
      if(self.precontratados.data != null){
        self.precontratados.data.forEach(function(row){
            row.NombreCompleto = row.PrimerNombre + ' ' + row.SegundoNombre + ' ' + row.PrimerApellido + ' ' + row.SegundoApellido;
          });
      }else{
        self.precontratados.data=[]
      }
    });
*/




    self.get_proyecto=function(){

      self.estado = true;
      adminMidRequest.post("calculo_salario/Precontratacion/"+self.resolucion.Id.toString()+"/"+self.resolucion.NivelAcademico_nombre).then(function(response){
        self.precontratados.data=response.data
        self.precontratados.ValorContrato=self.FormatoNumero(response.data,0);
        self.estado = false;
      });
      self.precontratados.columnDefs[9].filter.term = self.term;

    }

      //Función para almacenar los datos de las vinculaciones realizadas
    self.agregarPrecontratos = function(){

      console.log("numero de semanas por resolucion")
      console.log(self.resolucion.NumeroSemanas)

      var vinculacionesData=[];

      //Se almacenan los datos en un arreglo de estructuras
      self.personasSeleccionadas.forEach(function(personaSeleccionada){
        var vinculacionDocente = {
          IdPersona: personaSeleccionada.Id,
          NumeroHorasSemanales: self.datosValor.NumHorasSemanales,
          NumeroSemanas: self.resolucion.NumeroSemanas,
          IdResolucion: {Id: parseInt(self.resolucion.Id)},
          IdDedicacion: {Id: parseInt(self.dedicacion)},
          IdProyectoCurricular: parseInt(self.datosValor.proyectoCurricular)
        };

        vinculacionesData.push(vinculacionDocente);
        console.log("Aqui ando");
        console.log(vinculacionDocente);
      })

      //Se envía en arreglo de estructuras a la transacción encargadade almacenar los datos
      amazonAdministrativaRequest.post("vinculacion_docente/InsertarVinculaciones",vinculacionesData).then(function(response){
          if(typeof(response.data)=="object"){
            self.persona=null;
            swal({
              text: $translate.instant('VINCULACION_EXITOSA'),
              type: 'success',
              confirmButtonText: $translate.instant('ACEPTAR')

              })
              self.term = self.datosValor.proyectoCurricular
              self.get_proyecto();
            }else{
            swal({
              title: $translate.instant('ERROR'),
              text: $translate.instant('CONTRATO_NO_ALMACENADO'),
              type: 'info',
              confirmButtonText: $translate.instant('ACEPTAR')
            })
          }
      })

      self.datosValor.NumSemanas = "";
      self.datosValor.NumHorasSemanales = "";
      self.RecargarDatosPersonas();

    }


    $scope.verCancelarInscripcionDocente=function(row){
      swal({
        title: $translate.instant('PREGUNTA_SEGURO'),
        text: $translate.instant('CONFIRMAR_DESVINCULACION'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: $translate.instant('DEVINCULAR_DOCENTE'),
        cancelButtonText: $translate.instant('CANCELAR'),
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function () {
        self.desvincularDocente(row);
      }, function (dismiss) {
        if (dismiss === 'cancel') {
          swal(
            $translate.instant('CANCELADO'),
            $translate.instant('DESVINCULACION_CANCELADA'),
            'error'
          )
        }
      })
    }

    self.desvincularDocente = function(row){
      var idDedicacion;
      switch(row.entity.Dedicacion){
        case "TCO":
          idDedicacion=4;
          break;
        case "MTO":
          idDedicacion=3;
          break;
        case "HCH":
          idDedicacion=1;
          break;
        case "HCP":
          idDedicacion=2;
          break;
      }

      var vinculacionCancelada = {
        IdPersona: row.entity.Documento,
        NumeroHorasSemanales: row.entity.HorasSemanales,
        NumeroSemanas: row.entity.Semanas,
        IdResolucion: {Id: parseInt(self.idResolucion)},
        IdDedicacion: {Id: parseInt(idDedicacion)},
        IdProyectoCurricular: parseInt(row.entity.ProyectoCurricular),
        Estado: false
      };

      amazonAdministrativaRequest.put("vinculacion_docente",row.entity.Id,vinculacionCancelada).then(function(response){
        if(response.data=="OK"){
          self.persona=null;
          swal({
            text: $translate.instant('DESVINCULACION_EXITOSA'),
            type: 'success',
            confirmButtonText: $translate.instant('ACEPTAR')

            })
            self.get_proyecto();
          }else{
          swal({
            title: $translate.instant('ERROR'),
            text: $translate.instant('DESVINCULACION_NOEXITOSA'),
            type: 'error',
            confirmButtonText: $translate.instant('ACEPTAR')
          })

        }
      })
    }

    self.inscribirContratos = function(){
      self.contratosInscritos = self.contratados.data;
      self.verCalcularSalario();
    }

    self.asignarContrato = function(){
      self.verCalcularSalario();
    }

    self.verCalcularSalario = function(){
       $mdDialog.show({
        controller: "ContratoRegistroCtrl",
        controllerAs: "contratoRegistro",
        templateUrl: 'views/vinculacionespecial/contrato_registro.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {persona: self.persona, nivelAcademico: self.nivelAcademico, idFacultad: self.idFacultad, idProyectoCurricular: self.idProyectoCurricular,contratados: self.contratosInscritos}
      })
    };

    self.mostrarReglas = function(){
      var textoReglas="";
      switch(self.resolucion.Dedicacion){
        case "HCH":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('HCH')+'</b>'+ $translate.instant('HCH1')+'</p>'
          break;
        case "HCP":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('HCP')+'</b>'+$translate.instant('HCP1')+'</p>'
          break;
        case "TCO|MTO":
          textoReglas=textoReglas+'<p><b>'+$translate.instant('MTO')+'</b>'+$translate.instant('MTO1')+'</p>'+
                                  '<p><b>'+$translate.instant('TCO')+'</b>'+$translate.instant('TCO1')+'</p>'
          break;
      }
      swal({
        title: $translate.instant('REGLAS'),
        type: 'info',
        html: textoReglas
      })
    }

    $scope.verInformacionPersonal = function(row){
      $mdDialog.show({
        controller: "InformacionPersonalCtrl",
        controllerAs: 'informacionPersonal',
        templateUrl: 'views/vinculacionespecial/informacion_personal.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    }

    $scope.verHistoriaLaboral = function(row){
      $mdDialog.show({
        controller: "HistoriaLaboralCtrl",
        controllerAs: 'historiaLaboral',
        templateUrl: 'views/vinculacionespecial/experiencia_laboral_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    }

    $scope.verFormacionAcademica = function(row){
      $mdDialog.show({
        controller: "FormacionAcademicaCtrl",
        controllerAs: "formacionAcademica",
        templateUrl: 'views/vinculacionespecial/formacion_academica_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

    $scope.verTrabajosInvestigacion = function(row){
       $mdDialog.show({
        controller: "TrabajosInvestigacionCtrl",
        controllerAs: "trabajosInvestigacion",
        templateUrl: 'views/vinculacionespecial/trabajos_investigacion_detalle.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        fullscreen: true,
        locals: {idPersona: row.entity.Id}
      })
    };

    self.Unidades = function(num){
      switch(num)
      {
        case 1: return $translate.instant('UN');
        case 2: return $translate.instant('DOS');
        case 3: return $translate.instant('TRES');
        case 4: return $translate.instant('CUATRO');
        case 5: return $translate.instant('CINCO');
        case 6: return $translate.instant('SEIS');
        case 7: return $translate.instant('SIETE');
        case 8: return $translate.instant('OCHO');
        case 9: return $translate.instant('NUEVE');
      }

      return "";
    }

    self.Decenas = function(num){

      var decena = Math.floor(num/10);
      var unidad = num - (decena * 10);

      switch(decena)
      {
        case 1:
          switch(unidad)
          {
            case 0: return $translate.instant('DIEZ');
            case 1: return $translate.instant('ONCE');
            case 2: return $translate.instant('DOCE');
            case 3: return $translate.instant('TRECE');
            case 4: return $translate.instant('CATORCE');
            case 5: return $translate.instant('QUINCE');
            case 6: return $translate.instant('DIECISEIS');
            case 7: return $translate.instant('DIECISIETE');
            case 8: return $translate.instant('DIECIOCHO');
            case 9: return $translate.instant('DIECINUEVE');
            //default: return "DIECI" + self.Unidades(unidad);
          }
        case 2:
          switch(unidad)
          {
            case 0: return $translate.instant('VEINTE');
            case 1: return $translate.instant('VEINTIUNO');
            case 2: return $translate.instant('VEINTIDOS');
            case 3: return $translate.instant('VEINTITRES');
            case 4: return $translate.instant('VEINTICUATRO');
            case 5: return $translate.instant('VEINTICINCO');
            case 6: return $translate.instant('VEINTISEIS');
            case 7: return $translate.instant('VEINTISIETE');
            case 8: return $translate.instant('VEINTIOCHO');
            case 9: return $translate.instant('VEINTINUEVE');
            //default: return "VEINTI" + self.Unidades(unidad);
          }
        case 3: return self.DecenasY($translate.instant('TREINTA'), unidad);
        case 4: return self.DecenasY($translate.instant('CUARENTA'), unidad);
        case 5: return self.DecenasY($translate.instant('CINCUENTA'), unidad);
        case 6: return self.DecenasY($translate.instant('SESENTA'), unidad);
        case 7: return self.DecenasY($translate.instant('SETENTA'), unidad);
        case 8: return self.DecenasY($translate.instant('OCHENTA'), unidad);
        case 9: return self.DecenasY($translate.instant('NOVENTA'), unidad);
        case 0: return self.Unidades(unidad);
      }
    }

    self.DecenasY = function(strSin, numUnidades){
      if (numUnidades > 0)
        return strSin + $translate.instant('Y') + self.Unidades(numUnidades)

      return strSin;
    }

    self.Centenas = function(num){

      var centenas = Math.floor(num / 100);
      var decenas = num - (centenas * 100);

      switch(centenas)
      {
        case 1:
          if (decenas > 0)
            return $translate.instant('CIENTO')+ self.Decenas(decenas);
          return $translate.instant('CIEN');
        case 2: return $translate.instant('DOSCIENTOS') + self.Decenas(decenas);
        case 3: return $translate.instant('TRESCIENTOS') + self.Decenas(decenas);
        case 4: return $translate.instant('CUATROCIENTOS') + self.Decenas(decenas);
        case 5: return $translate.instant('QUINIENTOS') + self.Decenas(decenas);
        case 6: return $translate.instant('SEISCIENTOS') + self.Decenas(decenas);
        case 7: return $translate.instant('SETECIENTOS') + self.Decenas(decenas);
        case 8: return $translate.instant('OCHOCIENTOS') + self.Decenas(decenas);
        case 9: return $translate.instant('NOVECIENTOS') + self.Decenas(decenas);
      }

      return self.Decenas(decenas);
    }

    self.Seccion = function(num, divisor, strSingular, strPlural){
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var letras = "";

      if (cientos > 0)
        if (cientos > 1)
          letras = self.Centenas(cientos) + " " + strPlural;
        else
          letras = strSingular;

      if (resto > 0)
        letras += "";

      return letras;
    }

    self.Miles = function(num){
      var divisor = 1000;
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var strMiles = self.Seccion(num, divisor, $translate.instant('UN_MIL'), $translate.instant('MIL'));
      var strCentenas = self.Centenas(resto);

      if(strMiles == "")
        return strCentenas;

      return strMiles + " " + strCentenas;

    }

    self.Millones = function(num){
      var divisor = 1000000;
      var cientos = Math.floor(num / divisor)
      var resto = num - (cientos * divisor)

      var strMillones = self.Seccion(num, divisor, $translate.instant('UN_MILLON'), $translate.instant('MILLONES'));
      var strMiles = self.Miles(resto);

      if(strMillones == "")
        return strMiles;

      return strMillones + " " + strMiles;

    }

    self.NumeroALetras = function(num){
      var data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: "",
        letrasMonedaPlural: $translate.instant('PESOS'),
        letrasMonedaSingular: $translate.instant('PESO')
      };

      if (data.centavos > 0)
        data.letrasCentavos = $translate.instant('CON')+ data.centavos + "/100";

      if(data.enteros == 0)
        return $translate.instant('CERO') + data.letrasMonedaPlural + " " + data.letrasCentavos;
      if (data.enteros == 1)
        return self.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + data.letrasCentavos;
      else
        return self.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    }

    self.FormatoNumero=function(amount, decimals) {

        amount += '';
        amount = parseFloat(amount.replace(/[^0-9\.]/g, ''));

        decimals = decimals || 0;

        if (isNaN(amount) || amount === 0)
            return parseFloat(0).toFixed(decimals);

        amount = '' + amount.toFixed(decimals);

        var amount_parts = amount.split('.'),
            regexp = /(\d+)(\d{3})/;

        while (regexp.test(amount_parts[0]))
            amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');

        return amount_parts.join('.');
    }


});
