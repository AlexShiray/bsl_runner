const { BSLArray } = require("./globalContext/objects/array");
const { BSLJSCode } = require("./globalContext/objects/jsCode");
const { BSLMap } = require("./globalContext/objects/map");
const { BSLStruct } = require("./globalContext/objects/struct");
const { BSLValueList, BSLValueListElem } = require("./globalContext/objects/valueList");
const { BSLDataHashing } = require("./globalContext/objects/dataHashing");
const { BSLBinaryData } = require("./globalContext/objects/binaryData");
const { BSLFile } = require("./globalContext/objects/file");
const { BSLCallbackDescription } = require("./globalContext/objects/callbackDescription");
const { BSLValueTable, BSLValueTableRow, BSLValueTableColumnCollection, BSLValueTableColumn, BSLCollectionIndexes, BSLCollectionIndex } = require("./globalContext/objects/valueTable");
const { BSLHTTPConnection, BSLHTTPQuery, BSLHTTPResponse } = require("./globalContext/objects/httpConnection");
const { BSLHTTPService, BSLHTTPServiceResponse, BSLHTTPServiceRequest } = require("./globalContext/objects/httpService");
const { BSLRegexp, BSLRegexpResult, BSLRegexpGroupOfResult } = require("./globalContext/objects/regexp");
const { BSLDatabase } = require("./globalContext/objects/database");
const { BSLQuery } = require("./globalContext/objects/query");
const { BSLTelegramBot } = require("./globalContext/objects/telegramBot");
const { BSLZipRead, BSLZipWrite, BSLZipElements, BSLZipElement } = require("./globalContext/objects/zip");
const { BSLBotRequest } = require("./globalContext/objects/botRequestResponse");
const { BSLKeyAndValue } = require("./globalContext/objects/keyAndValue");

exports.BSLGlobalContext = {
	$node: undefined,
	$BSLRunner: undefined
};

Object.assign(exports.BSLGlobalContext 
	, require("./globalContext/gcStrings").BSLGCStrings 
	, require("./globalContext/gcDate").BSLGCDate
	, require("./globalContext/gcNumber").BSLGCNumber
	, require("./globalContext/gcFormat").BSLGCFormat
	, require("./globalContext/gcValueList").BSLGCValueList
	, require("./globalContext/gcOS").BSLGCOS
	, require("./globalContext/gcOthers").BSLGCOthers
	, require("./globalContext/gcHashFunction").BSLGCHashFunction
	, require("./globalContext/gcBinaryData").BSLGCBinaryData
	, require("./globalContext/gcType").BSLGCType
	, require("./globalContext/gcCallbackDescription").BSLGCCallbackDescription
	, require("./globalContext/gcDatabase").BSLGCDatabaseType
	, require("./globalContext/gcTelegramBot").BSLGCTelegramBot
	, require("./globalContext/gcJSON").BSLGCJSON
);

exports.BSLGlobalContextObjects = {
	$node: undefined,
	$BSLRunner: undefined,
	Массив: BSLArray,
	JsCode: BSLJSCode,
	Соответствие: BSLMap,
	Структура: BSLStruct,
	СписокЗначений: BSLValueList,
	ХешированиеДанных: BSLDataHashing,
	ДвоичныеДанные: BSLBinaryData,
	Файл: BSLFile,
	ОписаниеОповещения: BSLCallbackDescription,
	ТаблицаЗначений: BSLValueTable,
	HTTPСоединение: BSLHTTPConnection,
	HTTPЗапрос: BSLHTTPQuery,
	HTTPСервис: BSLHTTPService,
	HTTPСервисОтвет: BSLHTTPServiceResponse,
	РегВыражение: BSLRegexp,
	БазаДанных: BSLDatabase,
	Запрос: BSLQuery,
	TelegramБот: BSLTelegramBot,
	ЗаписьZIPАрхива: BSLZipWrite,
	ЧтениеZIPАрхива: BSLZipRead
};

exports.BSLGlobalContextObjectsInternal = {
	$node: undefined,
	$BSLRunner: undefined,
	РезультатПоискаПоРегулярномуВыражению: BSLRegexpResult,
	ГруппаРезультатаПоискаПоРегулярномуВыражению: BSLRegexpGroupOfResult,
	HTTPСервисЗапрос: BSLHTTPServiceRequest,
	HTTPОтвет: BSLHTTPResponse,
	ЭлементыZipАрхива: BSLZipElements,
	ЭлементZipАрхива: BSLZipElement,
	СтрокаТаблицыЗначений: BSLValueTableRow,
	КоллекцияКолонокТаблицыЗначений: BSLValueTableColumnCollection,
	КолонкаТаблицыЗначений: BSLValueTableColumn,
	КоллекцияИндексов: BSLCollectionIndexes,
	ЭлементКоллекцииИндексов: BSLCollectionIndex,
	ЭлементСпискаЗначений: BSLValueListElem,
	БотЗапрос: BSLBotRequest,
	КлючИЗначение: BSLKeyAndValue
}
