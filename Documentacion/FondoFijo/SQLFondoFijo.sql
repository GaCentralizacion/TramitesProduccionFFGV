USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[fondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idEmpresa] [int] NOT NULL,
	[idSucursal] [int] NOT NULL,
	[idDepartamento] [int] NOT NULL,
	[nombreFondoFijo] [varchar](300) NOT NULL,
	[idFondoFijo] [varchar](50) NOT NULL,
	[idResponsable] [int] NOT NULL,
	[idAutorizador] [int] NOT NULL,
	[rutaIdentificacion] [varchar](300) NOT NULL,
	[rutaPagare] [varchar](300) NOT NULL,
	[rutaCarta] [varchar](300) NOT NULL,
--	[montoOriginal] [numeric](18, 4) NOT NULL,
--	[montoCambiado] [numeric](18, 4) NULL,
	[descripcion] [varchar](max) NULL,
	[fechaCreacion] [datetime] NOT NULL,
	[estatusFondoFijo] [int] NOT NULL
)ON [PRIMARY]
GO



USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[cat_estatusFondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](300) NOT NULL
)ON [PRIMARY]
GO

insert into Tramite.cat_estatusFondoFijo (descripcion) values 
('Solicitado'),
('Autorizado'),
('Vigente'),
('Vigente en reembolso'),
('Cancelado')

USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[cat_usuariosFondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](300) NOT NULL
)ON [PRIMARY]
GO

insert into Tramite.cat_usuariosFondoFijo (descripcion) values 
('Responsable'),
('Autorizador'),
('UsuarioFondoFijo'),
('Revisor')


USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[cat_gastosFondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](300) NOT NULL
)ON [PRIMARY]
GO

insert into [Tramite].[cat_gastosFondoFijo] (descripcion) values 
('Inventario'),
('Gasto')


USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[fondoFijoCambios](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idTablaFondoFijo] [int] NOT NULL,
	[montoInicial] [numeric](18,4) NOT NULL,
	[montoCambiado] [numeric](18,4) NOT NULL,
	[RutaDocumento] [varchar](300) NOT NULL,
	[fechaCambio] [datetime] NOT NULL
)ON [PRIMARY]
GO

USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[vales](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idEmpleado] [int] NOT NULL,
	[montoSolicitado] [numeric](18,4) NOT NULL,
	[descripcion] [varchar](MAX) NOT NULL,
	[fechaCreacionVale] [datetime] NOT NULL,
	[estatusVale] [int] NOT NULL
)ON [PRIMARY]
GO



USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[valesFondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idVales] [int] NOT NULL,
	[idTablaFondoFijo] [int] NOT NULL,
)ON [PRIMARY]
GO

USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[valesEvidencia](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idVales] [int] NOT NULL,
	[esFactura] [bit] NOT NULL,
	[archivoJPG] [varchar](300) NULL,
	[archivoPDF] [varchar](300) NULL,
	[archivoXML] [varchar](300) NULL,
	[comprobado] [bit] NOT NULL
)ON [PRIMARY]
GO


USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[factura](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[RFCProveedor] [varchar](20) NOT NULL,
	[idFactura] [int] NOT NULL,
	[fechaFactura] [date] NOT NULL,
	[monto] [numeric](18,4) NOT NULL,
	[concepto] [nvarchar](MAX) NOT NULL
)ON [PRIMARY]
GO


USE Tramites
GO

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON

CREATE TABLE [Tramite].[UsuariosFondoFijo](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[idUsuario] [int] NOT NULL,
	[idRol]
)ON [PRIMARY]
GO
