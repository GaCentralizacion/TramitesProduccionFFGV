var apiJsonBPRO2detalles = {
    "IdEmpresa": 0,
    "IdSucursal": 0,
    "Tipo": 0,
    "OrdenCompra": {
      "IdProveedor": 0,
      "ArePed": "",
      "TipoComprobante": "",
      "FechaOrden": "",
      "FechaAplicacion": "",
      "anticipo": 0,
      "CantidadAnticipo": 0,
      "PorcentajeAnticipo": 0,
      "FechaAnticipo": "",
      "Detalle": [
        {
          "ConceptoContable": "",
          "Cantidad": 0,
          "Producto": "",
          "PrecioUnitario": 0,
          "TasaIva": 0,
          "Descuento": 0
        }
      ]
    },
    "ContabilidadMasiva": {
      "Polizas": [
        {
          "Proceso": "",
          "DocumentoOrigen": "",
          "Canal": "",
          "NumeroControl": "",
          "Documento": "",
          "Referencia2": "",
          "Deta": [
            {
              "DocumentoOrigen": "",
              "Partida": "",
              "TipoProducto": "",
              "SubProducto": "",
              "Origen": "",
              "Destino": "",
              "Moneda": "",
              "TipoCambio": "",
              "CostoUnitario": 0,
              "VentaUnitario": 0,
              "DescuentoUnitario": 0,
              "TasaIva": 0,
              "IVA": 0,
              "Persona1": 0,
              "Persona2": "0",
              "DocumentoAfectado": "",
              "Referencia2": ""
            },
            {
              "DocumentoOrigen": "",
              "Partida": "",
              "TipoProducto": "",
              "SubProducto": "",
              "Origen": "",
              "Destino": "",
              "Moneda": "",
              "TipoCambio": "",
              "CostoUnitario": 0,
              "VentaUnitario": 0,
              "DescuentoUnitario": 0,
              "TasaIva": 0,
              "IVA": 0,
              "Persona1": 0,
              "Persona2": "0",
              "DocumentoAfectado": "",
              "Referencia2": ""
            }
          ]
        }
      ]
    }
  }

  var apiJsonBPRO1detalle = {
    "IdEmpresa": 0,
    "IdSucursal": 0,
    "Tipo": 0,
    "OrdenCompra": {
      "IdProveedor": 0,
      "ArePed": "",
      "TipoComprobante": "",
      "FechaOrden": "",
      "FechaAplicacion": "",
      "anticipo": 0,
      "CantidadAnticipo": 0,
      "PorcentajeAnticipo": 0,
      "FechaAnticipo": "",
      "Detalle": [
        {
          "ConceptoContable": "",
          "Cantidad": 0,
          "Producto": "",
          "PrecioUnitario": 0,
          "TasaIva": 0,
          "Descuento": 0
        }
      ]
    },
    "ContabilidadMasiva": {
      "Polizas": [
        {
          "Proceso": "",
          "DocumentoOrigen": "",
          "Canal": "",
          "NumeroControl": "",
          "Documento": "",
          "Referencia2": "",
          "Deta": [
            {
              "DocumentoOrigen": "",
              "Partida": "",
              "TipoProducto": "",
              "SubProducto": "",
              "Origen": "",
              "Destino": "",
              "Moneda": "",
              "TipoCambio": "",
              "CostoUnitario": 0,
              "VentaUnitario": 0,
              "DescuentoUnitario": 0,
              "TasaIva": 0,
              "IVA": 0,
              "Persona1": 0,
              "Persona2": "0",
              "DocumentoAfectado": "",
              "Referencia2": ""
            }
          ]
        }
      ]
    }
  }

  var datalogAPI = {
    idSucursal : 0,
    unniqIdGenerado: '',
    tokenGenerado: '',
    id_perTra : 0,
    idVale: '',
    jsonEnvio: '',
    jsonRespuesta: '',
    tipoPol: '',
    consPol: '',
    anioPol: '',
    mesPol: '',
    empresaPol: '',
    opcion: 1,
    consecutivo:0,
    codigo:'',
    mensajeError:'',
    resuelto: 0,
    ordenCompra:''
}