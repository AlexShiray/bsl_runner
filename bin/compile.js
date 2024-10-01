
exports.BSLCompiler = class BSLCompiler{
    #object;
    filename;
    source;
    #noCompile = {
        "BSLVariableNode": ["text"],
        "BSLBinOperatorNode": ["text"],
        "BSLVariableNode": ["text"],
        "BSLNewObjectNode": ["text"],
        "BSLUnarOperatorNode": ["text"],
        "BSLStringNode": ["text"],
        "BSLObjectContextNode": ["text"],
        "BSLObjectNode": ["text"],
        "BSLNumberNode": ["text"],
    };

    constructor(object, filename = "", source = ""){
        this.#object = object;
        this.filename = filename;
        this.source = source;
    }

    compile(noSource = false){
        let serializedObj = {
            source: (noSource ? undefined : this.source),
            AST: this.serialize(this.#object, noSource)
        };

        this.#object = serializedObj;
        return this.#object;
    }

    compress(){
        this.#object = "BBSL" + require('zlib').brotliCompressSync(JSON.stringify(this.#object)).toString("base64");
        return this.#object;
    }

    decompress(){
        this.#object = JSON.parse(require('zlib').brotliDecompressSync(Buffer.from(this.#object.substring(4), "base64")).toString());
    }

    decompile(){
        this.#object = this.deserialize(this.#object.AST);
        return [
            this.#object.source,
            this.#object
        ];
    }

    save(){
        let filepath = require('node:path').parse(this.filename);

        if(filepath.ext !== ".bbsl"){
            this.filename = filepath.name + ".bbsl";
        }

        require("fs").writeFileSync(this.filename, this.#object);
    }

    get(){
        return this.#object;
    }

    serialize(object, noSource = false, mapping = undefined){
        let resultObj = {}
            , prototype = Object.getPrototypeOf(object)
            , className = prototype.constructor.name
            , propNames = Object.keys(object)
            ;

        if(mapping === undefined) mapping = {funcs: {}, vars: {}};

        if(object === require('./globalContext/objects/undefinedNull').BSLUndefined || object === require('./globalContext/objects/undefinedNull').BSLNull){
            resultObj["class"] = object.name;
            return resultObj;
        }

        resultObj["class"] = className;

        if(object instanceof require('./globalContext/objects/string').BSLString ||
            object instanceof require('./globalContext/objects/number').BSLNumber ||
            object instanceof require('./globalContext/objects/date').BSLDate
        ){
            resultObj["data"] = object.valueOf();
            return resultObj;
        }

        let parseProps = (resultObj, object, propName, noSource, mapping)=>{

            if(noSource && object[propName] instanceof require('./token').BSLToken && (object[propName].type.name == "VARIABLE" || object[propName].type.name == "CALLFUNC" || object[propName].type.name == "OBJECT")){
                let newName;

                if(object[propName].type.name == "VARIABLE"){
                    newName = mapping.vars[object[propName].text.toLowerCase()];

                    if(newName === undefined){
                        newName = `#П${Object.keys(mapping.vars).length}`;
                        mapping.vars[object[propName].text.toLowerCase()] = newName;
                    }

                    object[propName].text = newName;
                }else if(object[propName].type.name == "CALLFUNC"){
                    newName = mapping.funcs[object[propName].text.toLowerCase()];

                    if(newName !== undefined){
                        object[propName].text = newName;
                    }
                }else if(object[propName].type.name == "OBJECT"){
                    newName = mapping.vars[object[propName].text.toLowerCase()];

                    if(newName !== undefined){
                        object[propName].text = newName;
                    }
                }
            }

            if(noSource && object[propName] instanceof require('./AST/functionNode').BSLFunctionNode){
                let newName = `#Ф${Object.keys(mapping.funcs).length}`;
                mapping.funcs[object[propName].text.toLowerCase()] = newName;
                object[propName].text = newName;
            }

            if(noSource && object[propName] instanceof require('./AST/functionNode')){
                let newName = mapping.vars[object[propName].text.toLowerCase()];

                if(newName === undefined){
                    newName = `#П${Object.keys(mapping.vars).length}`;
                    mapping.vars[object[propName].text.toLowerCase()] = newName;
                }

                object[propName].text = newName;
            }

            if(noSource && object[propName] instanceof require('./AST/variableNode').BSLVariableNode){
                let newName = mapping.vars[object[propName].text.toLowerCase()];

                if(newName === undefined){
                    newName = `#П${Object.keys(mapping.vars).length}`;
                    mapping.vars[object[propName].text.toLowerCase()] = newName;
                }

                object[propName].text = newName;
            }

            if(noSource && object[propName] instanceof require('./AST/unarOperator').BSLUnarOperatorNode){
                let newName = mapping.funcs[object[propName].text.toLowerCase()];

                if(newName !== undefined){
                    object[propName].text = newName;
                }
            }

            if(noSource && object[propName] instanceof require('./AST/objectNode').BSLObjectNode){
                let newName = mapping.vars[object[propName].text.toLowerCase()];

                if(newName !== undefined){
                    object[propName].text = newName;
                }
            }
            
            if(object[propName] instanceof require('./tokenTypes').BSLTokenType){
                let typeName = object[propName].name;

                resultObj[propName] = typeName;    
            }else if(object[propName] instanceof BSLType){
                let typeName = object[propName].name;

                resultObj[propName] = typeName; 
            }else if(object[propName] instanceof Array){
                resultObj[propName] = [];
                for(let i in object[propName]){
                    parseProps(resultObj[propName], object[propName], i, noSource, mapping);
                }
            }else if(object[propName] instanceof Map){
                resultObj[propName] = {
                    class: "Map",
                    data: Object.fromEntries(object[propName])
                };
            }else if(typeof(object[propName]) === "object"){
                let propProto = Object.getPrototypeOf(object[propName]);
                if(propProto.constructor !== undefined && propProto.constructor.toString().substring(0, 5) === 'class'){
                    resultObj[propName] = this.serialize(object[propName], noSource, mapping);
                }
            }else{
                resultObj[propName] = object[propName];
            }
        };

        for(let propName of propNames){
            if(noSource && this.#noCompile[className] !== undefined && this.#noCompile[className].indexOf(propName) != -1) continue;
            if(noSource && ["pos", "lineNo"].indexOf(propName) != -1) continue;

            if(propName === "$owner") continue;
            parseProps(resultObj, object, propName, noSource, mapping);
        }

        return resultObj;
    }

    deserialize(object){
        let path = require('node:path');
        let normalizedPath = path.join(__dirname, "AST"),
            Nodes = {};

        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            let requiredFile = require("./AST/" + file),
                keys = Object.keys(requiredFile);

            for(let key of keys){
                let obj = requiredFile[key];
                if(obj.prototype !== undefined && obj.prototype.constructor.toString().substring(0, 5) === 'class'){
                    Nodes[obj.name] = obj;
                }
            }
        });

        normalizedPath = path.join(__dirname, "globalContext/objects")

        require("fs").readdirSync(normalizedPath).forEach(function(file) {
            let requiredFile = require("./globalContext/objects/" + file),
                keys = Object.keys(requiredFile);

            for(let key of keys){
                let obj = requiredFile[key];
                if(obj.prototype !== undefined && obj.prototype.constructor.toString().substring(0, 5) === 'class'){
                    Nodes[obj.name] = obj;
                }
            }
        });

        Nodes["BSLToken"] = require("./token")["BSLToken"];

        let deserializeObj = (object)=>{
            let className = object.class,
                propNames = Object.keys(object);

            if(className === "Map"){
                return new Map(Object.entries(object.data));
            }else if(className === "BSLString" ||
                className === "BSLNumber" ||
                className === "BSLDate"
            ){
                return new Nodes[className](object.data);
            }else if(className === "BSLUndefined"){
                return require('./globalContext/objects/undefinedNull').BSLUndefined;
            }else if(className === "BSLNull"){
                return require('./globalContext/objects/undefinedNull').BSLNull;
            }

            let resultObj = new Nodes[className](undefined),
                objProps = Object.keys(resultObj);

            for(let propName of propNames){
                if(objProps.indexOf(propName) >= 0){
                    parseProps(resultObj, object, propName);
                }
            }

            return resultObj;
        }

        let parseProps = (resultObj, object, propName)=>{
            let propValue = object[propName];
                    
            if(propName === "type"){
                resultObj[propName] = require('./tokenTypes').tokenTypeList[propValue];    
            }else if(propName === "$type"){
                resultObj[propName] = require("./globalContext/objects/type").BSLAvailableTypes[propValue];
            }else if(propValue instanceof Array){
                resultObj[propName] = [];
                for(let i in propValue){
                    parseProps(resultObj[propName], propValue, i);
                }
            }else if(typeof(propValue) === 'object'){
                resultObj[propName] = deserializeObj(propValue);    
            }else 
                resultObj[propName] = propValue;
        };

        return deserializeObj(object);
    }
}