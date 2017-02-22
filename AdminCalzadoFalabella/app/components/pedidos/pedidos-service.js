'use strict';
var _,

    _consts,
    dataService = require('../../dataProviders/backendServices'),
    // additional requires

    consts;

var Everlive = require('../../everlive/everlive.all.min');

function Service() {}

function onRequestSuccess(data) {
    return data.result;
}

function onRequestFail(err) {
    alert(JSON.stringify(err));
    return err;
}

Service.prototype.getAllRecords = function(filter) {
    var filter = new Everlive.Query();
    filter.orderDesc("estado");

    var expandExp,
        data = dataService.data('pedidos');

    expandExp = {
        producto: {
            "TargetTypeName": "productos",
            "ReturnAs":"productoExpand"
        },
    };


    


    return data.expand(expandExp).get(filter)
        .then(onRequestSuccess.bind(this))
        .catch(onRequestFail.bind(this));
};

Service.prototype.configuration = dataService.setup;

// additional properties

// START_CUSTOM_CODE_pedidos
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_pedidos
module.exports = new Service();