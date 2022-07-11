registrationModule.directive("ngFileSelect", function (fileReader, $timeout) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el, opcion) {
            function getFile(file) {
                var fileName = "";
                if(file && file.type == "application/pdf"){

                    var filePdf = file.name.split('.');

                    if(filePdf[1]!="pdf"){
                        fileName = filePdf[0]+".pdf" 
                        
                    }else{
                        fileName = file.name;
                    }
                    if(file && file.size <= 11000000 ){
                        //var nameFile = file.name;
                        var res = [];
                        fileReader.readAsDataUrl(file, $scope)
                            .then(function (result) {
                                $timeout(function () {
                                    res.archivo = result;
                                    res.nombreArchivo = fileName;
                                    $scope.ngModel = res;
                                });
                            });
                    }else{
                       
                        swal("Atencion!", "El archivo excede el tamaño máximo 10MB", "warning");
                    }

                }
                else{
                    swal("Atencion!", "El archivo no tiene la extensión requerida (PDF)", "warning");
                }
                

            
            }
            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});
 registrationModule.directive("ngFileXml", function(fileReader, $timeout) {
     return {
         scope: {
             ngModel: '='
         },
         link: function($scope, el) {
             function getFile(file) {
                var fileName = "";
                if(file && file.type == "text/xml"){

                    var filePdf = file.name.split('.');

                    if(filePdf[1]!="xml"){
                        fileName = filePdf[0]+".xml" 
                        
                    }else{
                        fileName = file.name;
                    }
                    if(file && file.size <= 11000000 ){
                        //var nameFile = file.name;
                        var res = [];
                        fileReader.readAsDataUrl(file, $scope)
                            .then(function (result) {
                                $timeout(function () {
                                    res.archivo = result;
                                    res.nombreArchivo = fileName;
                                    $scope.ngModel = res;
                                });
                            });
                    }else{
                       
                        swal("Atencion!", "El archivo excede el tamaño máximo 10MB", "warning");
                    }

                }
                else{
                    swal("Atencion!", "El archivo no tiene la extensión requerida (XML)", "warning");
                }
             }
             el.bind("change", function(e) {
                 var file = (e.srcElement || e.target).files[0];
                 getFile(file);
             });
         }
     };
 }); 
registrationModule.factory("fileReader", function($q, $log) {
    var onLoad = function(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function(reader, deferred, scope) {
        return function() {
            scope.$apply(function() {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function(event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function(file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
});